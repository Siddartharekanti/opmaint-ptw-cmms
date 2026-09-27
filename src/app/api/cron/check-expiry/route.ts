import { NextResponse } from 'next/server';
import { autoExpirePassedPermits } from '@/lib/expiry-handler';

export async function GET() {
  try {
    const expiredCount = await autoExpirePassedPermits();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      expiredCount,
      message: `Checked active permits. Auto-expired ${expiredCount} permits past validity window.`,
    });
  } catch (error) {
    console.error('Error running expiry check:', error);
    return NextResponse.json({ error: 'Expiry cron run failed' }, { status: 500 });
  }
}
