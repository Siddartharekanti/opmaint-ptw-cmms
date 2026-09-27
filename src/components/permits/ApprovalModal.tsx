'use client';

import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permitNumber: string;
  permitTitle: string;
  userRole: string;
  userName: string;
  onApprove: (data: { comment: string; digitalSignature: string }) => Promise<void>;
  onReject: (data: { rejectionReason: string; comment?: string }) => Promise<void>;
}

export const ApprovalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  permitNumber,
  permitTitle,
  userRole,
  userName,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [verifiedChecklist, setVerifiedChecklist] = useState({
    siteInspected: false,
    precautionsSatisfied: false,
    ppeAppropriate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedChecklist.siteInspected || !verifiedChecklist.precautionsSatisfied) {
      setError('Please acknowledge all safety verification checkboxes before signing off.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onApprove({ comment, digitalSignature: signatureData });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Approval sign-off failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError('A mandatory rejection reason is required per safety audit policy.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onReject({ rejectionReason, comment });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Rejection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                Authorization Decision: {permitNumber}
              </h3>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">{permitTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 m-4 mb-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('APPROVE');
              setError(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'APPROVE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve Permit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REJECT');
              setError(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'REJECT'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="h-4 w-4" />
            <span>Reject Permit</span>
          </button>
        </div>

        {error && (
          <div className="mx-4 p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
            <span>
              Authorizing as: <strong className="text-slate-200">{userName}</strong>
            </span>
            <span className="font-mono text-sky-400 font-bold">{userRole}</span>
          </div>

          {activeTab === 'APPROVE' ? (
            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Prerequisite Verification Checklist:
                </p>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedChecklist.siteInspected}
                    onChange={(e) =>
                      setVerifiedChecklist({ ...verifiedChecklist, siteInspected: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600"
                  />
                  <span>I have inspected the physical work site and verified all isolation tags / conditions.</span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedChecklist.precautionsSatisfied}
                    onChange={(e) =>
                      setVerifiedChecklist({ ...verifiedChecklist, precautionsSatisfied: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600"
                  />
                  <span>All specified safety precautions, gas tests, and fire watches are confirmed active.</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Approval Endorsement Notes / Conditions (Optional):
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Line isolated at valve V-102. Work permitted only until 18:00 hours."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Digital Signature Pad */}
              <SignaturePad onSave={setSignatureData} label="Authorizer Digital Signature (Canvas)" />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{loading ? 'Submitting...' : 'Sign & Authorize Permit'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 leading-relaxed">
                <strong>Mandatory Requirement:</strong> You must state clear safety non-compliances explaining why this permit cannot be granted authorization.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  Rejection Reason <span className="text-red-400">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Gas test showed 4% LEL combustible vapor present. Must re-purge line and repeat test before resubmission."
                  className="w-full bg-slate-950 border border-red-800/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Additional Corrective Action Instructions (Optional):
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Advise contractor to bring calibrated 4-gas detector and contact EHS lead."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{loading ? 'Processing...' : 'Confirm Rejection'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
