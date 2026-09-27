import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectPermitConflicts } from '@/lib/conflict-detection';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, permitType, areaId, equipmentId, plannedStartTime, plannedEndTime } = body;

    if (!permitType || !areaId || !plannedStartTime || !plannedEndTime) {
      return NextResponse.json({ conflicts: [] });
    }

    const existingPermits = await prisma.permit.findMany({
      where: {
        status: { notIn: ['CLOSED', 'CLOSED_VERIFIED', 'REJECTED', 'EXPIRED', 'CANCELLED'] },
        areaId,
      },
      include: {
        equipment: true,
        area: true,
      },
    });

    const formattedExisting = existingPermits.map((p) => ({
      id: p.id,
      permitNumber: p.permitNumber,
      title: p.title,
      permitType: p.permitType,
      status: p.status,
      areaId: p.areaId,
      areaName: p.area.name,
      equipmentId: p.equipmentId,
      equipmentTag: p.equipment?.tag || null,
      plannedStartTime: p.plannedStartTime,
      plannedEndTime: p.plannedEndTime,
      extendedUntil: p.extendedUntil,
    }));

    const conflicts = detectPermitConflicts(
      {
        id,
        permitType,
        areaId,
        equipmentId,
        plannedStartTime,
        plannedEndTime,
      },
      formattedExisting
    );

    return NextResponse.json({ conflicts });
  } catch (error) {
    console.error('Conflict detection check error:', error);
    return NextResponse.json({ error: 'Conflict check failed' }, { status: 500 });
  }
}
