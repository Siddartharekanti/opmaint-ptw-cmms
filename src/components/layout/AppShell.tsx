'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortfolio = pathname === '/portfolio' || pathname?.startsWith('/portfolio/');

  if (isPortfolio) {
    // Render standalone portfolio without CMMS header/footer
    return <div className="w-full min-h-screen">{children}</div>;
  }

  // Standard CMMS Application Shell
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Opmaint CMMS — Industrial Safety & Permit to Work Infrastructure</span>
          <span className="font-mono text-[11px] text-slate-400">
            Compliant with OSHA 1910.146, NFPA 51B & Indian Factories Act 1948
          </span>
        </div>
      </footer>
    </div>
  );
}
