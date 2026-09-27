'use client';

import React from 'react';
import { FieldDefinition, PermitTypeId } from '@/lib/types/permit';
import { getPermitTypeDefinition } from '@/lib/permit-types';

interface Props {
  permitType: PermitTypeId | string;
  values: Record<string, any>;
  onChange?: (newValues: Record<string, any>) => void;
  readOnly?: boolean;
}

export const AdaptiveTypeFields: React.FC<Props> = ({
  permitType,
  values,
  onChange,
  readOnly = false,
}) => {
  const typeDef = getPermitTypeDefinition(permitType);

  const handleFieldChange = (name: string, value: any) => {
    if (readOnly || !onChange) return;
    onChange({
      ...values,
      [name]: value,
    });
  };

  const handleNestedChange = (groupName: string, subFieldName: string, subValue: any) => {
    if (readOnly || !onChange) return;
    const currentGroup = values[groupName] || {};
    onChange({
      ...values,
      [groupName]: {
        ...currentGroup,
        [subFieldName]: subValue,
      },
    });
  };

  const renderField = (field: FieldDefinition, isNested = false, parentGroup = '') => {
    const rawVal = isNested ? values[parentGroup]?.[field.name] : values[field.name];
    const val = rawVal !== undefined ? rawVal : '';

    if (readOnly) {
      if (field.type === 'nested_group') {
        const nestedVals = values[field.name] || {};
        return (
          <div key={field.name} className="col-span-full bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              {field.label}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {field.nestedFields?.map((nf) => {
                const subVal = nestedVals[nf.name];
                return (
                  <div key={nf.name} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-0.5">{nf.label}</span>
                    <span className="text-sm font-semibold text-sky-400 font-mono">
                      {subVal !== undefined && subVal !== '' ? String(subVal) : '—'} {nf.unit || ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (field.type === 'boolean') {
        return (
          <div key={field.name} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">{field.label}</span>
            <span
              className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                val ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}
            >
              {val ? 'VERIFIED / YES' : 'NOT APPLIED / NO'}
            </span>
          </div>
        );
      }

      return (
        <div key={field.name} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{field.label}</span>
          <span className="text-sm font-semibold text-slate-100 font-mono">
            {val !== '' ? String(val) : '—'} {field.unit ? field.unit : ''}
          </span>
        </div>
      );
    }

    // Editable Mode
    switch (field.type) {
      case 'nested_group':
        return (
          <div key={field.name} className="col-span-full bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <div>
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.helperText && <p className="text-[11px] text-slate-400 mt-0.5">{field.helperText}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {field.nestedFields?.map((nf) => renderField(nf, true, field.name))}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>{field.label}</span>
              {field.required && <span className="text-red-400 text-xs">*</span>}
            </label>
            <select
              value={val}
              onChange={(e) =>
                isNested
                  ? handleNestedChange(parentGroup, field.name, e.target.value)
                  : handleFieldChange(field.name, e.target.value)
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="">Select option...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {field.helperText && <p className="text-[11px] text-slate-400">{field.helperText}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>{field.label}</span>
              {field.unit && <span className="text-[11px] text-slate-400">({field.unit})</span>}
              {field.required && <span className="text-red-400 text-xs">*</span>}
            </label>
            <input
              type="number"
              step="any"
              value={val}
              placeholder={field.placeholder || '0'}
              onChange={(e) => {
                const num = e.target.value === '' ? '' : parseFloat(e.target.value);
                if (isNested) {
                  handleNestedChange(parentGroup, field.name, num);
                } else {
                  handleFieldChange(field.name, num);
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
            {field.helperText && <p className="text-[11px] text-slate-400">{field.helperText}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-700 rounded-lg">
            <input
              type="checkbox"
              id={field.name}
              checked={!!val}
              onChange={(e) =>
                isNested
                  ? handleNestedChange(parentGroup, field.name, e.target.checked)
                  : handleFieldChange(field.name, e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor={field.name} className="text-xs font-medium text-slate-200 cursor-pointer">
              {field.label}
              {field.helperText && <span className="block text-[11px] text-slate-400">{field.helperText}</span>}
            </label>
          </div>
        );

      case 'text':
      default:
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>{field.label}</span>
              {field.required && <span className="text-red-400 text-xs">*</span>}
            </label>
            <input
              type="text"
              value={val}
              placeholder={field.placeholder || ''}
              onChange={(e) =>
                isNested
                  ? handleNestedChange(parentGroup, field.name, e.target.value)
                  : handleFieldChange(field.name, e.target.value)
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
            {field.helperText && <p className="text-[11px] text-slate-400">{field.helperText}</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
          <span>Specific Safety Technical Parameters:</span>
          <span className="text-xs font-medium text-sky-400">{typeDef.label}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{typeDef.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {typeDef.fields.map((field) => renderField(field))}
      </div>
    </div>
  );
};
