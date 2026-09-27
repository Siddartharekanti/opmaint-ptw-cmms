import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { recordAuditEntry } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUserFromRequest(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { id } = params;
    const { action, notes } = await req.json();

    if (!action || !action.trim()) {
      return NextResponse.json({ error: 'Work action description is required.' }, { status: 400 });
    }

    const permit = await prisma.permit.findUnique({ where: { id } });
    if (!permit) {
      return NextResponse.json({ error: 'Permit not found.' }, { status: 404 });
    }

    // MANDATORY RULE: Work cannot be logged against a permit that isn't ACTIVE!
    if (permit.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: `Safety Violation: Work cannot be logged against a permit that isn't ACTIVE. Current status: ${permit.status}`,
          code: 'PERMIT_NOT_ACTIVE',
        },
        { status: 400 }
      );
    }

    const log = await prisma.workLog.create({
      data: {
        permitId: id,
        loggedById: currentUser.userId,
        loggedByName: currentUser.name,
        action: action.trim(),
        notes: notes ? notes.trim() : null,
      },
    });

    await recordAuditEntry({
      permitId: id,
      userId: currentUser.userId,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'WORK_LOG_ADDED',
      fromStatus: permit.status,
      toStatus: permit.status,
      comment: `Work entry logged: "${action.trim()}"`,
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('Error logging work against permit:', error);
    return NextResponse.json({ error: error.message || 'Failed to log work' }, { status: 500 });
  }
}
