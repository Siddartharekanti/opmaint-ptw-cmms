import { describe, it, expect } from 'vitest';
import { canUserPerformAction, PermitContext, UserContext } from '../src/lib/state-machine';

describe('Server-Side Security & Invariant Rules Verification', () => {
  const mockUser: UserContext = {
    id: 'user-007',
    name: 'Inspector Suresh',
    role: 'AREA_OWNER',
    assignedAreaId: 'area-1',
  };

  const createPermit = (status: any, requesterId = 'user-999'): PermitContext => ({
    id: 'p-1',
    permitNumber: 'PTW-TEST-001',
    status,
    requesterId,
    areaId: 'area-1',
    plantId: 'plant-1',
    plannedStartTime: new Date(Date.now() - 3600000),
    plannedEndTime: new Date(Date.now() + 3600000),
    approvals: [],
  });

  it('rejects work logging if permit is not ACTIVE (e.g. DRAFT or PENDING_APPROVAL)', () => {
    const draftPermit = createPermit('DRAFT');
    expect(draftPermit.status).not.toBe('ACTIVE');

    const pendingPermit = createPermit('PENDING_APPROVAL');
    expect(pendingPermit.status).not.toBe('ACTIVE');
  });

  it('rejects approval from requester even if requester has ADMIN role', () => {
    const adminUser: UserContext = {
      id: 'admin-1',
      name: 'System Admin',
      role: 'ADMIN',
    };

    const adminPermit = createPermit('PENDING_APPROVAL', 'admin-1'); // requested by admin!
    const check = canUserPerformAction('APPROVE', adminPermit, adminUser);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Anti-Self-Approval Rule');
  });

  it('rejects activating a permit before planned start time', () => {
    const futurePermit: PermitContext = {
      ...createPermit('APPROVED'),
      plannedStartTime: new Date(Date.now() + 1000000), // in the future
      approvals: [
        { id: '1', approverId: 'ao', roleAtApproval: 'AREA_OWNER', status: 'APPROVED' },
        { id: '2', approverId: 'so', roleAtApproval: 'SAFETY_OFFICER', status: 'APPROVED' },
      ],
    };

    const check = canUserPerformAction('ACTIVATE', futurePermit, mockUser);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('cannot be activated before its planned start time');
  });

  it('rejects activating a permit that does not have both Area Owner and Safety Officer approvals', () => {
    const permitWithoutBothApprovals: PermitContext = {
      ...createPermit('APPROVED'),
      approvals: [
        { id: '1', approverId: 'ao', roleAtApproval: 'AREA_OWNER', status: 'APPROVED' },
        // Safety officer missing
      ],
    };

    const check = canUserPerformAction('ACTIVATE', permitWithoutBothApprovals, mockUser);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Requires approval from both Area Owner and Safety Officer');
  });
});
