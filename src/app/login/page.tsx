'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  HardHat,
  Factory,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      router.push('/');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'REQUESTER':
        return <HardHat className="h-5 w-5 text-blue-400" />;
      case 'AREA_OWNER':
        return <Factory className="h-5 w-5 text-amber-400" />;
      case 'SAFETY_OFFICER':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case 'ADMIN':
        return <KeyRound className="h-5 w-5 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-orange-950/40">
            <ShieldAlert className="h-6 w-6 text-slate-950 font-black" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Opmaint CMMS</h1>
          <p className="text-xs text-slate-400">
            Industrial Permit to Work (PTW) System Authorization Gateway
          </p>
        </div>

        {/* 1-Click Demo Login Selector for Evaluation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Quick 1-Click Demo Login:
            </span>
            <span className="text-[10px] bg-orange-900/60 text-orange-300 border border-orange-700 px-2 py-0.5 rounded-full font-mono">
              Evaluator Mode
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {DEMO_USERS.map((user) => (
              <button
                key={user.role}
                type="button"
                onClick={() => handleLogin(user.email, user.passwordHint)}
                disabled={loading}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{user.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        ({user.role})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{user.designation}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Standard Manual Login Form */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Or Manual Credentials:
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@opmaint.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In with Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
