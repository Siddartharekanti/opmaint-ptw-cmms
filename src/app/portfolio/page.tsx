'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldAlert,
  ShieldCheck,
  Award,
  Terminal as TerminalIcon,
  Server,
  Cloud,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Lock,
  Flame,
  ArrowRight,
  Layers,
  Activity,
  Code2,
  Copy,
  Check,
  GraduationCap,
  Briefcase,
  Eye,
  Sliders,
  Sparkles,
  ChevronRight,
  Search,
  KeyRound,
  Download,
  Palette,
  Bot,
  Zap,
  CheckSquare,
} from 'lucide-react';
import { CustomCursor } from '@/components/portfolio/CustomCursor';
import { TerminalModal } from '@/components/portfolio/TerminalModal';

type ThemeMode = 'amber' | 'violet' | 'emerald';

export default function StandalonePortfolioPage() {
  const [theme, setTheme] = useState<ThemeMode>('amber');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'cyber' | 'cloud' | 'fullstack' | 'ai'>('all');
  const [activeProjectTab, setActiveProjectTab] = useState<'architecture' | 'stateMachine' | 'conflicts' | 'signature'>('architecture');

  // Dynamic Theme Colors
  const themeConfig = {
    amber: {
      primary: '#f59e0b',
      accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
      glowBg: 'from-amber-500/10 via-orange-500/10 to-transparent',
      textAccent: 'text-amber-400',
      borderAccent: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      btnPrimary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400',
      ringColor: '#f59e0b',
    },
    violet: {
      primary: '#a855f7',
      accentGradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
      glowBg: 'from-purple-500/10 via-violet-500/10 to-transparent',
      textAccent: 'text-purple-400',
      borderAccent: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      btnPrimary: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-400 hover:to-violet-500',
      ringColor: '#a855f7',
    },
    emerald: {
      primary: '#10b981',
      accentGradient: 'from-emerald-400 via-teal-500 to-emerald-600',
      glowBg: 'from-emerald-500/10 via-teal-500/10 to-transparent',
      textAccent: 'text-emerald-400',
      borderAccent: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      btnPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400',
      ringColor: '#10b981',
    },
  }[theme];

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const skillsData = [
    { name: 'Digital Forensics & Logical ADB Acquisition', category: 'cyber', level: 'Advanced' },
    { name: 'API Security & Cryptography (SHA-256)', category: 'cyber', level: 'Advanced' },
    { name: 'Network Security Groups & Threat Modeling', category: 'cyber', level: 'Advanced' },
    { name: 'Incident Investigation & Logcat / Dumpsys Analysis', category: 'cyber', level: 'Advanced' },
    { name: 'AWS (EC2, S3, RDS Multi-AZ, Route 53)', category: 'cloud', level: 'Advanced' },
    { name: 'Azure (Linux VMs, Azure Monitor, NSGs)', category: 'cloud', level: 'Advanced' },
    { name: 'Observability (Prometheus, Grafana, Node Exporter)', category: 'cloud', level: 'Advanced' },
    { name: 'Docker, Linux Administration & Nginx Reverse Proxy', category: 'cloud', level: 'Advanced' },
    { name: 'Next.js 14 (App Router, Server Actions, Serverless)', category: 'fullstack', level: 'Advanced' },
    { name: 'TypeScript & JavaScript (ES6+)', category: 'fullstack', level: 'Advanced' },
    { name: 'Python (FastAPI, Flask, OpenCV, Asyncio)', category: 'fullstack', level: 'Advanced' },
    { name: 'Prisma ORM & PostgreSQL (Neon Serverless)', category: 'fullstack', level: 'Advanced' },
    { name: 'Tailwind CSS, Responsive UI & HTML5 Canvas', category: 'fullstack', level: 'Advanced' },
    { name: 'Retrieval-Augmented Generation (RAG) & Vector DBs', category: 'ai', level: 'Proficient' },
    { name: 'ChromaDB, FAISS & LangChain Fundamentals', category: 'ai', level: 'Proficient' },
    { name: 'Federated Learning & GANs (Medical Imaging)', category: 'ai', level: 'Advanced' },
    { name: 'Computer Vision (OpenCV, SVM, CNN Classifiers)', category: 'ai', level: 'Advanced' },
    { name: 'Data Structures & Algorithms (350+ LeetCode Solved)', category: 'fullstack', level: 'Advanced' },
  ];

  const filteredSkills = activeTab === 'all' ? skillsData : skillsData.filter((s) => s.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Custom Fluid Interactive Cursor */}
      <CustomCursor themeColor={themeConfig.ringColor} />

      {/* Interactive Hacker Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        accentColor={themeConfig.primary}
      />

      {/* Cyber Grid Background Matrix */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-amber-500/5 via-purple-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Dedicated Standalone Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${themeConfig.accentGradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className={`font-black text-lg ${themeConfig.textAccent}`}>AS</span>
              </div>
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                Arekanti Siddartha
                <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Open for Opportunities
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">Cybersecurity & Full-Stack Cloud Engineer</div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors" data-cursor="ABOUT">About</a>
            <a href="#recruiter" className="hover:text-amber-400 transition-colors text-amber-400 font-bold" data-cursor="PITCH">Recruiter Pitch</a>
            <a href="#flagship" className="hover:text-amber-400 transition-colors flex items-center gap-1.5" data-cursor="FLAGSHIP">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>PTW CMMS</span>
            </a>
            <a href="#patent" className="hover:text-amber-400 transition-colors" data-cursor="PATENT">Patent</a>
            <a href="#projects" className="hover:text-amber-400 transition-colors" data-cursor="PROJECTS">Projects</a>
            <a href="#skills" className="hover:text-amber-400 transition-colors" data-cursor="SKILLS">Skills</a>
            <a href="#leetcode" className="hover:text-amber-400 transition-colors" data-cursor="DSA">LeetCode</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors" data-cursor="CONTACT">Contact</a>
          </div>

          {/* Right Controls: Theme Selector + Terminal + Launch App */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Pills */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setTheme('amber')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'amber' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Obsidian Amber Theme"
                data-cursor="AMBER"
              >
                <div className="h-3 w-3 rounded-full bg-amber-400" />
              </button>
              <button
                onClick={() => setTheme('violet')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'violet' ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Quantum Violet Theme"
                data-cursor="VIOLET"
              >
                <div className="h-3 w-3 rounded-full bg-purple-400" />
              </button>
              <button
                onClick={() => setTheme('emerald')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Matrix Emerald Theme"
                data-cursor="EMERALD"
              >
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </button>
            </div>

            {/* Interactive Terminal Trigger Button */}
            <button
              onClick={() => setTerminalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
              title="Launch Interactive Terminal (CLI)"
              data-cursor="TERMINAL"
            >
              <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">CLI Shell</span>
            </button>

            {/* Launch Live PTW CMMS App */}
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-xl ${themeConfig.btnPrimary} font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5`}
              data-cursor="LAUNCH"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Live PTW CMMS</span>
              <span className="sm:hidden">App</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative pt-12 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Credentials */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-inner">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">Available Now</span>
                <span className="text-slate-500">•</span>
                <span>Full-Stack &amp; Cybersecurity SDE</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Engineering Secure,{' '}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.accentGradient}`}>
                    High-Reliability
                  </span>{' '}
                  Software Systems.
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-slate-300">
                  Arekanti Siddartha <span className="text-slate-500 font-normal">|</span> M.Tech in Cyber Security (SRM-AP) <span className="text-slate-500 font-normal">|</span> Patent Holder
                </p>
              </div>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                Specialized in zero-trust application security, scalable cloud backends, and full-stack architectures. Author of approved patent <span className={`${themeConfig.textAccent} font-mono font-bold`}>FEELGAN</span> in privacy-preserving medical AI. Solved 350+ data structures &amp; algorithms problems with proven full-stack execution in Next.js 14, TypeScript, and serverless PostgreSQL.
              </p>

              {/* Key Credentials Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm group hover:border-amber-500/40 transition-colors" data-cursor="PATENT">
                  <div className={`font-black text-xl ${themeConfig.textAccent}`}>Patent Appr.</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">FEELGAN #202441083307</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm group hover:border-sky-500/40 transition-colors" data-cursor="M.TECH">
                  <div className="text-sky-400 font-black text-xl">8.30 / 10</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">M.Tech Cyber Security</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm group hover:border-emerald-500/40 transition-colors" data-cursor="LEETCODE">
                  <div className="text-emerald-400 font-black text-xl">350+ DSA</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">LeetCode Solved</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm group hover:border-purple-500/40 transition-colors" data-cursor="TESTS">
                  <div className="text-purple-400 font-black text-xl">24/24 Tests</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Passing Automated Tests</div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#flagship"
                  className={`px-6 py-3.5 rounded-xl ${themeConfig.btnPrimary} font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5`}
                  data-cursor="EXPLORE"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Explore PTW CMMS Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 font-semibold text-sm flex items-center gap-2 transition-all"
                  data-cursor="PDF"
                >
                  <Download className={`h-4 w-4 ${themeConfig.textAccent}`} />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href="https://github.com/Siddartharekanti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                  title="GitHub Profile"
                  data-cursor="GITHUB"
                >
                  <Github className="h-5 w-5" />
                </a>

                <a
                  href="https://linkedin.com/in/siddartha-arekanti-05557b24b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700/80 transition-colors"
                  title="LinkedIn Profile"
                  data-cursor="LINKEDIN"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Column: Studio-Framed Professional Photograph */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                {/* Multi-Layer Animated Glow Aura */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${themeConfig.accentGradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-75 transition duration-700 animate-glow-pulse`} />

                <div className="relative rounded-3xl bg-slate-900 border border-slate-800/80 overflow-hidden shadow-2xl p-6 glass-panel">
                  {/* Photo Container */}
                  <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/60 shadow-inner group/photo">
                    <Image
                      src="/siddartha.png"
                      alt="Arekanti Siddartha"
                      fill
                      className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

                    {/* Floating Status Badges inside photo */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Verified Engineer
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-300 font-bold">
                        Amaravati, AP
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg ${themeConfig.badgeBg} text-xs font-black`}>
                        SRM-AP
                      </span>
                    </div>
                  </div>

                  {/* Profile Direct Links Card */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="text-xs text-slate-400">Core Strengths</div>
                      <div className={`text-xs font-bold ${themeConfig.textAccent}`}>Full-Stack &amp; Cybersecurity</div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="text-xs text-slate-400">Email</div>
                      <button
                        onClick={() => copyToClipboard('siddarthaarekanti@gmail.com', 'email')}
                        className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 group/btn"
                        data-cursor="COPY"
                      >
                        <span>siddarthaarekanti@gmail.com</span>
                        {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-white" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">Phone</div>
                      <button
                        onClick={() => copyToClipboard('+918688050497', 'phone')}
                        className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 group/btn"
                        data-cursor="COPY"
                      >
                        <span>+91 8688050497</span>
                        {copiedPhone ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Quick Pitch Section */}
      <section id="recruiter" className="py-16 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider mb-2`}>
              <Zap className="h-3.5 w-3.5" />
              Executive Recruiter Summary
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Top 3 Reasons to Interview Siddartha
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Highlights for engineering leaders and hiring teams seeking high-impact contributors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 glass-panel-hover" data-cursor="REASON 1">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Zero-Trust &amp; Secure Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                M.Tech in Cyber Security (CGPA 8.30) with an approved patent in decentralized medical AI (<span className="text-amber-300">FEELGAN</span>). Builds applications that are secure-by-default, enforcing strict role boundaries, cryptographic hashing, and threat mitigation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 glass-panel-hover" data-cursor="REASON 2">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Full-Stack Cloud Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proven ability to engineer and deploy production architectures end-to-end: Next.js 14 App Router, TypeScript, serverless PostgreSQL with Neon connection pooling, Prisma ORM, Docker, and observability with Prometheus &amp; Grafana.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 glass-panel-hover" data-cursor="REASON 3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Algorithmic Rigor &amp; Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                350+ LeetCode problems solved with comprehensive test suites (24/24 Vitest tests covering state machines &amp; concurrency invariants). Strong track record of automating manual workflows by 80% with computer vision and ML during SECENAI internship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Project Spotlight: Opmaint PTW CMMS Platform */}
      <section id="flagship" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                <Activity className="h-3.5 w-3.5" />
                Featured Flagship System • Live Production
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Permit to Work (PTW) CMMS Enterprise
              </h2>
              <p className="text-slate-400 max-w-2xl text-base">
                Mission-critical safety CMMS infrastructure for refineries, power generation, and manufacturing plants. Enforces server-side zero-trust approval invariants, SIMOPs conflict detection, and immutable legal compliance.
              </p>
            </div>

            {/* Live Launch Links */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className={`px-5 py-3 rounded-xl ${themeConfig.btnPrimary} font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5`}
                data-cursor="LAUNCH"
              >
                <Activity className="h-4 w-4" />
                <span>Launch Live App</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/permits/create"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
                data-cursor="CREATE"
              >
                <FileText className={`h-4 w-4 ${themeConfig.textAccent}`} />
                <span>Create Permit</span>
              </Link>
              <a
                href="https://github.com/Siddartharekanti/opmaint-ptw-cmms"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
                data-cursor="GITHUB"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>

          {/* Interactive Feature Architecture Showcase */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl glass-panel">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-slate-800 bg-slate-900/90 p-2 gap-2">
              <button
                onClick={() => setActiveProjectTab('architecture')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'architecture'
                    ? `${themeConfig.badgeBg} font-black shadow-md`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                data-cursor="TYPES"
              >
                <Layers className="h-4 w-4" />
                <span>1. Extensible Permit Types (5 Types)</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('stateMachine')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'stateMachine'
                    ? `${themeConfig.badgeBg} font-black shadow-md`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                data-cursor="STATE"
              >
                <Lock className="h-4 w-4" />
                <span>2. Safety State Machine &amp; Dual Sign-Off</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('conflicts')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'conflicts'
                    ? `${themeConfig.badgeBg} font-black shadow-md`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                data-cursor="SIMOPS"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>3. SIMOPs Conflict Detection</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('signature')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'signature'
                    ? `${themeConfig.badgeBg} font-black shadow-md`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                data-cursor="AUDIT"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>4. Audit Ledger &amp; Canvas Signatures</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              {activeProjectTab === 'architecture' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Extensible Registry Architecture</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Rather than five disconnected database schemas, the platform uses an extensible type registry:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Shared Base Schema:</strong> Common plant locations, timestamps, serial numbers, checklist verification, and status.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Dynamic Type Fields:</strong> Hot Work (combustible clearance radius, fire watch), Confined Space (4-gas tests, standby attendant), Height (fall arrest, wind speed), Electrical LOTO (voltage levels, lock tags).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">5th Pluggable Type (Excavation):</strong> Implemented with zero schema migrations, rendered cleanly by adaptive UI components.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                    <div className="text-amber-400 font-bold mb-2">// src/lib/permit-types.ts</div>
                    <pre className="text-slate-300 leading-relaxed">
{`export const PERMIT_TYPE_REGISTRY = {
  HOT_WORK: { code: 'HW', fields: [ ... ] },
  CONFINED_SPACE: { code: 'CSE', fields: [ ... ] },
  WORKING_AT_HEIGHT: { code: 'WAH', fields: [ ... ] },
  ELECTRICAL_LOTO: { code: 'LOTO', fields: [ ... ] },
  EXCAVATION: { 
    code: 'EXC', 
    fields: [
      { name: 'depthInMeters', type: 'number', required: true },
      { name: 'undergroundServicesChecked', type: 'boolean' },
      { name: 'shoringOrBenchingInstalled', type: 'boolean' }
    ]
  }
};`}
                    </pre>
                  </div>
                </div>
              )}

              {activeProjectTab === 'stateMachine' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Zero-Trust Safety State Machine</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Rigorous state validation prevents human error and regulatory non-compliance:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Anti-Self-Approval:</strong> Requesters cannot sign off their own permit under any circumstance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Area Owner Boundary Check:</strong> Area Owners can only approve work within their assigned facility zone.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Mandatory Dual Approvals:</strong> Both Area Owner AND Safety Officer signatures are required.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Active Work Log Guard:</strong> Work cannot transition to Closed without verified work log entries.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-emerald-400 font-bold mb-2">// Lifecycle State Machine</div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      DRAFT ➔ PENDING_APPROVAL
                    </div>
                    <div className="text-center text-slate-600">▼ (Step 1: Area Owner Sign-off)</div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      PENDING_APPROVAL (Area Owner Signed)
                    </div>
                    <div className="text-center text-slate-600">▼ (Step 2: Safety Officer Sign-off)</div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-400 font-bold">
                      APPROVED ➔ ACTIVE (Locks until plannedStartTime reached)
                    </div>
                    <div className="text-center text-slate-600">▼ (Work Logging + Gas Checks)</div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      ACTIVE ➔ CLOSED (Requires WorkLog) ➔ CLOSED_VERIFIED
                    </div>
                  </div>
                </div>
              )}

              {activeProjectTab === 'conflicts' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Spatial-Temporal SIMOPs Conflict Engine</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Simultaneous Operations (SIMOPs) in chemical or manufacturing plants can cause catastrophic accidents. The built-in conflict engine evaluates incoming permits in real time:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <Flame className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Hot Work + Confined Space Conflict:</strong> Automatically blocks or warns if Hot Work (open flame) is scheduled near an active Confined Space entry.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Equipment Tag Collision:</strong> Prevents multiple teams from scheduling conflicting maintenance on the exact same asset simultaneously.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Area Saturation Warning:</strong> Alerts safety supervisors when multiple high-hazard permits overlap within the same physical zone.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 font-mono text-xs">
                    <div className="text-rose-400 font-bold mb-2">// Real-time SIMOPs Alert Matrix</div>
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                      <div className="flex items-center gap-2 font-bold">
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                        CRITICAL CONFLICT DETECTED
                      </div>
                      <div className="text-[11px] leading-relaxed">
                        &quot;Hot Work welding scheduled in Area BLR-01 overlaps with active Confined Space Entry on High-Pressure Boiler HP-01. Spark migration risk exceeds OSHA threshold.&quot;
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProjectTab === 'signature' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Immutable Audit Ledger &amp; Canvas Signatures</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Ensures tamper-proof legal compliance for environmental and occupational health safety (OSHA / ISO 45001):
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">HTML5 Digital Canvas Signatures:</strong> Area Owners and Safety Officers sign directly on touchscreens or with mice. Signatures are serialized as Base64 data URLs.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Cryptographic QR Verification:</strong> Generates unique mobile QR codes for on-site field auditors to scan and verify permit validity instantly.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Append-Only Audit Log:</strong> Every action, status change, timestamp, and field modification is stored permanently with user attribution.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center space-y-3">
                    <div className="text-xs font-mono text-slate-400">Digital Signature Verification Sample</div>
                    <div className="h-24 w-full bg-slate-950 rounded-xl border border-dashed border-slate-700 flex items-center justify-center font-serif italic text-amber-400 text-2xl tracking-wider">
                      Suresh Raina, Area Lead
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 px-2">
                      <span>Area Owner Sign-off</span>
                      <span className="text-emerald-400 font-bold">✓ Cryptographically Logged</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Accounts Bar */}
            <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span className="font-semibold">Demo Role Accounts (Password: Password123!):</span>
                <span className="font-mono text-slate-400">rajesh.technician@opmaint.com</span> •{' '}
                <span className="font-mono text-slate-400">suresh.areaowner@opmaint.com</span> •{' '}
                <span className="font-mono text-slate-400">priya.safety@opmaint.com</span>
              </div>
              <Link
                href="/login"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                data-cursor="LOGIN"
              >
                <span>Switch Role in Live App</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patent & Research Section */}
      <section id="patent" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider mb-3`}>
              <Award className="h-3.5 w-3.5" />
              Intellectual Property &amp; Research
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Patent: FEELGAN Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Privacy-Preserving Federated Edge Learning with Generative Adversarial Networks for Decentralized Healthcare Diagnostics.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 p-8 shadow-2xl relative overflow-hidden glass-panel">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    PATENT APPROVED
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    Application No: 202441083307
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Anveshan 2024 National Presentation
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  FEELGAN: Federated Edge Learning with GANs for Medical Image Analysis
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Medical centers frequently cannot centralize diagnostic imagery due to strict patient privacy mandates (HIPAA, GDPR). FEELGAN resolves this by deploying Generative Adversarial Networks (GANs) and Convolutional Neural Networks (CNNs) across edge nodes. Local models synthesize feature distributions, training a global model without transmitting raw private patient records.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-purple-400 font-bold text-sm">Edge Computing</div>
                    <div className="text-[11px] text-slate-400 mt-1">Distributed node-level inference minimizing latency.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-purple-400 font-bold text-sm">Differential Privacy</div>
                    <div className="text-[11px] text-slate-400 mt-1">GAN generator masking prevents model inversion attacks.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-purple-400 font-bold text-sm">Decentralized Aggregation</div>
                    <div className="text-[11px] text-slate-400 mt-1">FedAvg gradient fusion across participating clinics.</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-white font-bold text-base">Indian Patent Office</div>
                  <div className="text-xs text-slate-400 font-mono">App. #202441083307</div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Presented at the <strong className="text-slate-200">National Student Research Program (Anveshan 2024)</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Engineering Projects */}
      <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider mb-3`}>
              <TerminalIcon className="h-3.5 w-3.5" />
              Cybersecurity, Cloud &amp; AI Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Selected Systems Engineering Work
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Production architectures spanning digital forensics, cloud infrastructure, AI retrieval, and scalable web services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project 1: Android Live Forensics */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="FORENSICS">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Forensics / Security</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                  Android Live Forensics: Unauthorized Screen Recording Detection
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Constructed an incident-response live forensics tool using ADB logical acquisition. Traces hidden virtual displays, suspicious camera-access daemon activity, and process timelines via Logcat and Dumpsys. Validates collected artifacts with SHA-256 evidence hashing.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Python</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">ADB</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Logcat</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">SHA-256</span>
              </div>
            </div>

            {/* Project 2: Azure Cloud Monitoring */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="AZURE">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Activity className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Cloud / DevOps</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                  Azure VM Cloud Monitoring &amp; Metric Alerting Platform
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provisioned an Azure Linux virtual machine with strict Network Security Groups. Integrated Prometheus and Node Exporter to scrape CPU, RAM, disk I/O, and network telemetry into Grafana dashboards. Designed proactive Azure Monitor threshold alerts validated with CPU stress tests.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Azure Linux</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Prometheus</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Grafana</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Node Exporter</span>
              </div>
            </div>

            {/* Project 3: RAG & AI Data Analysis */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="RAG">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Database className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">AI / LLM Backend</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  RAG &amp; AI Technical Document Analysis Service
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered a high-performance FastAPI service utilizing Retrieval-Augmented Generation (RAG) and ChromaDB vector store. Features asynchronous document ingestion, semantic chunking, cosine similarity vector search, and context-aware LLM query answering.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">FastAPI</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">RAG</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">ChromaDB</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Vector Search</span>
              </div>
            </div>

            {/* Project 4: Real-Time Language Translator */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="TRANSLATE">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Cpu className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Web &amp; Cloud</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Real-Time Language Translator with Cloud Observability
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deployed an interactive Flask audio/text translation system on Azure Linux VM. Integrated SpeechRecognition, Google Translate API, and gTTS for voice synthesis. Configured Prometheus and Grafana for real-time latency and request rate monitoring.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Flask</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Python</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Speech API</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Grafana</span>
              </div>
            </div>

            {/* Project 5: AWS Scalable Architecture */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="AWS">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Cloud className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Cloud Architecture</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  End-to-End Scalable AWS Application Architecture
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Architected full-stack hosting on AWS: static assets delivered from Amazon S3, backend Node.js REST APIs hosted on Amazon EC2 with Nginx reverse proxy, and Amazon RDS MySQL deployed in Multi-AZ configuration with Route 53 DNS routing.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">AWS EC2</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">S3</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Multi-AZ RDS</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Route 53</span>
              </div>
            </div>

            {/* Project 6: Biometric Attendance Computer Vision */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all glass-panel-hover" data-cursor="OPENCV">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Eye className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Computer Vision</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  Real-Time Biometric Identification (SECENAI Intern)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Developed automated student recognition pipeline at SECENAI Semiconductors using Python, OpenCV, and CNN/SVM classifiers. Achieved 95%+ identification accuracy across 100+ student records, slashing manual tracking overhead by 80%.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">OpenCV</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">CNN</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">SVM</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Python</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LeetCode & Problem Solving Benchmarks */}
      <section id="leetcode" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider mb-3`}>
              <Code2 className="h-3.5 w-3.5" />
              Algorithmic Proficiency
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              LeetCode &amp; Competitive Problem Solving
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Demonstrated mastery of core data structures, graph theory, dynamic programming, and computational complexity.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 glass-panel shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Score Wheel */}
              <div className="lg:col-span-4 text-center p-6 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className={`text-6xl font-black ${themeConfig.textAccent}`}>350+</div>
                <div className="text-sm font-bold text-white mt-1">Problems Solved</div>
                <div className="text-xs text-slate-400 font-mono mt-1">github.com/Siddartharekanti</div>
                
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                  <CheckSquare className="h-4 w-4" />
                  <span>Consistent Problem Solver</span>
                </div>
              </div>

              {/* Right: Category Progress Bars */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-400">Easy (Foundations &amp; Arrays)</span>
                    <span className="text-slate-300 font-mono">140+ / 140+</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-400">Medium (Trees, Graphs, DP, Sliding Window)</span>
                    <span className="text-slate-300 font-mono">180+ Solved</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-rose-400">Hard (Advanced Dynamic Programming &amp; Bitmasking)</span>
                    <span className="text-slate-300 font-mono">30+ Solved</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-rose-500 rounded-full w-[35%]" />
                  </div>
                </div>

                {/* Topics Tags */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Graph Theory &amp; BFS/DFS</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Dynamic Programming</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Binary Search</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Sliding Window</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Backtracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Skills Matrix */}
      <section id="skills" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider mb-3`}>
              <Sliders className="h-3.5 w-3.5" />
              Engineering Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Technical Skills Matrix
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Filtered across security, cloud infrastructure, full-stack, and machine learning.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? `${themeConfig.badgeBg} font-black shadow-md`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              data-cursor="ALL"
            >
              All Skills ({skillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('cyber')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cyber'
                  ? `${themeConfig.badgeBg} font-black shadow-md`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              data-cursor="CYBER"
            >
              Cybersecurity &amp; Forensics
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cloud'
                  ? `${themeConfig.badgeBg} font-black shadow-md`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              data-cursor="CLOUD"
            >
              Cloud &amp; Observability
            </button>
            <button
              onClick={() => setActiveTab('fullstack')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fullstack'
                  ? `${themeConfig.badgeBg} font-black shadow-md`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              data-cursor="DEV"
            >
              Full-Stack &amp; Languages
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ai'
                  ? `${themeConfig.badgeBg} font-black shadow-md`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              data-cursor="AI"
            >
              AI &amp; Edge Research
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all glass-panel-hover"
                data-cursor="SKILL"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{skill.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      <section id="experience" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Work History */}
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider`}>
                <Briefcase className="h-3.5 w-3.5" />
                Work History
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Experience</h2>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 glass-panel-hover" data-cursor="SECENAI">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">Software Engineering Intern</h3>
                    <div className={`text-xs ${themeConfig.textAccent} font-semibold`}>
                      SECENAI Semiconductors and Test Solutions Pvt. Ltd.
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    May 2024 – Jul 2024
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className={themeConfig.textAccent}>•</span>
                    <span>Developed a Python real-time student recognition system using OpenCV, achieving 95%+ classification accuracy across 100+ records.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={themeConfig.textAccent}>•</span>
                    <span>Automated image validation, normalization, and record generation using SVM &amp; CNN techniques, cutting manual effort by 80%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={themeConfig.textAccent}>•</span>
                    <span>Performed edge reliability testing under fluctuating illumination and optimized memory consumption.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                <GraduationCap className="h-3.5 w-3.5" />
                Academic Background
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Education</h2>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 glass-panel-hover" data-cursor="MTECH">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">M.Tech in Cyber Security</h3>
                      <div className="text-xs text-sky-400 font-semibold">SRM University–AP, Amaravati</div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      CGPA: 8.30 / 10.0
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Sep 2025 – Jun 2027 (Expected)</div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 glass-panel-hover" data-cursor="BTECH">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">B.Tech in Computer Science &amp; Engineering</h3>
                      <div className="text-xs text-sky-400 font-semibold">SRM University–AP, Amaravati</div>
                    </div>
                    <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      CGPA: 7.57 / 10.0
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Jun 2021 – May 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact & Hire Section */}
      <section id="contact" className="py-24 relative z-10 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-mono font-bold uppercase tracking-wider`}>
            <Mail className="h-3.5 w-3.5" />
            Let&apos;s Build Together
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Schedule an Interview?
          </h2>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            I am actively interviewing for full-stack engineering, software developer, and cybersecurity positions. Reach out directly via email, phone, or LinkedIn.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href="mailto:siddarthaarekanti@gmail.com"
              className={`px-6 py-3.5 rounded-xl ${themeConfig.btnPrimary} font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5`}
              data-cursor="EMAIL"
            >
              <Mail className="h-4 w-4" />
              <span>Email Siddartha</span>
            </a>

            <a
              href="tel:+918688050497"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              data-cursor="CALL"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>+91 8688050497</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              data-cursor="RESUME"
            >
              <Download className="h-4 w-4" />
              <span>Download Resume PDF</span>
            </a>

            <a
              href="https://linkedin.com/in/siddartha-arekanti-05557b24b"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              data-cursor="LINKEDIN"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Footer Bar */}
          <div className="pt-16 border-t border-slate-800/80 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Arekanti Siddartha. All rights reserved.</div>
            <div className="flex items-center gap-5">
              <Link href="/" className="hover:text-amber-400 transition-colors" data-cursor="PTW APP">
                PTW CMMS App
              </Link>
              <button onClick={() => setTerminalOpen(true)} className="hover:text-emerald-400 transition-colors" data-cursor="CLI">
                Dev Terminal (CLI)
              </button>
              <a href="https://github.com/Siddartharekanti" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" data-cursor="GITHUB">
                GitHub
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" data-cursor="RESUME">
                Resume PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom-Right Terminal Quick-Access Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setTerminalOpen(true)}
          className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:border-emerald-500 text-emerald-400 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
          title="Open Interactive Dev Terminal"
          data-cursor="CLI"
        >
          <TerminalIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-mono text-xs font-bold text-slate-200">
            siddartha@shell:~
          </span>
        </button>
      </div>
    </div>
  );
}
