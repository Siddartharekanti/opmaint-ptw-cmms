'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldAlert,
  ShieldCheck,
  Award,
  Terminal,
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
} from 'lucide-react';

export default function PortfolioPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'cyber' | 'cloud' | 'fullstack' | 'ai'>('all');
  const [activeProjectTab, setActiveProjectTab] = useState<'architecture' | 'stateMachine' | 'conflicts' | 'signature'>('architecture');

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
    { name: 'Digital Forensics & ADB Logical Acquisition', category: 'cyber', level: 'Advanced' },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/portfolio" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-lg">
                  AS
                </span>
              </div>
            </div>
            <div>
              <div className="font-bold text-white tracking-tight flex items-center gap-2">
                Arekanti Siddartha
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  M.Tech Cyber Security
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">Portfolio & Engineering Showcase</div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#flagship" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              PTW CMMS System
            </a>
            <a href="#patent" className="hover:text-amber-400 transition-colors">Patent</a>
            <a href="#projects" className="hover:text-amber-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-amber-400 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-amber-400 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Launch Live PTW App</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative pt-12 pb-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Bio & Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-amber-400 shadow-inner">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Full-Stack / Software / Cybersecurity Roles</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Hi, I&apos;m{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                    Arekanti Siddartha
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-slate-300">
                  Full-Stack Software Engineer & Cybersecurity Researcher
                </p>
              </div>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                M.Tech in Cyber Security from <span className="text-white font-medium">SRM University-AP (CGPA 8.30)</span>.
                Patent holder in privacy-preserving medical AI (<span className="text-amber-300 font-mono">FEELGAN</span>). 
                Specialized in architecting high-reliability full-stack systems, zero-trust state machines, cloud observability on AWS & Azure, and deep cybersecurity forensics.
              </p>

              {/* Quick Credentials Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="text-amber-400 font-black text-xl">Patent Appr.</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">FEELGAN #202441083307</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="text-sky-400 font-black text-xl">8.30 / 10</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">M.Tech Cyber Security</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="text-emerald-400 font-black text-xl">350+ DSA</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">LeetCode Solved</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="text-purple-400 font-black text-xl">24/24 Tests</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Passing Automated Tests</div>
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#flagship"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
                >
                  <Download className="h-4 w-4 text-amber-400" />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href="https://github.com/Siddartharekanti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>

                <a
                  href="https://linkedin.com/in/siddartha-arekanti-05557b24b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700/80 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right: High-Res Profile Card with Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-500" />
                
                <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6">
                  {/* Real Photo */}
                  <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-5 shadow-inner">
                    <Image
                      src="/siddartha.png"
                      alt="Arekanti Siddartha"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Amaravati, AP, India
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-black">
                        SRM-AP
                      </span>
                    </div>
                  </div>

                  {/* Profile Quick Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="text-xs text-slate-400">Primary Focus</div>
                      <div className="text-xs font-bold text-amber-300">Cybersecurity & Full-Stack</div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="text-xs text-slate-400">Direct Contact</div>
                      <button
                        onClick={() => copyToClipboard('siddarthaarekanti@gmail.com', 'email')}
                        className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 group/btn"
                      >
                        <span>siddarthaarekanti@gmail.com</span>
                        {copiedEmail ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-500 group-hover/btn:text-white" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">Phone</div>
                      <button
                        onClick={() => copyToClipboard('+918688050497', 'phone')}
                        className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 group/btn"
                      >
                        <span>+91 8688050497</span>
                        {copiedPhone ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-500 group-hover/btn:text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Flagship Project: Opmaint PTW CMMS Platform */}
      <section id="flagship" className="py-20 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Flagship Project • Live Production
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Permit to Work (PTW) CMMS Enterprise
              </h2>
              <p className="text-slate-400 max-w-2xl text-base">
                An enterprise safety management module engineered for heavy industrial facilities (refineries, power plants, manufacturing). Built with serverless PostgreSQL, zero-trust multi-role approval workflow, and real-time SIMOPs conflict detection.
              </p>
            </div>

            {/* Live System Indicator & Launch Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Activity className="h-4 w-4" />
                <span>Launch Live App</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/permits/create"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <FileText className="h-4 w-4 text-amber-400" />
                <span>Create Permit</span>
              </Link>
              <a
                href="https://github.com/Siddartharekanti/opmaint-ptw-cmms"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>

          {/* Architecture Showcase Tabs */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Tab Selector */}
            <div className="flex flex-wrap border-b border-slate-800 bg-slate-900/80 p-2 gap-2">
              <button
                onClick={() => setActiveProjectTab('architecture')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'architecture'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>1. Extensible Permit Types (5 Types)</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('stateMachine')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'stateMachine'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>2. Safety State Machine & Dual Approval</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('conflicts')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'conflicts'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>3. SIMOPs Conflict Detection</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('signature')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeProjectTab === 'signature'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>4. Audit Ledger & Canvas Signatures</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              {activeProjectTab === 'architecture' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Extensible Registry Pattern</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Rather than hardcoding five separate tables with rigid columns, the architecture implements a decoupled registry pattern:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Base Permit Entity:</strong> Models shared lifecycle attributes (timestamps, location hierarchy, status, checklists, hazard categories).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Type-Specific Polymorphic Fields:</strong> Hot Work (flammable gas readings, fire watch), Confined Space (4-gas tests, standby attendant), Height (fall arrest, wind speed), Electrical LOTO (voltage, lock numbers).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">5th Extensible Type (Excavation):</strong> Added with zero schema migrations, fully rendered by the adaptive schema engine with underground scan checks and trench shoring fields.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                    <div className="text-amber-400 font-bold mb-2">// src/lib/permit-types.ts</div>
                    <pre className="text-slate-300 leading-relaxed">
{`export const PERMIT_TYPE_REGISTRY: Record<string, PermitTypeConfig> = {
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
                      Every transition is validated server-side against cryptographic principles and safety laws:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Anti-Self-Approval:</strong> A permit requester can never approve their own permit under any role condition.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Area Owner Boundary Check:</strong> Area Owners can only authorize permits within their officially assigned physical plant boundary.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Dual Approval Sign-Off:</strong> Both Area Owner AND Safety Officer must approve before a permit can transition to Approved.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Activation Time Guard:</strong> Technicians cannot activate a permit before the planned start time window.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-200">Active Work Log Constraint:</strong> A permit cannot be closed without at least one recorded active work log entry.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800">
                    <div className="text-xs font-mono text-emerald-400 mb-3">// State Lifecycle Flowchart</div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        DRAFT ➔ PENDING_APPROVAL
                      </div>
                      <div className="text-center text-slate-600">▼ (Step 1: Area Owner Sign-off)</div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        PENDING_APPROVAL (Area Owner Signed)
                      </div>
                      <div className="text-center text-slate-600">▼ (Step 2: Safety Officer Sign-off)</div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-400 font-bold">
                        APPROVED ➔ ACTIVE (Requires plannedStartTime reached)
                      </div>
                      <div className="text-center text-slate-600">▼ (Work Logging + Gas Checks)</div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        ACTIVE ➔ CLOSED (Requires WorkLog) ➔ CLOSED_VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProjectTab === 'conflicts' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">Spatial-Temporal SIMOPs Engine</h3>
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
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
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
                    <h3 className="text-2xl font-black text-white">Immutable Audit Ledger & Canvas Signatures</h3>
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

            {/* Quick Demo Credentials Footer */}
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
              >
                <span>Switch Role in Live App</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Patent & Research Section */}
      <section id="patent" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Award className="h-3.5 w-3.5" />
              Intellectual Property & Publications
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Patent: FEELGAN Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Privacy-Preserving Federated Edge Learning with Generative Adversarial Networks for Decentralized Healthcare Diagnostics.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
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
                  Healthcare organizations frequently cannot centralize sensitive medical imagery due to strict patient confidentiality regulations (HIPAA, GDPR). FEELGAN resolves this by deploying Generative Adversarial Networks (GANs) and Convolutional Neural Networks (CNNs) directly across decentralized edge nodes. Local models synthesize representative feature distributions, training a global model without transmitting raw private patient records.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-purple-400 font-bold text-sm">Edge Computing</div>
                    <div className="text-[11px] text-slate-400 mt-1">Distributed node-level inference minimizing latency.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-purple-400 font-bold text-sm">Differential Privacy</div>
                    <div className="text-[11px] text-slate-400 mt-1">GAN generator masking prevents model inversion attacks.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
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

      {/* Engineering Projects Grid */}
      <section id="projects" className="py-20 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Terminal className="h-3.5 w-3.5" />
              Cybersecurity, Cloud & AI Projects
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
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
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

            {/* Project 2: Azure Cloud Monitoring & Alerting */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Activity className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Cloud / DevOps</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                  Azure VM Cloud Monitoring & Metric Alerting Platform
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
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Database className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">AI / LLM Backend</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  RAG & AI Technical Document Analysis Service
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
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Cpu className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Web & Cloud</span>
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

            {/* Project 5: End-to-End AWS Scalable Deployment */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
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

            {/* Project 6: Computer Vision Attendance Identification */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
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

      {/* Interactive Technical Skills Matrix */}
      <section id="skills" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Sliders className="h-3.5 w-3.5" />
              Core Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Technical Skills Matrix
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Filtered by engineering disciplines and operational capabilities.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Skills ({skillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('cyber')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cyber'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Cybersecurity & Forensics
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cloud'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Cloud & Observability
            </button>
            <button
              onClick={() => setActiveTab('fullstack')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fullstack'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Full-Stack & Languages
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              AI, ML & Edge Research
            </button>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
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
      <section id="experience" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Work Experience */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5" />
                Work History
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Experience</h2>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">Software Engineering Intern</h3>
                      <div className="text-xs text-amber-400 font-medium">
                        SECENAI Semiconductors and Test Solutions Pvt. Ltd.
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      May 2024 – Jul 2024
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>Engineered a Python-based real-time attendance recognition system using OpenCV, achieving 95%+ classification accuracy across 100+ records.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>Automated computer vision ingestion, image normalization, and record generation using SVM & CNN, cutting manual verification by 80%.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>Conducted edge reliability testing in dynamic ambient lighting and fixed production memory bottlenecks.</span>
                    </li>
                  </ul>
                </div>
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
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">M.Tech in Cyber Security</h3>
                      <div className="text-xs text-sky-400 font-medium">SRM University–AP, Amaravati</div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      CGPA: 8.30 / 10.0
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Sep 2025 – Jun 2027 (Expected)</div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">B.Tech in Computer Science & Engineering</h3>
                      <div className="text-xs text-sky-400 font-medium">SRM University–AP, Amaravati</div>
                    </div>
                    <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      CGPA: 7.57 / 10.0
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Jun 2021 – May 2025</div>
                </div>

                {/* Achievements Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-200">Key Achievements & Competitive Milestones</div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span><strong>LeetCode:</strong> 350+ Data Structures & Algorithms solved.</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span><strong>Anveshan 2024:</strong> Selected & Presented FEELGAN at the National Student Research Program.</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span><strong>Sushacks 2025:</strong> Nationwide Innovation Hackathon Competitor.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Mail className="h-3.5 w-3.5" />
            Let&apos;s Connect
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Interested in Building High-Reliability Systems Together?
          </h2>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            I am actively interviewing for software engineering, full-stack, and cybersecurity roles. Feel free to contact me directly or review my codebase.
          </p>

          {/* Contact Direct Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href="mailto:siddarthaarekanti@gmail.com"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              <span>Email Siddartha</span>
            </a>

            <a
              href="tel:+918688050497"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>+91 8688050497</span>
            </a>

            <a
              href="https://linkedin.com/in/siddartha-arekanti-05557b24b"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Message</span>
            </a>
          </div>

          {/* Footer Copyright */}
          <div className="pt-12 border-t border-slate-800/80 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Arekanti Siddartha. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                PTW CMMS App
              </Link>
              <a href="https://github.com/Siddartharekanti" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                GitHub
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                Resume PDF
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
