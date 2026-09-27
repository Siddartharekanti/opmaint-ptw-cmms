'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  PlusCircle,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  HardHat,
  Factory,
  ShieldCheck,
  KeyRound,
  Check,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/constants';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setCurrentUser(data.user);
      } else {
        // Auto-login as Safety Officer or Requester by default if not logged in
        await handleSwitchRole('SAFETY_OFFICER');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSwitchRole = async (role: string) => {
    setSwitching(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setRoleDropdownOpen(false);
        router.refresh();
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to switch role', e);
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'REQUESTER':
        return <HardHat className="h-4 w-4 text-blue-400" />;
      case 'AREA_OWNER':
        return <Factory className="h-4 w-4 text-amber-400" />;
      case 'SAFETY_OFFICER':
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      case 'ADMIN':
        return <KeyRound className="h-4 w-4 text-purple-400" />;
      default:
        return <User className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-5 w-5 text-slate-950 font-black" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  OPMAINT <span className="text-orange-500 font-bold">PTW</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-mono tracking-wider uppercase">
                  Safety CMMS Module
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  pathname === '/'
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Permits Dashboard</span>
              </Link>

              <Link
                href="/portfolio"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  pathname === '/portfolio'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>👨‍💻 Developer Portfolio</span>
              </Link>
            </nav>
          </div>

          {/* Right Header Items: Quick Role Switcher & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick 1-Click Role Switcher for Evaluation */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs transition-all shadow-sm"
                title="Switch active user role instantly to test multi-role permissions"
              >
                <span className="flex items-center gap-1.5">
                  {getRoleIcon(currentUser?.role)}
                  <span className="hidden sm:inline font-semibold">{currentUser?.name || 'Switch Role'}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {currentUser?.role || '...'}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <p className="font-bold text-slate-200">Switch Test Persona</p>
                    <p className="text-[10px] text-slate-400">Evaluate dual-approval & safety permissions</p>
                  </div>

                  <div className="py-1 space-y-1">
                    {DEMO_USERS.map((u) => {
                      const isSelected = currentUser?.role === u.role;
                      return (
                        <button
                          key={u.role}
                          onClick={() => handleSwitchRole(u.role)}
                          disabled={switching}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="mt-0.5">{getRoleIcon(u.role)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-100 text-xs">{u.name}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate">{u.designation}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Create Permit Button */}
            <Link
              href="/permits/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Raise Permit</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
