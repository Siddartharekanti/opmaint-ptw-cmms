import { PermitStatus, UserRole } from './types/permit';

export interface PermitContext {
  id: string;
  permitNumber: string;
  status: PermitStatus;
  requesterId: string;
  areaId: string;
  plantId: string;
  plannedStartTime: Date;
  plannedEndTime: Date;
  extendedUntil?: Date | null;
  approvals: Array<{
    id: string;
    approverId: string;
    roleAtApproval: string;
    status: 'APPROVED' | 'REJECTED';
  }>;
}

export interface UserContext {
  id: string;
  name: string;
  role: UserRole;
  assignedAreaId?: string | null;
}

export type PermitAction =
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'ACTIVATE'
  | 'SUSPEND'
  | 'RESUME'
  | 'CLOSE'
  | 'VERIFY_CLOSURE'
  | 'CANCEL'
  | 'EXPIRE'
  | 'EXTEND';

export class StateMachineError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, code: string = 'ILLEGAL_TRANSITION', statusCode: number = 400) {
    super(message);
    this.name = 'StateMachineError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Checks if a permit is expired given its end time or extension
 */
export function isPermitExpired(permit: { plannedEndTime: Date; extendedUntil?: Date | null }, now: Date = new Date()): boolean {
  const effectiveEnd = permit.extendedUntil ? new Date(permit.extendedUntil) : new Date(permit.plannedEndTime);
  return now.getTime() > effectiveEnd.getTime();
}

/**
 * Checks if a permit is expiring within N hours (default 2 hours)
 */
export function isPermitExpiringSoon(
  permit: { status: PermitStatus; plannedEndTime: Date; extendedUntil?: Date | null },
  hoursThreshold: number = 2,
  now: Date = new Date()
): boolean {
  if (permit.status !== 'ACTIVE' && permit.status !== 'APPROVED') return false;
  const effectiveEnd = permit.extendedUntil ? new Date(permit.extendedUntil) : new Date(permit.plannedEndTime);
  const diffMs = effectiveEnd.getTime() - now.getTime();
  const thresholdMs = hoursThreshold * 60 * 60 * 1000;
  return diffMs > 0 && diffMs <= thresholdMs;
}

/**
 * Determines whether a user has permission to perform a specific action on a permit
 */
export function canUserPerformAction(
  action: PermitAction,
  permit: PermitContext,
  user: UserContext,
  now: Date = new Date()
): { allowed: boolean; reason?: string } {
  // CRITICAL RULE: A person can NEVER approve or reject their own permit
  if ((action === 'APPROVE' || action === 'REJECT') && permit.requesterId === user.id) {
    return {
      allowed: false,
      reason: 'Anti-Self-Approval Rule: You cannot approve or reject a permit you requested.',
    };
  }

  // Check if permit is already expired for non-expiry actions
  if (action !== 'EXPIRE' && action !== 'CANCEL') {
    if (['APPROVED', 'ACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'].includes(permit.status)) {
      if (isPermitExpired(permit, now)) {
        return {
          allowed: false,
          reason: 'Validity window has passed. This permit has expired and must be marked EXPIRED.',
        };
      }
    }
  }

  switch (action) {
    case 'SUBMIT': {
      if (permit.status !== 'DRAFT') {
        return { allowed: false, reason: `Permit in ${permit.status} state cannot be submitted.` };
      }
      if (user.role !== 'ADMIN' && permit.requesterId !== user.id) {
        return { allowed: false, reason: 'Only the permit requester or an admin can submit this permit.' };
      }
      return { allowed: true };
    }

    case 'APPROVE': {
      if (permit.status !== 'PENDING_APPROVAL') {
        return { allowed: false, reason: `Permits can only be approved when PENDING_APPROVAL. Current state: ${permit.status}` };
      }

      // Requester cannot approve
      if (user.role === 'REQUESTER') {
        return { allowed: false, reason: 'Requesters do not hold approval authority.' };
      }

      // Area Owner can only approve permits in their assigned area
      if (user.role === 'AREA_OWNER') {
        if (!user.assignedAreaId || user.assignedAreaId !== permit.areaId) {
          return { allowed: false, reason: 'Area Owners can only approve permits located in their assigned area.' };
        }
        // Check if Area Owner has already approved
        const alreadyApproved = permit.approvals.some(
          (a) => a.approverId === user.id && a.status === 'APPROVED'
        );
        if (alreadyApproved) {
          return { allowed: false, reason: 'You have already approved this permit.' };
        }
        return { allowed: true };
      }

      // Safety Officer can approve any permit
      if (user.role === 'SAFETY_OFFICER' || user.role === 'ADMIN') {
        const alreadyApproved = permit.approvals.some(
          (a) => a.approverId === user.id && a.status === 'APPROVED'
        );
        if (alreadyApproved) {
          return { allowed: false, reason: 'You have already approved this permit.' };
        }
        return { allowed: true };
      }

      return { allowed: false, reason: 'Unauthorized role for approval.' };
    }

    case 'REJECT': {
      if (permit.status !== 'PENDING_APPROVAL') {
        return { allowed: false, reason: `Permits can only be rejected when PENDING_APPROVAL. Current state: ${permit.status}` };
      }
      if (user.role === 'REQUESTER') {
        return { allowed: false, reason: 'Requesters cannot reject permits.' };
      }
      if (user.role === 'AREA_OWNER' && user.assignedAreaId !== permit.areaId) {
        return { allowed: false, reason: 'Area Owners can only reject permits in their assigned area.' };
      }
      return { allowed: true };
    }

    case 'ACTIVATE': {
      if (permit.status !== 'APPROVED') {
        return { allowed: false, reason: `Permit must be in APPROVED state to be activated. Current state: ${permit.status}` };
      }

      // Rule: cannot go ACTIVE before planned start time
      const plannedStart = new Date(permit.plannedStartTime);
      if (now.getTime() < plannedStart.getTime()) {
        return {
          allowed: false,
          reason: `Permit cannot be activated before its planned start time (${plannedStart.toISOString()}).`,
        };
      }

      // Rule: must verify all required approvers have approved
      const hasAreaOwnerApproval = permit.approvals.some(
        (a) => (a.roleAtApproval === 'AREA_OWNER' || a.roleAtApproval === 'ADMIN') && a.status === 'APPROVED'
      );
      const hasSafetyOfficerApproval = permit.approvals.some(
        (a) => (a.roleAtApproval === 'SAFETY_OFFICER' || a.roleAtApproval === 'ADMIN') && a.status === 'APPROVED'
      );

      if (!hasAreaOwnerApproval || !hasSafetyOfficerApproval) {
        return {
          allowed: false,
          reason: 'Cannot activate: Requires approval from both Area Owner and Safety Officer.',
        };
      }

      // Requester, Safety Officer, or Admin can trigger activation
      if (user.id !== permit.requesterId && user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only the requester, safety officer, or admin can activate this permit.' };
      }

      return { allowed: true };
    }

    case 'SUSPEND': {
      if (permit.status !== 'ACTIVE') {
        return { allowed: false, reason: `Only ACTIVE permits can be suspended. Current state: ${permit.status}` };
      }
      // Safety Officer and Admin can suspend any active permit immediately
      if (user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only Safety Officers or Admins have emergency suspension authority.' };
      }
      return { allowed: true };
    }

    case 'RESUME': {
      if (permit.status !== 'SUSPENDED') {
        return { allowed: false, reason: `Only SUSPENDED permits can be resumed. Current state: ${permit.status}` };
      }
      if (user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only Safety Officers or Admins can resume a suspended permit.' };
      }
      return { allowed: true };
    }

    case 'CLOSE': {
      if (permit.status !== 'ACTIVE') {
        return { allowed: false, reason: `Only ACTIVE permits can be submitted for closure. Current state: ${permit.status}` };
      }
      // Requester marks work complete
      if (user.id !== permit.requesterId && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only the permit requester or admin can mark work completed.' };
      }
      return { allowed: true };
    }

    case 'VERIFY_CLOSURE': {
      if (permit.status !== 'CLOSED') {
        return { allowed: false, reason: `Permit must be in CLOSED state for verification. Current state: ${permit.status}` };
      }
      // Safety Officer performs closure verification
      if (user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only Safety Officers or Admins can verify permit closure.' };
      }
      return { allowed: true };
    }

    case 'CANCEL': {
      const nonTerminal = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'SUSPENDED'];
      if (!nonTerminal.includes(permit.status)) {
        return { allowed: false, reason: `Permit in terminal state ${permit.status} cannot be cancelled.` };
      }
      if (user.id !== permit.requesterId && user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Only requester, safety officer, or admin can cancel a permit.' };
      }
      return { allowed: true };
    }

    case 'EXPIRE': {
      const expirableStates = ['APPROVED', 'ACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'];
      if (!expirableStates.includes(permit.status)) {
        return { allowed: false, reason: `Permit in ${permit.status} cannot transition to EXPIRED.` };
      }
      if (!isPermitExpired(permit, now)) {
        return { allowed: false, reason: 'Cannot expire: Permit validity window has not elapsed.' };
      }
      return { allowed: true };
    }

    case 'EXTEND': {
      if (permit.status !== 'ACTIVE') {
        return { allowed: false, reason: 'Only ACTIVE permits can be extended.' };
      }
      if (isPermitExpired(permit, now)) {
        return { allowed: false, reason: 'Expired permits cannot be extended. A new permit must be raised.' };
      }
      if (user.role !== 'SAFETY_OFFICER' && user.role !== 'ADMIN') {
        return { allowed: false, reason: 'Extension must be approved by Safety Officer or Admin.' };
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Unknown action.' };
  }
}

/**
 * Validates and computes next state transition
 */
export function getNextPermitState(
  action: PermitAction,
  permit: PermitContext,
  user: UserContext,
  now: Date = new Date(),
  additionalApprovalsCount: number = 0
): PermitStatus {
  const check = canUserPerformAction(action, permit, user, now);
  if (!check.allowed) {
    throw new StateMachineError(check.reason || 'Illegal state transition.', 'ILLEGAL_TRANSITION', 400);
  }

  switch (action) {
    case 'SUBMIT':
      return 'PENDING_APPROVAL';

    case 'APPROVE': {
      // Check if this approval satisfies all required approvals:
      // Area Owner + Safety Officer
      const existingApprovals = permit.approvals.filter((a) => a.status === 'APPROVED');
      const hasAreaOwner =
        existingApprovals.some((a) => a.roleAtApproval === 'AREA_OWNER') ||
        user.role === 'AREA_OWNER' ||
        user.role === 'ADMIN';

      const hasSafetyOfficer =
        existingApprovals.some((a) => a.roleAtApproval === 'SAFETY_OFFICER') ||
        user.role === 'SAFETY_OFFICER' ||
        user.role === 'ADMIN';

      // Total unique required approvals: 2 (Area Owner + Safety Officer)
      const totalApprovals = existingApprovals.length + 1;
      if (hasAreaOwner && hasSafetyOfficer && totalApprovals >= 2) {
        return 'APPROVED';
      }
      return 'PENDING_APPROVAL'; // remains pending until second approver approves
    }

    case 'REJECT':
      return 'REJECTED';

    case 'ACTIVATE':
      return 'ACTIVE';

    case 'SUSPEND':
      return 'SUSPENDED';

    case 'RESUME':
      return 'ACTIVE';

    case 'CLOSE':
      return 'CLOSED';

    case 'VERIFY_CLOSURE':
      return 'CLOSED_VERIFIED';

    case 'CANCEL':
      return 'CANCELLED';

    case 'EXPIRE':
      return 'EXPIRED';

    case 'EXTEND':
      return 'ACTIVE';

    default:
      throw new StateMachineError(`Unhandled action: ${action}`, 'UNKNOWN_ACTION', 400);
  }
}
