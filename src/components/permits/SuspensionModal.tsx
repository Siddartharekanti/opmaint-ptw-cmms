'use client';

import React, { useState } from 'react';
import { X, AlertOctagon, Pause } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permitNumber: string;
  onSuspend: (reason: string) => Promise<void>;
}

export const SuspensionModal: React.FC<Props> = ({ isOpen, onClose, permitNumber, onSuspend }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A mandatory emergency reason is required to suspend an active permit.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSuspend(reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Suspension failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-rose-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-rose-900/60 bg-rose-950/80">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm">Emergency Permit Suspension</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-xs text-rose-200 bg-rose-950/40 p-3 rounded-lg border border-rose-900 leading-relaxed">
            <strong>Warning:</strong> Suspending this permit will immediately halt all work on site for {permitNumber}. All contractors must be ordered to stand down.
          </p>

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              Mandatory Suspension Reason <span className="text-red-400">*</span>:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Combustible gas alarm sounded in nearby trench / High winds exceeding 30 km/h / Shift handover safety hold."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Pause className="h-4 w-4" />
            <span>{loading ? 'Haulting Work...' : 'Confirm Immediate Suspension'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
