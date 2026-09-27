export interface PermitSummaryForConflict {
  id: string;
  permitNumber: string;
  title: string;
  permitType: string;
  status: string;
  areaId: string;
  areaName?: string;
  equipmentId?: string | null;
  equipmentTag?: string | null;
  plannedStartTime: Date | string;
  plannedEndTime: Date | string;
  extendedUntil?: Date | string | null;
}

export interface ConflictWarning {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  conflictingPermitNumber: string;
  conflictingPermitId: string;
  conflictingPermitType: string;
  conflictingStatus: string;
  overlapStart: string;
  overlapEnd: string;
}

export function detectPermitConflicts(
  candidate: {
    id?: string;
    permitType: string;
    areaId: string;
    equipmentId?: string | null;
    plannedStartTime: Date | string;
    plannedEndTime: Date | string;
  },
  existingPermits: PermitSummaryForConflict[]
): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];

  const candStart = new Date(candidate.plannedStartTime).getTime();
  const candEnd = new Date(candidate.plannedEndTime).getTime();

  for (const existing of existingPermits) {
    // Ignore self and closed/cancelled/rejected/expired permits
    if (candidate.id && existing.id === candidate.id) continue;
    if (['CLOSED', 'CLOSED_VERIFIED', 'REJECTED', 'EXPIRED', 'CANCELLED'].includes(existing.status)) {
      continue;
    }

    const existStart = new Date(existing.plannedStartTime).getTime();
    const existEnd = existing.extendedUntil
      ? new Date(existing.extendedUntil).getTime()
      : new Date(existing.plannedEndTime).getTime();

    // Check time overlap: (StartA <= EndB) and (EndA >= StartB)
    const timesOverlap = candStart < existEnd && candEnd > existStart;
    if (!timesOverlap) continue;

    const sameArea = existing.areaId === candidate.areaId;
    const sameEquipment =
      candidate.equipmentId &&
      existing.equipmentId &&
      candidate.equipmentId === existing.equipmentId;

    // SCENARIO 1: Hot Work and Confined Space in same Area or Equipment (CRITICAL SAFETY CONFLICT)
    if (
      (candidate.permitType === 'HOT_WORK' && existing.permitType === 'CONFINED_SPACE') ||
      (candidate.permitType === 'CONFINED_SPACE' && existing.permitType === 'HOT_WORK')
    ) {
      if (sameEquipment) {
        warnings.push({
          severity: 'CRITICAL',
          title: 'CRITICAL DANGER: Hot Work & Confined Space Collision on Same Equipment',
          description: `Welding/flame sparks or heat conduction near or inside Confined Space ${existing.equipmentTag || 'vessel'} poses an extreme explosion and toxic vapor ignition hazard to entrants.`,
          conflictingPermitNumber: existing.permitNumber,
          conflictingPermitId: existing.id,
          conflictingPermitType: existing.permitType,
          conflictingStatus: existing.status,
          overlapStart: new Date(Math.max(candStart, existStart)).toISOString(),
          overlapEnd: new Date(Math.min(candEnd, existEnd)).toISOString(),
        });
      } else if (sameArea) {
        warnings.push({
          severity: 'HIGH',
          title: 'HIGH HAZARD: Hot Work in Adjacent Vicinity of Confined Space',
          description: `Atmospheric test integrity inside Confined Space may be contaminated by welding fumes, toxic off-gases, or sparks generated in the same area.`,
          conflictingPermitNumber: existing.permitNumber,
          conflictingPermitId: existing.id,
          conflictingPermitType: existing.permitType,
          conflictingStatus: existing.status,
          overlapStart: new Date(Math.max(candStart, existStart)).toISOString(),
          overlapEnd: new Date(Math.min(candEnd, existEnd)).toISOString(),
        });
      }
    }

    // SCENARIO 2: Multiple Hot Work on Same Equipment
    if (
      candidate.permitType === 'HOT_WORK' &&
      existing.permitType === 'HOT_WORK' &&
      sameEquipment
    ) {
      warnings.push({
        severity: 'HIGH',
        title: 'Concurrent Hot Work on Identical Equipment',
        description: `Another team has active/planned hot work on ${existing.equipmentTag || 'this equipment'}. Risk of fire watch confusion and cumulative heat buildup.`,
        conflictingPermitNumber: existing.permitNumber,
        conflictingPermitId: existing.id,
        conflictingPermitType: existing.permitType,
        conflictingStatus: existing.status,
        overlapStart: new Date(Math.max(candStart, existStart)).toISOString(),
        overlapEnd: new Date(Math.min(candEnd, existEnd)).toISOString(),
      });
    }

    // SCENARIO 3: Working at Height directly over another permit in same Area
    if (
      (candidate.permitType === 'WORKING_AT_HEIGHT' || existing.permitType === 'WORKING_AT_HEIGHT') &&
      sameArea &&
      candidate.permitType !== existing.permitType
    ) {
      warnings.push({
        severity: 'MEDIUM',
        title: 'Overhead Working at Height Drop-Zone Hazard',
        description: `Elevated work coincides with work in the same area. Ensure full drop-zone perimeter barricading to protect personnel on the ground.`,
        conflictingPermitNumber: existing.permitNumber,
        conflictingPermitId: existing.id,
        conflictingPermitType: existing.permitType,
        conflictingStatus: existing.status,
        overlapStart: new Date(Math.max(candStart, existStart)).toISOString(),
        overlapEnd: new Date(Math.min(candEnd, existEnd)).toISOString(),
      });
    }
  }

  return warnings;
}
