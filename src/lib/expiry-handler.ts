import { prisma } from './prisma';

/**
 * Checks all active/approved/suspended permits and expires any whose validity window has passed.
 * This ensures the database is always consistent even if no browser was open at the exact second.
 */
export async function autoExpirePassedPermits(): Promise<number> {
  const now = new Date();

  // Find all permits that are in non-terminal active states but past their planned end time / extension
  const permitsToCheck = await prisma.permit.findMany({
    where: {
      status: { in: ['APPROVED', 'ACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'] },
    },
    select: {
      id: true,
      permitNumber: true,
      status: true,
      plannedEndTime: true,
      extendedUntil: true,
    },
  });

  let expiredCount = 0;

  for (const permit of permitsToCheck) {
    const effectiveEnd = permit.extendedUntil ? new Date(permit.extendedUntil) : new Date(permit.plannedEndTime);
    if (now.getTime() > effectiveEnd.getTime()) {
      // Auto-expire
      await prisma.$transaction(async (tx) => {
        await tx.permit.update({
          where: { id: permit.id },
          data: {
            status: 'EXPIRED',
            actualEndTime: now,
          },
        });

        await tx.auditLog.create({
          data: {
            permitId: permit.id,
            userName: 'System Auto-Expiry Engine',
            userRole: 'SYSTEM',
            action: 'EXPIRED',
            fromStatus: permit.status,
            toStatus: 'EXPIRED',
            comment: `Permit validity window elapsed at ${effectiveEnd.toISOString()}. Automatically expired per safety regulations.`,
          },
        });
      });

      expiredCount++;
    }
  }

  return expiredCount;
}
