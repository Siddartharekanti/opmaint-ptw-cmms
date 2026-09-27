import React from 'react';
import { PermitStatus } from '@/lib/types/permit';

interface Props {
  status: PermitStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string; pulse?: boolean }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    dot: 'bg-slate-400',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    bg: 'bg-amber-950/60',
    text: 'text-amber-300',
    border: 'border-amber-700/80',
    dot: 'bg-amber-400',
    pulse: true,
  },
  APPROVED: {
    label: 'Approved (Ready)',
    bg: 'bg-blue-950/60',
    text: 'text-blue-300',
    border: 'border-blue-700/80',
    dot: 'bg-blue-400',
  },
  ACTIVE: {
    label: 'ACTIVE (Work In Progress)',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-300',
    border: 'border-emerald-600',
    dot: 'bg-emerald-400',
    pulse: true,
  },
  SUSPENDED: {
    label: 'SUSPENDED (Safety Halt)',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    border: 'border-rose-600',
    dot: 'bg-rose-500',
    pulse: true,
  },
  CLOSED: {
    label: 'Closed (Pending Verification)',
    bg: 'bg-indigo-950/60',
    text: 'text-indigo-300',
    border: 'border-indigo-700/80',
    dot: 'bg-indigo-400',
  },
  CLOSED_VERIFIED: {
    label: 'Closed & Verified',
    bg: 'bg-teal-950/60',
    text: 'text-teal-300',
    border: 'border-teal-700/80',
    dot: 'bg-teal-400',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-950/70',
    text: 'text-red-400',
    border: 'border-red-800',
    dot: 'bg-red-500',
  },
  EXPIRED: {
    label: 'Expired',
    bg: 'bg-zinc-800/80',
    text: 'text-zinc-400',
    border: 'border-zinc-700',
    dot: 'bg-zinc-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-stone-900',
    text: 'text-stone-400',
    border: 'border-stone-800',
    dot: 'bg-stone-500',
  },
};

export const PermitStatusBadge: React.FC<Props> = ({ status, size = 'md', className = '' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    dot: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${config.dot} ${
          config.pulse ? 'animate-pulse' : ''
        }`}
      />
      <span>{config.label}</span>
    </span>
  );
};
