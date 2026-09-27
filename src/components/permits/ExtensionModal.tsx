'use client';

import React, { useState } from 'react';
import { X, Clock, PlusCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permitNumber: string;
  currentEndTime: string | Date;
  extensionCount: number;
  onExtend: (data: { hours: number; reason: string }) => Promise<void>;
}

export const ExtensionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  permitNumber,
  currentEndTime,
  extensionCount,
  onExtend,
}) => {
  const [hours, setHours] = useState(2);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const maxAllowedExtensions = 3;
  const isCapped = extensionCount >= maxAllowedExtensions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCapped) {
      setError(`Extension limit reached (maximum ${maxAllowedExtensions} extensions allowed). A new permit must be raised.`);
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a justification for this extension request.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onExtend({ hours, reason });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Extension failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-sm">Request Validity Extension</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span>Permit Number:</span>
              <strong className="text-slate-200">{permitNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span>Current Validity End:</span>
              <span className="font-mono text-amber-400">{new Date(currentEndTime).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Prior Extensions Used:</span>
              <span className="font-mono text-slate-200">
                {extensionCount} / {maxAllowedExtensions}
              </span>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              Select Extension Duration:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 4].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    hours === h
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  +{h} Hours
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              Safety Justification / Reason <span className="text-red-400">*</span>:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mechanical alignment took longer than anticipated. Atmospheric readings re-tested normal."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || isCapped}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{loading ? 'Processing...' : `Extend Validity by +${hours} Hours`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
