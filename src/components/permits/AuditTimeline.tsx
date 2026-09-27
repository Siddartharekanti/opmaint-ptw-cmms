import React from 'react';
import {
  History,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  AlertTriangle,
  FileCheck,
  Edit,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  comment?: string | null;
  changesJson?: string | null;
  timestamp: string | Date;
}

interface Props {
  logs: AuditLogEntry[];
}

export const AuditTimeline: React.FC<Props> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800">
        <History className="h-8 w-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">No audit trail entries recorded yet.</p>
      </div>
    );
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-blue-400" />,
          color: 'bg-blue-950/80 border-blue-700 text-blue-300',
          label: 'Approval Sign-off',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="h-4 w-4 text-red-400" />,
          color: 'bg-red-950/80 border-red-700 text-red-300',
          label: 'Permit Rejected',
        };
      case 'ACTIVATED':
        return {
          icon: <Play className="h-4 w-4 text-emerald-400" />,
          color: 'bg-emerald-950/80 border-emerald-700 text-emerald-300',
          label: 'Permit Activated',
        };
      case 'SUSPENDED':
        return {
          icon: <Pause className="h-4 w-4 text-rose-400" />,
          color: 'bg-rose-950/80 border-rose-700 text-rose-300',
          label: 'Emergency Suspension',
        };
      case 'RESUMED':
        return {
          icon: <Play className="h-4 w-4 text-cyan-400" />,
          color: 'bg-cyan-950/80 border-cyan-700 text-cyan-300',
          label: 'Permit Resumed',
        };
      case 'CLOSED':
        return {
          icon: <FileCheck className="h-4 w-4 text-indigo-400" />,
          color: 'bg-indigo-950/80 border-indigo-700 text-indigo-300',
          label: 'Work Completed & Closed',
        };
      case 'VERIFIED':
        return {
          icon: <ShieldCheck className="h-4 w-4 text-teal-400" />,
          color: 'bg-teal-950/80 border-teal-700 text-teal-300',
          label: 'Safety Closure Verified',
        };
      case 'EXPIRED':
        return {
          icon: <Clock className="h-4 w-4 text-zinc-400" />,
          color: 'bg-zinc-800 border-zinc-700 text-zinc-300',
          label: 'Auto-Expired',
        };
      case 'UPDATED_FIELDS':
        return {
          icon: <Edit className="h-4 w-4 text-amber-400" />,
          color: 'bg-amber-950/80 border-amber-700 text-amber-300',
          label: 'Field Modification',
        };
      default:
        return {
          icon: <History className="h-4 w-4 text-slate-400" />,
          color: 'bg-slate-800 border-slate-700 text-slate-300',
          label: action.replace(/_/g, ' '),
        };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'REQUESTER':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800">Technician</span>;
      case 'AREA_OWNER':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-800">Area Owner</span>;
      case 'SAFETY_OFFICER':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-800 font-semibold">Safety Officer</span>;
      case 'ADMIN':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-800">Admin</span>;
      case 'SYSTEM':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">System Engine</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{role}</span>;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
      {logs.map((entry) => {
        const badge = getActionBadge(entry.action);
        let changes: Record<string, { from: any; to: any }> | null = null;
        if (entry.changesJson) {
          try {
            changes = JSON.parse(entry.changesJson);
          } catch (e) {}
        }

        return (
          <div key={entry.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-slate-900 border-2 border-slate-500 group-hover:border-sky-400 group-hover:scale-110 transition-all flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${badge.color}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>

                  {entry.fromStatus && entry.toStatus && entry.fromStatus !== entry.toStatus && (
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      <span>{entry.fromStatus}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-slate-200 font-bold">{entry.toStatus}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{format(new Date(entry.timestamp), 'PPpp')}</span>
                </div>
              </div>

              {/* Actor details */}
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200">{entry.userName}</span>
                {getRoleBadge(entry.userRole)}
              </div>

              {/* Comment text */}
              {entry.comment && (
                <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-sans leading-relaxed">
                  <span className="text-slate-400 font-semibold mr-1">Remarks:</span>
                  {entry.comment}
                </div>
              )}

              {/* Changes Diff Table (if field edits took place) */}
              {changes && Object.keys(changes).length > 0 && (
                <div className="mt-3 text-xs bg-slate-950/80 rounded-lg border border-slate-800 p-2.5">
                  <p className="text-[11px] font-semibold text-amber-400 mb-1.5 uppercase tracking-wider">
                    Modified Parameters:
                  </p>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(changes).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-900">
                        <span className="text-slate-400 font-medium">{key}:</span>
                        <span className="text-rose-400 truncate line-through">
                          {typeof val.from === 'object' ? JSON.stringify(val.from) : String(val.from || 'empty')}
                        </span>
                        <span className="text-emerald-400 truncate">
                          {typeof val.to === 'object' ? JSON.stringify(val.to) : String(val.to)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
