import React from 'react';
import { AlertOctagon, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ConflictWarning } from '@/lib/conflict-detection';

interface Props {
  conflicts: ConflictWarning[];
}

export const ConflictAlertBanner: React.FC<Props> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="space-y-3 my-4">
      {conflicts.map((conflict, index) => {
        const isCritical = conflict.severity === 'CRITICAL';
        const isHigh = conflict.severity === 'HIGH';

        const borderClass = isCritical
          ? 'border-red-600 bg-red-950/80 text-red-200'
          : isHigh
          ? 'border-amber-600 bg-amber-950/80 text-amber-200'
          : 'border-blue-600 bg-blue-950/80 text-blue-200';

        const icon = isCritical ? (
          <AlertOctagon className="h-6 w-6 text-red-400 shrink-0 mt-0.5 animate-pulse" />
        ) : isHigh ? (
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        );

        return (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 flex items-start gap-3.5 shadow-lg ${borderClass}`}
          >
            {icon}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-black ${
                      isCritical ? 'bg-red-800 text-white' : 'bg-amber-800 text-amber-100'
                    }`}
                  >
                    {conflict.severity} CONFLICT
                  </span>
                  {conflict.title}
                </span>
                <Link
                  href={`/permits/${conflict.conflictingPermitId}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold underline hover:opacity-80 transition-opacity"
                >
                  View Conflicting Permit ({conflict.conflictingPermitNumber})
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <p className="text-xs leading-relaxed opacity-95">{conflict.description}</p>

              <div className="text-[11px] opacity-80 pt-1 font-mono">
                Overlap Window: {new Date(conflict.overlapStart).toLocaleString()} →{' '}
                {new Date(conflict.overlapEnd).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
