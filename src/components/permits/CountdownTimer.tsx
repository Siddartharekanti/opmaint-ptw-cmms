'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface Props {
  plannedEndTime: string | Date;
  extendedUntil?: string | Date | null;
  status: string;
  className?: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<Props> = ({
  plannedEndTime,
  extendedUntil,
  status,
  className = '',
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isExpiringSoon: boolean; // < 2 hours
    totalSeconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isExpiringSoon: false,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = extendedUntil ? new Date(extendedUntil).getTime() : new Date(plannedEndTime).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isExpiringSoon: false,
          totalSeconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const isExpiringSoon = totalSeconds <= 2 * 3600; // less than 2 hours

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
        isExpiringSoon,
        totalSeconds,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [plannedEndTime, extendedUntil]);

  if (status !== 'ACTIVE' && status !== 'APPROVED') {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-red-950/80 border border-red-700 text-red-300 ${className}`}
      >
        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
        <span>VALIDITY EXPIRED</span>
      </div>
    );
  }

  const format2 = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${
          timeLeft.isExpiringSoon ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-300'
        } ${className}`}
        title="Time remaining before permit auto-expires"
      >
        <Clock className="h-3 w-3 inline text-slate-400" />
        {format2(timeLeft.hours)}:{format2(timeLeft.minutes)}:{format2(timeLeft.seconds)}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono ${
        timeLeft.isExpiringSoon
          ? 'bg-amber-950/70 border-amber-600 text-amber-300 shadow-md shadow-amber-950/40'
          : 'bg-slate-900/90 border-slate-700 text-slate-200'
      } ${className}`}
    >
      {timeLeft.isExpiringSoon ? (
        <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4 text-emerald-400" />
      )}

      <div className="flex items-center gap-1">
        <span className="text-xs uppercase font-sans text-slate-400 font-semibold mr-1">
          {timeLeft.isExpiringSoon ? 'Expiring Soon:' : 'Validity Time:'}
        </span>
        <span className="font-bold tracking-wider">
          {format2(timeLeft.hours)}h {format2(timeLeft.minutes)}m {format2(timeLeft.seconds)}s
        </span>
      </div>

      {extendedUntil && (
        <span className="text-[10px] font-sans bg-blue-900/60 border border-blue-700 text-blue-300 px-1.5 py-0.5 rounded ml-1">
          Extended
        </span>
      )}
    </div>
  );
};
