'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Clock,
  RotateCcw,
  FileCheck,
  PlusCircle,
  QrCode,
  AlertTriangle,
  History,
  FileText,
  User,
  HardHat,
  Factory,
  Shield,
  Layers,
  Send,
  MessageSquare,
} from 'lucide-react';
import { PermitStatusBadge } from '@/components/permits/PermitStatusBadge';
import { PermitTypeBadge } from '@/components/permits/PermitTypeBadge';
import { CountdownTimer } from '@/components/permits/CountdownTimer';
import { AdaptiveTypeFields } from '@/components/permits/AdaptiveTypeFields';
import { AuditTimeline } from '@/components/permits/AuditTimeline';
import { ApprovalModal } from '@/components/permits/ApprovalModal';
import { ClosureModal } from '@/components/permits/ClosureModal';
import { SuspensionModal } from '@/components/permits/SuspensionModal';
import { ExtensionModal } from '@/components/permits/ExtensionModal';
import { QRCodeModal } from '@/components/permits/QRCodeModal';
import { ConflictAlertBanner } from '@/components/permits/ConflictAlertBanner';
import { format } from 'date-fns';

export default function PermitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const permitId = params.id as string;

  const [permit, setPermit] = useState<any>(null);
  const [allowedActions, setAllowedActions] = useState<any>({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [conflictWarnings, setConflictWarnings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [closureModalOpen, setClosureModalOpen] = useState(false);
  const [closureMode, setClosureMode] = useState<'CLOSE' | 'VERIFY_CLOSURE'>('CLOSE');
  const [suspensionModalOpen, setSuspensionModalOpen] = useState(false);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Work log input state
  const [workLogAction, setWorkLogAction] = useState('');
  const [workLogNotes, setWorkLogNotes] = useState('');
  const [submittingWorkLog, setSubmittingWorkLog] = useState(false);

  const fetchPermitDetails = async () => {
    try {
      const [resPermit, resUser] = await Promise.all([
        fetch(`/api/permits/${permitId}`),
        fetch('/api/auth/me'),
      ]);

      const dataPermit = await resPermit.json();
      const dataUser = await resUser.json();

      if (!resPermit.ok) {
        throw new Error(dataPermit.error || 'Failed to load permit');
      }

      setPermit(dataPermit.permit);
      setAllowedActions(dataPermit.allowedActions || {});
      setQrCodeDataUrl(dataPermit.qrCodeDataUrl || '');
      setConflictWarnings(dataPermit.conflictWarnings || []);
      if (dataUser.authenticated) {
        setCurrentUser(dataUser.user);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermitDetails();
  }, [permitId]);

  const executeAction = async (action: string, payload: any = {}) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/permits/${permitId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      await fetchPermitDetails();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workLogAction.trim()) return;
    setSubmittingWorkLog(true);
    setError(null);
    try {
      const res = await fetch(`/api/permits/${permitId}/work-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: workLogAction,
          notes: workLogNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add work log');
      }
      setWorkLogAction('');
      setWorkLogNotes('');
      await fetchPermitDetails();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmittingWorkLog(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs">Loading permit authorization dossier...</p>
      </div>
    );
  }

  if (error && !permit) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Unable to load permit</h2>
        <p className="text-xs text-red-300">{error}</p>
        <Link href="/" className="inline-block px-4 py-2 bg-slate-800 text-xs rounded-xl text-slate-200">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Pre-calculate dual approvals status
  const areaOwnerApproval = permit.approvals?.find(
    (a: any) => a.roleAtApproval === 'AREA_OWNER' && a.status === 'APPROVED'
  );
  const safetyOfficerApproval = permit.approvals?.find(
    (a: any) => (a.roleAtApproval === 'SAFETY_OFFICER' || a.roleAtApproval === 'ADMIN') && a.status === 'APPROVED'
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Quick QR Code link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Permits Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* QR Code walk-around trigger button */}
          <button
            onClick={() => setQrModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="h-3.5 w-3.5 text-sky-400" />
            <span>Inspection QR Code</span>
          </button>
        </div>
      </div>

      {/* Main Permit Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-lg font-black text-white tracking-wider">
                {permit.permitNumber}
              </span>
              <PermitStatusBadge status={permit.status} size="md" />
              <PermitTypeBadge type={permit.permitType} size="md" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">{permit.title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{permit.description}</p>
          </div>

          {/* Live Expiry Countdown Timer on Header */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <CountdownTimer
              plannedEndTime={permit.plannedEndTime}
              extendedUntil={permit.extendedUntil}
              status={permit.status}
            />
            {permit.extensionCount > 0 && (
              <span className="text-[11px] text-blue-400 font-mono">
                Extended {permit.extensionCount} times (Max 3)
              </span>
            )}
          </div>
        </div>

        {/* Location & Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Facility Plant:</span>
            <span className="font-semibold text-slate-200">{permit.plant?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Plant Area / Unit:</span>
            <span className="font-semibold text-slate-200">{permit.area?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Equipment Tag:</span>
            <span className="font-mono text-sky-400 font-bold">{permit.equipment?.tag || 'General Area'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Contractor Team:</span>
            <span className="font-semibold text-slate-200">{permit.contractorTeam}</span>
          </div>
        </div>

        {/* Rejection / Suspension Alert Banner if applicable */}
        {permit.status === 'REJECTED' && permit.rejectionReason && (
          <div className="p-4 bg-red-950/80 border border-red-700 text-red-200 rounded-xl text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-red-400 uppercase tracking-wider">
              <XCircle className="h-4 w-4" />
              <span>Official Safety Rejection Notice</span>
            </div>
            <p className="leading-relaxed">{permit.rejectionReason}</p>
          </div>
        )}

        {permit.status === 'SUSPENDED' && permit.suspensionReason && (
          <div className="p-4 bg-rose-950/80 border border-rose-600 text-rose-200 rounded-xl text-xs space-y-1 animate-pulse-subtle">
            <div className="font-bold flex items-center gap-1.5 text-rose-400 uppercase tracking-wider">
              <Pause className="h-4 w-4" />
              <span>Immediate Safety Suspension Enforced</span>
            </div>
            <p className="leading-relaxed">{permit.suspensionReason}</p>
          </div>
        )}

        {/* Conflict Alert Banner if collisions detected */}
        {conflictWarnings.length > 0 && <ConflictAlertBanner conflicts={conflictWarnings} />}

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE-AWARE ACTION BAR: User should never see buttons they aren't allowed to press */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Available Actions:</span>

          {/* SUBMIT (Only if DRAFT & allowed) */}
          {allowedActions.SUBMIT?.allowed && (
            <button
              onClick={() => executeAction('SUBMIT')}
              disabled={actionLoading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit for Dual Sign-off</span>
            </button>
          )}

          {/* APPROVE / REJECT (Only if PENDING_APPROVAL & allowed) */}
          {allowedActions.APPROVE?.allowed && (
            <button
              onClick={() => setApprovalModalOpen(true)}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Sign / Authorize Permit</span>
            </button>
          )}

          {/* ACTIVATE (Only if APPROVED & allowed) */}
          {allowedActions.ACTIVATE?.allowed && (
            <button
              onClick={() => executeAction('ACTIVATE')}
              disabled={actionLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Activate Permit (Start Work)</span>
            </button>
          )}

          {/* Reason message if activation blocked by start time */}
          {permit.status === 'APPROVED' && !allowedActions.ACTIVATE?.allowed && (
            <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1.5 rounded-xl font-medium">
              {allowedActions.ACTIVATE?.reason || 'Cannot activate before planned start time'}
            </span>
          )}

          {/* SUSPEND (Only if ACTIVE & allowed - Safety Officer / Admin) */}
          {allowedActions.SUSPEND?.allowed && (
            <button
              onClick={() => setSuspensionModalOpen(true)}
              disabled={actionLoading}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Emergency Suspend</span>
            </button>
          )}

          {/* RESUME (Only if SUSPENDED & allowed) */}
          {allowedActions.RESUME?.allowed && (
            <button
              onClick={() => executeAction('RESUME')}
              disabled={actionLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Resume Work</span>
            </button>
          )}

          {/* EXTEND (Only if ACTIVE & allowed) */}
          {allowedActions.EXTEND?.allowed && (
            <button
              onClick={() => setExtensionModalOpen(true)}
              disabled={actionLoading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Request Extension</span>
            </button>
          )}

          {/* CLOSE (Requester marks work complete) */}
          {allowedActions.CLOSE?.allowed && (
            <button
              onClick={() => {
                setClosureMode('CLOSE');
                setClosureModalOpen(true);
              }}
              disabled={actionLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Handover: Mark Work Complete</span>
            </button>
          )}

          {/* VERIFY CLOSURE (Safety officer verifies site is clean) */}
          {allowedActions.VERIFY_CLOSURE?.allowed && (
            <button
              onClick={() => {
                setClosureMode('VERIFY_CLOSURE');
                setClosureModalOpen(true);
              }}
              disabled={actionLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verify Closure & Archive</span>
            </button>
          )}

          {/* CANCEL (Non-terminal & allowed) */}
          {allowedActions.CANCEL?.allowed && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this permit?')) {
                  executeAction('CANCEL');
                }
              }}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl transition-all"
            >
              <span>Cancel Permit</span>
            </button>
          )}

          {/* If no action is currently permitted for this user */}
          {Object.values(allowedActions).every((a: any) => !a.allowed) && (
            <span className="text-xs text-slate-500 italic">
              No actions available for your current role ({currentUser?.role}) in this permit state.
            </span>
          )}
        </div>
      </div>

      {/* Two Column Layout: Technical Details & Approval Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Safety Specs, Precautions, Work Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Type-Specific Safety Parameters Card (Dynamic) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <AdaptiveTypeFields
              permitType={permit.permitType}
              values={permit.typeSpecificData}
              readOnly={true}
            />
          </div>

          {/* Hazards & Mandatory PPE Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-400" />
              <span>Identified Site Hazards & Required PPE</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Hazards Identified:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {permit.hazardsIdentified?.map((h: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs bg-amber-950/60 border border-amber-800 text-amber-300 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Mandatory PPE Requirements:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {permit.ppeRequired?.map((p: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs bg-sky-950/60 border border-sky-800 text-sky-300 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Precautions Checklist Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Safety Precautions Verification</span>
            </h3>

            <div className="space-y-2">
              {permit.precautionsChecklist?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <CheckCircle
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      item.verified ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className={item.verified ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Work Execution Logs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <HardHat className="h-4 w-4 text-sky-400" />
                <span>Shop Floor Work Execution Log</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {permit.workLogs?.length || 0} entries recorded
              </span>
            </div>

            {/* Add Work Log Form (Only allowed if ACTIVE) */}
            {permit.status === 'ACTIVE' ? (
              <form onSubmit={handleAddWorkLog} className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[11px] font-bold text-slate-300">Log Progress / Safety Check:</p>
                <input
                  type="text"
                  value={workLogAction}
                  onChange={(e) => setWorkLogAction(e.target.value)}
                  placeholder="e.g. Cut-off grinding completed on pipe hanger #3 / Gas re-check 0% LEL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workLogNotes}
                    onChange={(e) => setWorkLogNotes(e.target.value)}
                    placeholder="Additional notes / contractor supervisor remarks (optional)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingWorkLog}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submittingWorkLog ? 'Logging...' : 'Post Log'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                Work progress cannot be logged unless permit status is ACTIVE.
              </p>
            )}

            {/* Work log items */}
            <div className="space-y-2">
              {permit.workLogs?.map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-200">{log.loggedByName}</span>
                    <span className="font-mono">{format(new Date(log.timestamp), 'PPpp')}</span>
                  </div>
                  <p className="font-semibold text-sky-300">{log.action}</p>
                  {log.notes && <p className="text-slate-400 text-[11px]">{log.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Trail Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <History className="h-4 w-4 text-orange-400" />
                <span>Regulatory Safety Audit Trail (Immutable Timeline)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">NFPA 51B Compliant</span>
            </div>
            <AuditTimeline logs={permit.auditLogs || []} />
          </div>
        </div>

        {/* Right Column (1 Col): Approval Trail & Signatures */}
        <div className="space-y-6">
          {/* Dual Authorization Trail Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Dual Authorization Sign-off</span>
            </h3>

            {/* Gate 1: Area Owner */}
            <div className="p-3.5 rounded-xl border bg-slate-950/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Factory className="h-3.5 w-3.5 text-amber-400" />
                  <span>1. Area Owner Approval</span>
                </span>
                {areaOwnerApproval ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    APPROVED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    PENDING
                  </span>
                )}
              </div>

              {areaOwnerApproval ? (
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-100">{areaOwnerApproval.approver?.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {format(new Date(areaOwnerApproval.timestamp), 'dd MMM yyyy, HH:mm')}
                  </p>
                  {areaOwnerApproval.comment && (
                    <p className="text-[11px] italic text-slate-400 bg-slate-900 p-2 rounded">
                      "{areaOwnerApproval.comment}"
                    </p>
                  )}
                  {areaOwnerApproval.digitalSignature && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Digital Signature:</span>
                      <img
                        src={areaOwnerApproval.digitalSignature}
                        alt="Signature"
                        className="h-10 border border-slate-800 rounded bg-slate-900 p-1"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Awaiting sign-off from designated Area Owner for {permit.area?.name}.
                </p>
              )}
            </div>

            {/* Gate 2: Safety Officer */}
            <div className="p-3.5 rounded-xl border bg-slate-950/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>2. Safety Officer Approval</span>
                </span>
                {safetyOfficerApproval ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    APPROVED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    PENDING
                  </span>
                )}
              </div>

              {safetyOfficerApproval ? (
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-100">{safetyOfficerApproval.approver?.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {format(new Date(safetyOfficerApproval.timestamp), 'dd MMM yyyy, HH:mm')}
                  </p>
                  {safetyOfficerApproval.comment && (
                    <p className="text-[11px] italic text-slate-400 bg-slate-900 p-2 rounded">
                      "{safetyOfficerApproval.comment}"
                    </p>
                  )}
                  {safetyOfficerApproval.digitalSignature && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Digital Signature:</span>
                      <img
                        src={safetyOfficerApproval.digitalSignature}
                        alt="Signature"
                        className="h-10 border border-slate-800 rounded bg-slate-900 p-1"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Awaiting authorization and prerequisite clearance by Lead Safety Officer.
                </p>
              )}
            </div>
          </div>

          {/* Closure & Verification Card (if closed) */}
          {(permit.completionNotes || permit.verificationNotes) && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <FileCheck className="h-4 w-4 text-teal-400" />
                <span>Closure & Cleanliness Handover</span>
              </h3>

              {permit.completionNotes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase">
                    Contractor Completion Notes:
                  </span>
                  <p className="text-slate-300">{permit.completionNotes}</p>
                </div>
              )}

              {permit.verificationNotes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-[11px] font-bold text-teal-400 uppercase">
                    Safety Officer Walk-Around Verification:
                  </span>
                  <p className="text-slate-300">{permit.verificationNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* QR Code Quick Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              On-Site Inspection QR
            </h4>
            {qrCodeDataUrl && (
              <div
                onClick={() => setQrModalOpen(true)}
                className="cursor-pointer bg-white p-2.5 rounded-xl inline-block hover:scale-105 transition-transform"
              >
                <img src={qrCodeDataUrl} alt="Permit QR" className="w-32 h-32 mx-auto" />
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Click QR to enlarge or download for safety board posting.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        permitNumber={permit.permitNumber}
        permitTitle={permit.title}
        userRole={currentUser?.role || ''}
        userName={currentUser?.name || ''}
        onApprove={async (data) => executeAction('APPROVE', data)}
        onReject={async (data) => executeAction('REJECT', data)}
      />

      <ClosureModal
        isOpen={closureModalOpen}
        onClose={() => setClosureModalOpen(false)}
        permitNumber={permit.permitNumber}
        permitTitle={permit.title}
        mode={closureMode}
        userName={currentUser?.name || ''}
        onSubmit={async (notes) => {
          if (closureMode === 'CLOSE') {
            await executeAction('CLOSE', { completionNotes: notes });
          } else {
            await executeAction('VERIFY_CLOSURE', { verificationNotes: notes });
          }
        }}
      />

      <SuspensionModal
        isOpen={suspensionModalOpen}
        onClose={() => setSuspensionModalOpen(false)}
        permitNumber={permit.permitNumber}
        onSuspend={async (reason) => executeAction('SUSPEND', { suspensionReason: reason })}
      />

      <ExtensionModal
        isOpen={extensionModalOpen}
        onClose={() => setExtensionModalOpen(false)}
        permitNumber={permit.permitNumber}
        currentEndTime={permit.extendedUntil || permit.plannedEndTime}
        extensionCount={permit.extensionCount || 0}
        onExtend={async (data) => executeAction('EXTEND', { extensionHours: data.hours, comment: data.reason })}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        permitNumber={permit.permitNumber}
        permitTitle={permit.title}
        qrCodeDataUrl={qrCodeDataUrl}
        permitId={permit.id}
      />
    </div>
  );
}
