'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  Filter,
  Search,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  HardHat,
  Factory,
  Building,
} from 'lucide-react';
import { PermitStatusBadge } from '@/components/permits/PermitStatusBadge';
import { PermitTypeBadge } from '@/components/permits/PermitTypeBadge';
import { CountdownTimer } from '@/components/permits/CountdownTimer';
import { ConflictAlertBanner } from '@/components/permits/ConflictAlertBanner';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [permits, setPermits] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    total: 0,
    activeCount: 0,
    expiringSoonCount: 0,
    pendingApprovalCount: 0,
    myPendingApprovalsCount: 0,
    suspendedCount: 0,
  });
  const [masterData, setMasterData] = useState<any>({
    plants: [],
    areas: [],
    equipment: [],
    permitTypes: [],
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [myApprovalsPending, setMyApprovalsPending] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMasterData = async () => {
    try {
      const res = await fetch('/api/master-data');
      const data = await res.json();
      setMasterData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPermits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('permitType', typeFilter);
      if (areaFilter !== 'ALL') params.append('areaId', areaFilter);
      if (myApprovalsPending) params.append('myApprovalsPending', 'true');

      const res = await fetch(`/api/permits?${params.toString()}`);
      const data = await res.json();
      setPermits(data.permits || []);
      if (data.metrics) setMetrics(data.metrics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchPermits();
  }, [statusFilter, typeFilter, areaFilter, myApprovalsPending]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPermits();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPermits();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-mono uppercase tracking-wider font-semibold">
            <span>Plant Safety Operations</span>
            <span>•</span>
            <span>Permit to Work System</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            Safety Control Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time compliance monitoring, high-hazard isolation verification, and dual-layer approval workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh permits & trigger auto-expiry"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-orange-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/permits/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Permit</span>
          </Link>
        </div>
      </div>

      {/* Safety Pulse Metric Cards (The 4 crucial numbers at a glance) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Permits Right Now */}
        <div
          onClick={() => {
            setStatusFilter('ACTIVE');
            setMyApprovalsPending(false);
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'ACTIVE'
              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-emerald-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Right Now
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/50">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{metrics.activeCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Work underway</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live authorized shop-floor tasks</p>
        </div>

        {/* Metric 2: Expiring in Next 2 Hours */}
        <div
          onClick={() => {
            setStatusFilter('ACTIVE');
            setMyApprovalsPending(false);
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            metrics.expiringSoonCount > 0
              ? 'bg-amber-950/70 border-amber-600 ring-2 ring-amber-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-amber-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Expiring in &lt; 2 Hours
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-950 flex items-center justify-center border border-amber-700/50">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 font-mono">
              {metrics.expiringSoonCount}
            </span>
            <span className="text-xs text-amber-400 font-medium">Critical window</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires extension or closure sign-off</p>
        </div>

        {/* Metric 3: My Approvals Pending */}
        <div
          onClick={() => {
            setMyApprovalsPending(!myApprovalsPending);
            setStatusFilter('ALL');
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            myApprovalsPending
              ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-blue-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              My Pending Approvals
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-950 flex items-center justify-center border border-blue-700/50">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {metrics.myPendingApprovalsCount}
            </span>
            <span className="text-xs text-blue-400 font-medium">For {currentUser?.role || 'You'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {currentUser?.role === 'REQUESTER'
              ? 'Technicians cannot approve'
              : 'Awaiting your digital sign-off'}
          </p>
        </div>

        {/* Metric 4: Suspended / Safety Halts */}
        <div
          onClick={() => {
            setStatusFilter('SUSPENDED');
            setMyApprovalsPending(false);
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'SUSPENDED'
              ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-rose-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Suspended (Halted)
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-950 flex items-center justify-center border border-rose-700/50">
              <PauseCircle className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-300 font-mono">
              {metrics.suspendedCount}
            </span>
            <span className="text-xs text-rose-400 font-medium">Emergency halt</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Work stopped due to conditions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by permit #, title, contractor, or description..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </form>

          {/* Filters row */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            {/* Quick Toggle: My Approvals Pending */}
            <button
              type="button"
              onClick={() => setMyApprovalsPending(!myApprovalsPending)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                myApprovalsPending
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Pending My Approval</span>
            </button>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setMyApprovalsPending(false);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
              <option value="APPROVED">APPROVED (Ready)</option>
              <option value="ACTIVE">ACTIVE (In Progress)</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="CLOSED">CLOSED (Handover)</option>
              <option value="CLOSED_VERIFIED">CLOSED & VERIFIED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>

            {/* Permit Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Permit Types</option>
              <option value="HOT_WORK">Hot Work</option>
              <option value="CONFINED_SPACE">Confined Space Entry</option>
              <option value="WORKING_AT_HEIGHT">Working at Height</option>
              <option value="ELECTRICAL_LOTO">Electrical / LOTO</option>
              <option value="EXCAVATION">Excavation</option>
            </select>

            {/* Area Filter */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Plant Areas</option>
              {masterData.areas?.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.plant.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Permits Table / Card List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Permits Register ({permits.length})
            </h2>
          </div>
          {myApprovalsPending && (
            <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-0.5 rounded-full font-medium">
              Filtering: My Approvals Pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-orange-400" />
            <p className="text-xs">Loading safety permits data...</p>
          </div>
        ) : permits.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShieldAlert className="h-10 w-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No permits found matching your filters</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or clear the filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setAreaFilter('ALL');
                setSearch('');
                setMyApprovalsPending(false);
              }}
              className="text-xs text-orange-400 underline font-semibold hover:text-orange-300"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Permit # & Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Plant & Location</th>
                  <th className="py-3 px-4">Requester / Team</th>
                  <th className="py-3 px-4">Validity & Timer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {permits.map((permit) => (
                  <tr
                    key={permit.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Permit # & Title */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-mono font-bold text-slate-100 flex items-center gap-1.5">
                        <Link
                          href={`/permits/${permit.id}`}
                          className="hover:text-sky-400 transition-colors"
                        >
                          {permit.permitNumber}
                        </Link>
                      </div>
                      <p className="text-slate-300 font-medium truncate max-w-xs mt-0.5" title={permit.title}>
                        {permit.title}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <PermitTypeBadge type={permit.permitType} size="sm" />
                    </td>

                    {/* Plant & Location */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{permit.area?.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Factory className="h-3 w-3 text-slate-500" />
                        <span>{permit.plant?.code}</span>
                        {permit.equipment && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-sky-400">{permit.equipment.tag}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Requester */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{permit.requester?.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {permit.contractorTeam}
                      </div>
                    </td>

                    {/* Validity & Live Countdown Timer */}
                    <td className="py-3.5 px-4">
                      {permit.status === 'ACTIVE' || permit.status === 'APPROVED' ? (
                        <CountdownTimer
                          plannedEndTime={permit.plannedEndTime}
                          extendedUntil={permit.extendedUntil}
                          status={permit.status}
                          compact={true}
                        />
                      ) : (
                        <div className="text-[11px] font-mono text-slate-400">
                          {format(new Date(permit.plannedStartTime), 'dd MMM HH:mm')}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Until {format(new Date(permit.extendedUntil || permit.plannedEndTime), 'HH:mm')}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <PermitStatusBadge status={permit.status} size="sm" />
                    </td>

                    {/* View Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/permits/${permit.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 font-medium text-xs transition-all border border-slate-700 hover:border-sky-500"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
