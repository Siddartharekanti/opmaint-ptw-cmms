import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllPermitTypes } from '@/lib/permit-types';

export async function GET() {
  try {
    const [plants, areas, equipment, users] = await Promise.all([
      prisma.plant.findMany({
        include: { areas: true },
        orderBy: { name: 'asc' },
      }),
      prisma.area.findMany({
        include: { plant: true, equipment: true },
        orderBy: { name: 'asc' },
      }),
      prisma.equipment.findMany({
        include: { area: { include: { plant: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
          assignedAreaId: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    const permitTypes = getAllPermitTypes();

    return NextResponse.json({
      plants,
      areas,
      equipment,
      users,
      permitTypes,
    });
  } catch (error) {
    console.error('Error fetching master data:', error);
    return NextResponse.json({ error: 'Failed to fetch master data' }, { status: 500 });
  }
}
