import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Opmaint CMMS — Industrial Permit to Work (PTW) System',
  description:
    'Safety-critical Permit to Work module for heavy manufacturing and chemical plants. Dual-layer approval, atmospheric gas testing, LOTO isolation, conflict detection, and immutable audit trails.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
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
      </body>
    </html>
  );
}
