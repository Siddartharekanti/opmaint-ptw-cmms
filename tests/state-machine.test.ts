import { describe, it, expect } from 'vitest';
import {
  canUserPerformAction,
  getNextPermitState,
  isPermitExpired,
  isPermitExpiringSoon,
  StateMachineError,
  PermitContext,
  UserContext,
} from '../src/lib/state-machine';

describe('PTW State Machine & Safety Policy Enforcement', () => {
  const baseRequester: UserContext = {
    id: 'user-requester-1',
    name: 'Rajesh Technician',
    role: 'REQUESTER',
  };

  const baseAreaOwner: UserContext = {
    id: 'user-areaowner-1',
    name: 'Suresh Area Owner',
    role: 'AREA_OWNER',
    assignedAreaId: 'area-boiler-house',
  };

  const otherAreaOwner: UserContext = {
    id: 'user-areaowner-2',
    name: 'Ramesh Paint Area Owner',
    role: 'AREA_OWNER',
    assignedAreaId: 'area-paint-shop',
  };

  const baseSafetyOfficer: UserContext = {
    id: 'user-safety-1',
    name: 'Priya Safety Lead',
    role: 'SAFETY_OFFICER',
  };

  const now = new Date('2026-09-27T10:00:00Z');
  const pastTime = new Date('2026-09-27T08:00:00Z');
  const futureTime = new Date('2026-09-27T16:00:00Z');

  const createMockPermit = (overrides: Partial<PermitContext> = {}): PermitContext => ({
    id: 'permit-1',
    permitNumber: 'PTW-2026-0001',
    status: 'PENDING_APPROVAL',
    requesterId: 'user-requester-1',
    areaId: 'area-boiler-house',
    plantId: 'plant-chennai',
    plannedStartTime: pastTime,
    plannedEndTime: futureTime,
    extendedUntil: null,
    approvals: [],
    ...overrides,
  });

  describe('Key Rule: Anti-Self-Approval Prohibition', () => {
    it('STRICTLY PROHIBITS a user from approving their own permit, even if they are Safety Officer', () => {
      // Scenario: Priya (Safety Officer) submits a permit under her own account
      const selfRequestedPermit = createMockPermit({
        requesterId: 'user-safety-1',
        status: 'PENDING_APPROVAL',
      });

      const check = canUserPerformAction('APPROVE', selfRequestedPermit, baseSafetyOfficer, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Anti-Self-Approval Rule');

      expect(() => {
        getNextPermitState('APPROVE', selfRequestedPermit, baseSafetyOfficer, now);
      }).toThrow(StateMachineError);
    });

    it('STRICTLY PROHIBITS an Area Owner from approving their own requested permit', () => {
      const selfRequestedPermit = createMockPermit({
        requesterId: 'user-areaowner-1',
        status: 'PENDING_APPROVAL',
      });

      const check = canUserPerformAction('APPROVE', selfRequestedPermit, baseAreaOwner, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Anti-Self-Approval Rule');
    });
  });

  describe('Role-Based Approvals and Area Boundary Enforcement', () => {
    it('prevents Requester role from approving any permit', () => {
      const permit = createMockPermit({ requesterId: 'another-technician' });
      const check = canUserPerformAction('APPROVE', permit, baseRequester, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Requesters do not hold approval authority');
    });

    it('allows Area Owner to approve permit in their assigned area', () => {
      const permit = createMockPermit({ areaId: 'area-boiler-house' });
      const check = canUserPerformAction('APPROVE', permit, baseAreaOwner, now);
      expect(check.allowed).toBe(true);
    });

    it('STRICTLY BLOCKS Area Owner from approving permits outside their assigned area', () => {
      const permit = createMockPermit({ areaId: 'area-boiler-house' });
      // otherAreaOwner is assigned to paint shop, not boiler house
      const check = canUserPerformAction('APPROVE', permit, otherAreaOwner, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Area Owners can only approve permits located in their assigned area');
    });

    it('allows Safety Officer to approve any permit', () => {
      const permit = createMockPermit();
      const check = canUserPerformAction('APPROVE', permit, baseSafetyOfficer, now);
      expect(check.allowed).toBe(true);
    });

    it('transitions to APPROVED only when BOTH Area Owner and Safety Officer have approved', () => {
      const permit = createMockPermit();

      // Step 1: Area Owner approves -> state remains PENDING_APPROVAL
      const stateAfterAreaOwner = getNextPermitState('APPROVE', permit, baseAreaOwner, now);
      expect(stateAfterAreaOwner).toBe('PENDING_APPROVAL');

      // Permit updated with first approval
      const permitWithOneApproval = createMockPermit({
        approvals: [
          {
            id: 'app-1',
            approverId: baseAreaOwner.id,
            roleAtApproval: 'AREA_OWNER',
            status: 'APPROVED',
          },
        ],
      });

      // Step 2: Safety Officer approves -> state transitions to APPROVED
      const stateAfterSafety = getNextPermitState('APPROVE', permitWithOneApproval, baseSafetyOfficer, now);
      expect(stateAfterSafety).toBe('APPROVED');
    });
  });

  describe('Activation Gate Rules', () => {
    it('blocks activation if planned start time is in the future', () => {
      const futureStartTime = new Date('2026-09-27T12:00:00Z'); // 2 hours after 'now'
      const approvedPermit = createMockPermit({
        status: 'APPROVED',
        plannedStartTime: futureStartTime,
        approvals: [
          { id: '1', approverId: 'ao-1', roleAtApproval: 'AREA_OWNER', status: 'APPROVED' },
          { id: '2', approverId: 'so-1', roleAtApproval: 'SAFETY_OFFICER', status: 'APPROVED' },
        ],
      });

      const check = canUserPerformAction('ACTIVATE', approvedPermit, baseRequester, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('cannot be activated before its planned start time');
    });

    it('blocks activation if not all required approvers have signed off', () => {
      const partiallyApprovedPermit = createMockPermit({
        status: 'APPROVED',
        plannedStartTime: pastTime,
        approvals: [
          // Missing safety officer approval
          { id: '1', approverId: 'ao-1', roleAtApproval: 'AREA_OWNER', status: 'APPROVED' },
        ],
      });

      const check = canUserPerformAction('ACTIVATE', partiallyApprovedPermit, baseRequester, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Requires approval from both Area Owner and Safety Officer');
    });

    it('successfully activates when approved and start time has arrived', () => {
      const fullyApprovedPermit = createMockPermit({
        status: 'APPROVED',
        plannedStartTime: pastTime,
        approvals: [
          { id: '1', approverId: 'ao-1', roleAtApproval: 'AREA_OWNER', status: 'APPROVED' },
          { id: '2', approverId: 'so-1', roleAtApproval: 'SAFETY_OFFICER', status: 'APPROVED' },
        ],
      });

      const nextState = getNextPermitState('ACTIVATE', fullyApprovedPermit, baseRequester, now);
      expect(nextState).toBe('ACTIVE');
    });
  });

  describe('Suspension, Emergency Halt & Closure Verification', () => {
    it('allows Safety Officer to instantly suspend an ACTIVE permit', () => {
      const activePermit = createMockPermit({ status: 'ACTIVE' });
      const check = canUserPerformAction('SUSPEND', activePermit, baseSafetyOfficer, now);
      expect(check.allowed).toBe(true);

      const nextState = getNextPermitState('SUSPEND', activePermit, baseSafetyOfficer, now);
      expect(nextState).toBe('SUSPENDED');
    });

    it('forbids normal Technician / Requester from suspending without authority', () => {
      const activePermit = createMockPermit({ status: 'ACTIVE' });
      const check = canUserPerformAction('SUSPEND', activePermit, baseRequester, now);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Only Safety Officers or Admins have emergency suspension authority');
    });

    it('enforces that only Safety Officer can perform final closure verification (CLOSED -> CLOSED_VERIFIED)', () => {
      const closedPermit = createMockPermit({ status: 'CLOSED' });

      // Requester cannot verify closure
      const requesterCheck = canUserPerformAction('VERIFY_CLOSURE', closedPermit, baseRequester, now);
      expect(requesterCheck.allowed).toBe(false);

      // Safety officer can verify closure
      const safetyCheck = canUserPerformAction('VERIFY_CLOSURE', closedPermit, baseSafetyOfficer, now);
      expect(safetyCheck.allowed).toBe(true);

      const nextState = getNextPermitState('VERIFY_CLOSURE', closedPermit, baseSafetyOfficer, now);
      expect(nextState).toBe('CLOSED_VERIFIED');
    });
  });

  describe('Expiry Mechanics', () => {
    it('accurately identifies expired permits when current time exceeds planned end time', () => {
      const expiredPermit = {
        plannedEndTime: new Date('2026-09-27T09:00:00Z'),
        extendedUntil: null,
      };
      expect(isPermitExpired(expiredPermit, now)).toBe(true);
    });

    it('recognizes extension time when determining expiry', () => {
      const extendedPermit = {
        plannedEndTime: new Date('2026-09-27T09:00:00Z'),
        extendedUntil: new Date('2026-09-27T12:00:00Z'), // extended beyond now (10:00)
      };
      expect(isPermitExpired(extendedPermit, now)).toBe(false);
    });

    it('detects expiring soon state when permit expires in less than 2 hours', () => {
      const expiringSoonPermit = {
        status: 'ACTIVE' as const,
        plannedEndTime: new Date('2026-09-27T11:30:00Z'), // 1.5 hours from now
      };
      expect(isPermitExpiringSoon(expiringSoonPermit, 2, now)).toBe(true);
    });

    it('STRICTLY PROHIBITS activating or extending an expired permit', () => {
      const expiredPermit = createMockPermit({
        status: 'ACTIVE',
        plannedEndTime: new Date('2026-09-27T09:00:00Z'), // past
      });

      const check = canUserPerformAction('EXTEND', expiredPermit, baseSafetyOfficer, now);
      expect(check.allowed).toBe(false);
      expect(check.reason?.toLowerCase()).toContain('expired');
    });
  });
});
