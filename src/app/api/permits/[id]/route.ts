import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { autoExpirePassedPermits } from '@/lib/expiry-handler';
import { canUserPerformAction, PermitAction, PermitContext, UserContext } from '@/lib/state-machine';
import { recordAuditEntry } from '@/lib/audit';
import { detectPermitConflicts } from '@/lib/conflict-detection';
import QRCode from 'qrcode';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await autoExpirePassedPermits();

    const currentUser = getCurrentUserFromRequest(req);
    const { id } = params;

    const permit = await prisma.permit.findUnique({
      where: { id },
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
            phone: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, email: true, role: true, department: true },
            },
          },
          orderBy: { timestamp: 'asc' },
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' },
        },
        workLogs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!permit) {
      return NextResponse.json({ error: 'Permit not found' }, { status: 404 });
    }

    // Parse JSON fields
    const parsedPermit = {
      ...permit,
      hazardsIdentified: JSON.parse(permit.hazardsIdentified || '[]'),
      ppeRequired: JSON.parse(permit.ppeRequired || '[]'),
      precautionsChecklist: JSON.parse(permit.precautionsChecklist || '[]'),
      typeSpecificData: JSON.parse(permit.typeSpecificData || '{}'),
    };

    // Calculate allowed actions for the current user
    const allowedActions: Record<PermitAction, { allowed: boolean; reason?: string }> = {} as any;

    if (currentUser) {
      const permitContext: PermitContext = {
        id: permit.id,
        permitNumber: permit.permitNumber,
        status: permit.status as any,
        requesterId: permit.requesterId,
        areaId: permit.areaId,
        plantId: permit.plantId,
        plannedStartTime: permit.plannedStartTime,
        plannedEndTime: permit.plannedEndTime,
        extendedUntil: permit.extendedUntil,
        approvals: permit.approvals.map((a) => ({
          id: a.id,
          approverId: a.approverId,
          roleAtApproval: a.roleAtApproval,
          status: a.status as any,
        })),
      };

      const userContext: UserContext = {
        id: currentUser.userId,
        name: currentUser.name,
        role: currentUser.role,
        assignedAreaId: currentUser.assignedAreaId,
      };

      const actions: PermitAction[] = [
        'SUBMIT',
        'APPROVE',
        'REJECT',
        'ACTIVATE',
        'SUSPEND',
        'RESUME',
        'CLOSE',
        'VERIFY_CLOSURE',
        'CANCEL',
        'EXTEND',
      ];

      actions.forEach((act) => {
        allowedActions[act] = canUserPerformAction(act, permitContext, userContext);
      });
    }

    // Generate QR Code for physical walk-around inspections
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const permitVerificationUrl = `${origin}/permits/${permit.id}`;
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(permitVerificationUrl, {
        margin: 1,
        width: 240,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.error('QR code generation error:', e);
    }

    // Check conflict warnings with active permits in same plant/area
    const otherActive = await prisma.permit.findMany({
      where: {
        id: { not: permit.id },
        status: { notIn: ['CLOSED', 'CLOSED_VERIFIED', 'REJECTED', 'EXPIRED', 'CANCELLED'] },
        areaId: permit.areaId,
      },
      include: { equipment: true, area: true },
    });

    const conflictWarnings = detectPermitConflicts(
      {
        id: permit.id,
        permitType: permit.permitType,
        areaId: permit.areaId,
        equipmentId: permit.equipmentId,
        plannedStartTime: permit.plannedStartTime,
        plannedEndTime: permit.extendedUntil || permit.plannedEndTime,
      },
      otherActive.map((p) => ({
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
        extendedUntil: p.extendedUntil,
      }))
    );

    return NextResponse.json({
      permit: parsedPermit,
      allowedActions,
      qrCodeDataUrl,
      conflictWarnings,
    });
  } catch (error) {
    console.error('Error fetching permit details:', error);
    return NextResponse.json({ error: 'Failed to fetch permit' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUserFromRequest(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.permit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Permit not found' }, { status: 404 });
    }

    // Check permissions to edit
    if (existing.status === 'DRAFT') {
      if (currentUser.role !== 'ADMIN' && currentUser.userId !== existing.requesterId) {
        return NextResponse.json({ error: 'Only requester or admin can edit a draft permit.' }, { status: 403 });
      }
    }

    // Build diff for audit trail
    const changes: Record<string, { from: any; to: any }> = {};
    const updateData: any = {};

    const fieldsToTrack = [
      'title',
      'description',
      'contractorTeam',
      'plannedStartTime',
      'plannedEndTime',
      'hazardsIdentified',
      'ppeRequired',
      'precautionsChecklist',
      'typeSpecificData',
    ];

    fieldsToTrack.forEach((field) => {
      if (body[field] !== undefined) {
        const newVal = typeof body[field] === 'object' ? JSON.stringify(body[field]) : body[field];
        const oldVal = (existing as any)[field];
        if (newVal !== oldVal) {
          changes[field] = { from: oldVal, to: newVal };
          updateData[field] = newVal;
        }
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: 'No changes detected.' });
    }

    const updated = await prisma.permit.update({
      where: { id },
      data: updateData,
    });

    // Record immutable audit entry
    await recordAuditEntry({
      permitId: id,
      userId: currentUser.userId,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'UPDATED_FIELDS',
      fromStatus: existing.status,
      toStatus: updated.status,
      comment: body.editComment || 'Permit fields updated after review.',
      changes,
    });

    return NextResponse.json({ success: true, permit: updated });
  } catch (error: any) {
    console.error('Error updating permit:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
