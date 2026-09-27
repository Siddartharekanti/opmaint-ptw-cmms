import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { autoExpirePassedPermits } from '@/lib/expiry-handler';
import { isPermitExpiringSoon } from '@/lib/state-machine';
import { recordAuditEntry } from '@/lib/audit';
import { detectPermitConflicts } from '@/lib/conflict-detection';
import { PermitStatus } from '@/lib/types/permit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. First, run the automatic expiry engine to ensure validity timestamps are current
    try {
      await autoExpirePassedPermits();
    } catch (e) {
      console.warn('Auto-expire non-fatal warning:', e);
    }

    const currentUser = getCurrentUserFromRequest(req);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const permitType = searchParams.get('permitType');
    const areaId = searchParams.get('areaId');
    const plantId = searchParams.get('plantId');
    const search = searchParams.get('search');
    const myApprovalsPending = searchParams.get('myApprovalsPending') === 'true';

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (permitType && permitType !== 'ALL') {
      whereClause.permitType = permitType;
    }

    if (areaId && areaId !== 'ALL') {
      whereClause.areaId = areaId;
    }

    if (plantId && plantId !== 'ALL') {
      whereClause.plantId = plantId;
    }

    if (search) {
      whereClause.OR = [
        { permitNumber: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { contractorTeam: { contains: search } },
      ];
    }

    // Filter "My Approvals Pending"
    if (myApprovalsPending && currentUser) {
      whereClause.status = 'PENDING_APPROVAL';

      // Anti-self-approval: cannot approve own permit
      whereClause.requesterId = { not: currentUser.userId };

      if (currentUser.role === 'AREA_OWNER') {
        whereClause.areaId = currentUser.assignedAreaId || 'none';
      }
      // SAFETY_OFFICER and ADMIN can approve any permit
    }

    const permits = await prisma.permit.findMany({
      where: whereClause,
      include: {
        plant: true,
        area: true,
        equipment: true,
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute high-level dashboard metrics
    const now = new Date();
    const allPermitsForMetrics = await prisma.permit.findMany({
      select: {
        id: true,
        permitNumber: true,
        status: true,
        areaId: true,
        requesterId: true,
        plannedStartTime: true,
        plannedEndTime: true,
        extendedUntil: true,
        approvals: { select: { approverId: true } },
      },
    });

    let activeCount = 0;
    let expiringSoonCount = 0;
    let pendingApprovalCount = 0;
    let myPendingApprovalsCount = 0;
    let suspendedCount = 0;

    for (const p of allPermitsForMetrics) {
      if (p.status === 'ACTIVE') {
        activeCount++;
      }
      if (p.status === 'SUSPENDED') {
        suspendedCount++;
      }
      if (p.status === 'PENDING_APPROVAL') {
        pendingApprovalCount++;
        if (currentUser) {
          // Check if eligible for my approval
          const notMine = p.requesterId !== currentUser.userId;
          const notAlreadyApproved = !p.approvals.some((a) => a.approverId === currentUser.userId);
          let roleMatch = false;

          if (currentUser.role === 'AREA_OWNER' && currentUser.assignedAreaId === p.areaId) {
            roleMatch = true;
          } else if (currentUser.role === 'SAFETY_OFFICER' || currentUser.role === 'ADMIN') {
            roleMatch = true;
          }

          if (notMine && notAlreadyApproved && roleMatch) {
            myPendingApprovalsCount++;
          }
        }
      }

      if (isPermitExpiringSoon({ status: p.status as PermitStatus, plannedEndTime: p.plannedEndTime, extendedUntil: p.extendedUntil }, 2, now)) {
        expiringSoonCount++;
      }
    }

    return NextResponse.json({
      permits,
      metrics: {
        total: allPermitsForMetrics.length,
        activeCount,
        expiringSoonCount,
        pendingApprovalCount,
        myPendingApprovalsCount,
        suspendedCount,
      },
    });
  } catch (error: any) {
    console.error('Error listing permits:', error);
    return NextResponse.json({ error: error?.message || 'Failed to retrieve permits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUserFromRequest(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      permitType,
      plantId,
      areaId,
      equipmentId,
      contractorTeam,
      plannedStartTime,
      plannedEndTime,
      hazardsIdentified,
      ppeRequired,
      precautionsChecklist,
      typeSpecificData,
      submitImmediately, // boolean: true -> PENDING_APPROVAL, false -> DRAFT
    } = body;

    if (!title || !description || !permitType || !plantId || !areaId || !plannedStartTime || !plannedEndTime) {
      return NextResponse.json({ error: 'Missing mandatory core permit fields.' }, { status: 400 });
    }

    // Generate unique serial permit number: PTW-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const count = await prisma.permit.count();
    const serial = String(count + 1).padStart(4, '0');
    const permitNumber = `PTW-${currentYear}-${serial}`;

    const initialStatus = submitImmediately ? 'PENDING_APPROVAL' : 'DRAFT';

    // Conflict detection check
    const existingActive = await prisma.permit.findMany({
      where: {
        status: { notIn: ['CLOSED', 'CLOSED_VERIFIED', 'REJECTED', 'EXPIRED', 'CANCELLED'] },
        areaId,
      },
      include: { equipment: true, area: true },
    });

    const conflictWarnings = detectPermitConflicts(
      {
        permitType,
        areaId,
        equipmentId,
        plannedStartTime,
        plannedEndTime,
      },
      existingActive.map((p) => ({
        id: p.id,
        permitNumber: p.permitNumber,
        title: p.title,
        permitType: p.permitType,
        status: p.status,
        areaId: p.areaId,
        equipmentId: p.equipmentId,
        equipmentTag: p.equipment?.tag || null,
        plannedStartTime: p.plannedStartTime,
        plannedEndTime: p.plannedEndTime,
      }))
    );

    const permit = await prisma.permit.create({
      data: {
        permitNumber,
        title,
        description,
        permitType,
        status: initialStatus,
        plantId,
        areaId,
        equipmentId: equipmentId || null,
        requesterId: currentUser.userId,
        contractorTeam: contractorTeam || 'Internal Plant Crew',
        plannedStartTime: new Date(plannedStartTime),
        plannedEndTime: new Date(plannedEndTime),
        hazardsIdentified: JSON.stringify(hazardsIdentified || []),
        ppeRequired: JSON.stringify(ppeRequired || []),
        precautionsChecklist: JSON.stringify(precautionsChecklist || []),
        typeSpecificData: JSON.stringify(typeSpecificData || {}),
      },
      include: {
        plant: true,
        area: true,
        equipment: true,
      },
    });

    // Record Immutable Audit Log
    await recordAuditEntry({
      permitId: permit.id,
      userId: currentUser.userId,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: submitImmediately ? 'SUBMITTED' : 'CREATED_DRAFT',
      fromStatus: null,
      toStatus: initialStatus,
      comment: submitImmediately
        ? 'Permit created and immediately submitted for Area Owner and Safety sign-off.'
        : 'Permit created as Draft.',
    });

    return NextResponse.json({
      success: true,
      permit,
      conflictWarnings,
    });
  } catch (error: any) {
    console.error('Error creating permit:', error);
    return NextResponse.json({ error: error.message || 'Failed to create permit' }, { status: 500 });
  }
}
