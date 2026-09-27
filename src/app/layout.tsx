import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Arekanti Siddartha | Cybersecurity & Full-Stack Cloud Engineer',
  description:
    'Portfolio of Arekanti Siddartha — M.Tech in Cyber Security (SRM-AP), Patent Holder (FEELGAN #202441083307), and Full-Stack Systems Engineer featuring Opmaint PTW CMMS Platform.',
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
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased font-sans selection:bg-amber-500 selection:text-slate-950">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
