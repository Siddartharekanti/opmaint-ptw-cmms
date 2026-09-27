'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permitNumber: string;
  permitTitle: string;
  mode: 'CLOSE' | 'VERIFY_CLOSURE';
  userName: string;
  onSubmit: (notes: string) => Promise<void>;
}

export const ClosureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  permitNumber,
  permitTitle,
  mode,
  userName,
  onSubmit,
}) => {
  const [notes, setNotes] = useState('');
  const [checkedHousekeeping, setCheckedHousekeeping] = useState(false);
  const [checkedIsolationRestored, setCheckedIsolationRestored] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRequesterClose = mode === 'CLOSE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError(
        isRequesterClose
          ? 'Mandatory: Please provide detailed completion notes.'
          : 'Mandatory: Please provide safety closure verification notes.'
      );
      return;
    }

    if (!checkedHousekeeping) {
      setError('Please certify that housekeeping, scrap clearance, and site clean-up are completed.');
      return;
    }

    if (isRequesterClose && !checkedIsolationRestored) {
      setError('Please certify that all personnel and temporary tools have been safely withdrawn from the site.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmit(notes);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            {isRequesterClose ? (
              <CheckCircle className="h-5 w-5 text-indigo-400" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-teal-400" />
            )}
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isRequesterClose ? 'Handover: Mark Work Complete' : 'Safety Officer: Final Closure Verification'}
              </h3>
              <p className="text-xs text-slate-400">{permitNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {isRequesterClose ? 'Contractor Handover Verification' : 'EHS Site Walk-Around Verification'}:
            </p>

            <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedHousekeeping}
                onChange={(e) => setCheckedHousekeeping(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-600"
              />
              <span>
                {isRequesterClose
                  ? 'All hot slag, scrap metal, welding rods, chemical residues, and combustibles cleared.'
                  : 'Physical inspection completed. Area is clean, equipment guard rails in place, and safe for production.'}
              </span>
            </label>

            {isRequesterClose && (
              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedIsolationRestored}
                  onChange={(e) => setCheckedIsolationRestored(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-600"
                />
                <span>
                  All contractor personnel, tools, scaffolding, and portable machines safely removed.
                </span>
              </label>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              {isRequesterClose ? 'Completion Summary Notes' : 'Safety Officer Verification Notes'} <span className="text-red-400">*</span>:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isRequesterClose
                  ? 'e.g. Flange bolts torque tested to 180 Nm. Pressure tested with nitrogen - zero leakage. Ready for EHS verification.'
                  : 'e.g. Conducted final site walk-down. Confirmed lockouts removed and equipment test run normal. Certified fully closed.'
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                isRequesterClose
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              } disabled:opacity-50`}
            >
              {isRequesterClose ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Handover for Verification'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>{loading ? 'Certifying...' : 'Certify Final Closure & Archive'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
