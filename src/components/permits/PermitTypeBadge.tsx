import React from 'react';
import { Flame, Box, ArrowUpRight, Zap, Pickaxe, FileText } from 'lucide-react';
import { getPermitTypeDefinition } from '@/lib/permit-types';

interface Props {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PermitTypeBadge: React.FC<Props> = ({ type, size = 'md', showIcon = true }) => {
  const def = getPermitTypeDefinition(type);

  const getIcon = () => {
    switch (type) {
      case 'HOT_WORK':
        return <Flame className="h-3.5 w-3.5 text-amber-400" />;
      case 'CONFINED_SPACE':
        return <Box className="h-3.5 w-3.5 text-purple-400" />;
      case 'WORKING_AT_HEIGHT':
        return <ArrowUpRight className="h-3.5 w-3.5 text-blue-400" />;
      case 'ELECTRICAL_LOTO':
        return <Zap className="h-3.5 w-3.5 text-red-400" />;
      case 'EXCAVATION':
        return <Pickaxe className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-sm ${sizeClasses}`}
    >
      {showIcon && getIcon()}
      <span>{def.label}</span>
    </span>
  );
};
