import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import {
  canUserPerformAction,
  getNextPermitState,
  PermitAction,
  PermitContext,
  UserContext,
  StateMachineError,
} from '@/lib/state-machine';
import { recordAuditEntry } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUserFromRequest(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const action = body.action as PermitAction;
    const { comment, rejectionReason, suspensionReason, completionNotes, verificationNotes, digitalSignature, extensionHours } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter.' }, { status: 400 });
    }

    // Mandatory reason validations
    if (action === 'REJECT' && (!rejectionReason || !rejectionReason.trim())) {
      return NextResponse.json({ error: 'A mandatory rejection reason is required to reject a permit.' }, { status: 400 });
    }

    if (action === 'SUSPEND' && (!suspensionReason || !suspensionReason.trim())) {
      return NextResponse.json({ error: 'A mandatory reason is required to suspend an active permit.' }, { status: 400 });
    }

    if (action === 'CLOSE' && (!completionNotes || !completionNotes.trim())) {
      return NextResponse.json({ error: 'Completion notes are mandatory when marking work closed.' }, { status: 400 });
    }

    if (action === 'VERIFY_CLOSURE' && (!verificationNotes || !verificationNotes.trim())) {
      return NextResponse.json({ error: 'Safety Officer verification notes are mandatory.' }, { status: 400 });
    }

    // Fetch the permit with approvals
    const permit = await prisma.permit.findUnique({
      where: { id },
      include: {
        approvals: true,
      },
    });

    if (!permit) {
      return NextResponse.json({ error: 'Permit not found.' }, { status: 404 });
    }

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

    const now = new Date();

    // 1. Strict Server-Side Validation Check
    const validation = canUserPerformAction(action, permitContext, userContext, now);
    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: validation.reason || 'Illegal state transition rejected by safety rules.',
          code: 'ILLEGAL_TRANSITION',
        },
        { status: 403 }
      );
    }

    // 2. Compute Next State
    const nextStatus = getNextPermitState(action, permitContext, userContext, now);

    // 3. Database Updates in a Transaction
    const updatedPermit = await prisma.$transaction(async (tx) => {
      const updatePayload: any = {
        status: nextStatus,
      };

      if (action === 'ACTIVATE') {
        updatePayload.actualStartTime = now;
      }

      if (action === 'CLOSE') {
        updatePayload.actualEndTime = now;
        updatePayload.completionNotes = completionNotes;
      }

      if (action === 'VERIFY_CLOSURE') {
        updatePayload.verificationNotes = verificationNotes;
      }

      if (action === 'SUSPEND') {
        updatePayload.suspensionReason = suspensionReason;
      }

      if (action === 'REJECT') {
        updatePayload.rejectionReason = rejectionReason;
      }

      if (action === 'EXTEND') {
        const hours = parseInt(extensionHours || '2', 10);
        const currentEnd = permit.extendedUntil ? new Date(permit.extendedUntil) : new Date(permit.plannedEndTime);
        const newEndTime = new Date(currentEnd.getTime() + hours * 60 * 60 * 1000);
        updatePayload.extendedUntil = newEndTime;
        updatePayload.extensionCount = permit.extensionCount + 1;
      }

      // If action is APPROVE or REJECT, create Approval record
      if (action === 'APPROVE') {
        await tx.approval.create({
          data: {
            permitId: permit.id,
            approverId: currentUser.userId,
            roleAtApproval: currentUser.role,
            status: 'APPROVED',
            comment: comment || 'Safety requirements verified and approved.',
            digitalSignature: digitalSignature || null,
          },
        });
      } else if (action === 'REJECT') {
        await tx.approval.create({
          data: {
            permitId: permit.id,
            approverId: currentUser.userId,
            roleAtApproval: currentUser.role,
            status: 'REJECTED',
            rejectionReason: rejectionReason,
            comment: comment || null,
          },
        });
      }

      const res = await tx.permit.update({
        where: { id: permit.id },
        data: updatePayload,
        include: { approvals: true },
      });

      // Write Immutable Audit Log
      await tx.auditLog.create({
        data: {
          permitId: permit.id,
          userId: currentUser.userId,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: action,
          fromStatus: permit.status,
          toStatus: nextStatus,
          comment:
            comment ||
            rejectionReason ||
            suspensionReason ||
            completionNotes ||
            verificationNotes ||
            `Action ${action} executed by ${currentUser.name} (${currentUser.role}).`,
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      permit: updatedPermit,
      previousStatus: permit.status,
      currentStatus: nextStatus,
    });
  } catch (error: any) {
    console.error('Error executing permit action:', error);
    if (error instanceof StateMachineError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 });
  }
}
