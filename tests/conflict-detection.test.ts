import { describe, it, expect } from 'vitest';
import { detectPermitConflicts, PermitSummaryForConflict } from '../src/lib/conflict-detection';

describe('Permit Conflict Detection Engine', () => {
  const existingPermits: PermitSummaryForConflict[] = [
    {
      id: 'permit-cse-101',
      permitNumber: 'PTW-2026-CSE-101',
      title: 'Boiler Shell Internal Inspection',
      permitType: 'CONFINED_SPACE',
      status: 'ACTIVE',
      areaId: 'area-boiler-01',
      equipmentId: 'eq-boiler-hp01',
      equipmentTag: 'BOILER-HP-01',
      plannedStartTime: new Date('2026-09-27T08:00:00Z'),
      plannedEndTime: new Date('2026-09-27T16:00:00Z'),
    },
    {
      id: 'permit-hw-202',
      permitNumber: 'PTW-2026-HW-202',
      title: 'Pipe Rack Flange Welding',
      permitType: 'HOT_WORK',
      status: 'APPROVED',
      areaId: 'area-boiler-01',
      equipmentId: 'eq-pipe-rack',
      equipmentTag: 'PIPE-RACK-01',
      plannedStartTime: new Date('2026-09-27T10:00:00Z'),
      plannedEndTime: new Date('2026-09-27T14:00:00Z'),
    },
  ];

  it('triggers a CRITICAL severity conflict when Hot Work is requested on the same equipment as an active Confined Space permit', () => {
    const candidate = {
      permitType: 'HOT_WORK',
      areaId: 'area-boiler-01',
      equipmentId: 'eq-boiler-hp01', // Same equipment!
      plannedStartTime: new Date('2026-09-27T09:00:00Z'),
      plannedEndTime: new Date('2026-09-27T12:00:00Z'),
    };

    const conflicts = detectPermitConflicts(candidate, existingPermits);
    expect(conflicts.length).toBeGreaterThan(0);
    const criticalConflict = conflicts.find((c) => c.severity === 'CRITICAL');
    expect(criticalConflict).toBeDefined();
    expect(criticalConflict?.title).toContain('CRITICAL DANGER: Hot Work & Confined Space Collision');
    expect(criticalConflict?.conflictingPermitNumber).toBe('PTW-2026-CSE-101');
  });

  it('triggers a HIGH hazard warning when Hot Work overlaps with Confined Space in the same Area but different equipment', () => {
    const candidate = {
      permitType: 'HOT_WORK',
      areaId: 'area-boiler-01',
      equipmentId: 'eq-steam-line-99', // Different equipment in same area
      plannedStartTime: new Date('2026-09-27T09:00:00Z'),
      plannedEndTime: new Date('2026-09-27T12:00:00Z'),
    };

    const conflicts = detectPermitConflicts(candidate, existingPermits);
    const areaConflict = conflicts.find((c) => c.severity === 'HIGH');
    expect(areaConflict).toBeDefined();
    expect(areaConflict?.title).toContain('HIGH HAZARD: Hot Work in Adjacent Vicinity of Confined Space');
  });

  it('reports zero conflicts when work time windows do not overlap', () => {
    const candidate = {
      permitType: 'HOT_WORK',
      areaId: 'area-boiler-01',
      equipmentId: 'eq-boiler-hp01',
      // Planned for tomorrow, no overlap with today
      plannedStartTime: new Date('2026-09-28T09:00:00Z'),
      plannedEndTime: new Date('2026-09-28T12:00:00Z'),
    };

    const conflicts = detectPermitConflicts(candidate, existingPermits);
    expect(conflicts.length).toBe(0);
  });
});
