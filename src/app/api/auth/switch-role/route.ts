import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { UserRole } from '@/lib/types/permit';

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!['REQUESTER', 'AREA_OWNER', 'SAFETY_OFFICER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role requested.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { role },
      include: { assignedArea: true },
    });

    if (!user) {
      return NextResponse.json({ error: `No user found for role ${role}. Run database seed first.` }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      assignedAreaId: user.assignedAreaId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        assignedAreaId: user.assignedAreaId,
        assignedArea: user.assignedArea,
      },
    });

    response.cookies.set('opmaint_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Switch role error:', error);
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}
