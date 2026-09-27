import { prisma } from './prisma';

export interface CreateAuditEntryParams {
  permitId: string;
  userId?: string | null;
  userName: string;
  userRole: string;
  action: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  comment?: string | null;
  changes?: Record<string, { from: any; to: any }> | null;
}

export async function recordAuditEntry(params: CreateAuditEntryParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        permitId: params.permitId,
        userId: params.userId,
        userName: params.userName,
        userRole: params.userRole,
        action: params.action,
        fromStatus: params.fromStatus,
        toStatus: params.toStatus,
        comment: params.comment,
        changesJson: params.changes ? JSON.stringify(params.changes) : null,
      },
    });
  } catch (error) {
    console.error('Failed to write immutable audit log entry:', error);
    // In production safety systems, failing to write audit logs must be treated as critical
    throw error;
  }
}
