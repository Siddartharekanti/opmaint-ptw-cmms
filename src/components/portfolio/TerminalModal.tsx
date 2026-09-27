'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
}

export function TerminalModal({ isOpen, onClose, accentColor = '#f59e0b' }: TerminalModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([
    {
      command: 'init',
      output: (
        <div className="space-y-1 text-slate-300">
          <div className="text-amber-400 font-bold">Arekanti Siddartha — Interactive Developer Shell v2.4</div>
          <div className="text-slate-400 text-xs">
            Type <span className="text-emerald-400 font-bold">help</span> to list available commands, or <span className="text-emerald-400 font-bold">hire</span> to review qualifications.
          </div>
        </div>
      ),
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div><strong className="text-amber-400">help</strong> - Display this commands list</div>
            <div><strong className="text-amber-400">about</strong> - Professional bio & credentials</div>
            <div><strong className="text-amber-400">skills</strong> - Technical stack and tools</div>
            <div><strong className="text-amber-400">patent</strong> - FEELGAN patent (#202441083307) details</div>
            <div><strong className="text-amber-400">projects</strong> - List of production architectures</div>
            <div><strong className="text-amber-400">leetcode</strong> - DSA problems & algorithm benchmarks</div>
            <div><strong className="text-amber-400">education</strong> - University degrees & CGPA</div>
            <div><strong className="text-amber-400">contact</strong> - Email, phone, LinkedIn, GitHub</div>
            <div><strong className="text-amber-400">hire</strong> - Executive pitch for hiring managers</div>
            <div><strong className="text-amber-400">cat resume.txt</strong> - Quick summary of resume</div>
            <div><strong className="text-amber-400">clear</strong> - Reset terminal screen</div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div className="text-white font-bold">Arekanti Siddartha</div>
            <div>M.Tech in Cyber Security @ SRM University-AP (CGPA 8.30/10.0)</div>
            <div>B.Tech in Computer Science & Engineering @ SRM University-AP (CGPA 7.57/10.0)</div>
            <div>Specialties: Zero-Trust Security, Full-Stack Next.js 14, Cloud Systems (AWS/Azure), ML.</div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div><strong className="text-emerald-400">Cybersecurity:</strong> Digital Forensics, ADB Acquisition, Logcat, SHA-256 Hashing, NSGs, API Security.</div>
            <div><strong className="text-sky-400">Cloud & DevOps:</strong> AWS (EC2, S3, RDS Multi-AZ, Route 53), Azure Linux VMs, Docker, Nginx, Prometheus, Grafana.</div>
            <div><strong className="text-purple-400">Full-Stack:</strong> TypeScript, JavaScript, Next.js 14, React, Tailwind CSS, Python (FastAPI/Flask), Prisma ORM, PostgreSQL.</div>
            <div><strong className="text-amber-400">AI / ML:</strong> RAG, ChromaDB, FAISS, OpenCV, Federated Learning, GANs, PyTorch, TensorFlow.</div>
          </div>
        );
        break;

      case 'patent':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div className="text-emerald-400 font-bold">PATENT APPROVED: Application No. 202441083307</div>
            <div className="text-white font-semibold">FEELGAN: Federated Edge Learning with GANs for Medical Image Analysis</div>
            <div>Decentralized healthcare diagnostics combining Federated Learning, GANs, and CNNs to preserve patient privacy without raw data transmission.</div>
            <div>Presented at Anveshan 2024 National Student Research Program.</div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div>1. <strong className="text-amber-400">Opmaint PTW CMMS Enterprise:</strong> Next.js 14, TypeScript, Neon PostgreSQL, SIMOPs conflict detection, canvas signatures.</div>
            <div>2. <strong className="text-rose-400">Android Live Forensics:</strong> ADB acquisition, screen-recording and camera detection, SHA-256 hashing.</div>
            <div>3. <strong className="text-sky-400">Azure Cloud Observability:</strong> Linux VM, Prometheus, Node Exporter, Grafana dashboards, automated alerting.</div>
            <div>4. <strong className="text-emerald-400">RAG AI Data Analysis:</strong> FastAPI, ChromaDB vector store, semantic search engine.</div>
            <div>5. <strong className="text-orange-400">AWS Scalable Architecture:</strong> EC2, S3 static hosting, Multi-AZ RDS MySQL, Route 53 DNS.</div>
          </div>
        );
        break;

      case 'leetcode':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div className="text-amber-400 font-bold">LeetCode Problem Solving Record:</div>
            <div>Total Problems Solved: <strong className="text-white">350+</strong></div>
            <div>Breakdown: 140+ Easy | 180+ Medium | 30+ Hard</div>
            <div>Core Focus: Dynamic Programming, Graph Algorithms, Binary Trees, Sliding Window, Backtracking.</div>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div>• <strong className="text-sky-400">M.Tech in Cyber Security:</strong> SRM University-AP | CGPA: 8.30 / 10.0 (2025 – 2027)</div>
            <div>• <strong className="text-sky-400">B.Tech in Computer Science & Engineering:</strong> SRM University-AP | CGPA: 7.57 / 10.0 (2021 – 2025)</div>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div>Email: <a href="mailto:siddarthaarekanti@gmail.com" className="text-amber-400 underline">siddarthaarekanti@gmail.com</a></div>
            <div>Phone: <a href="tel:+918688050497" className="text-amber-400 underline">+91 8688050497</a></div>
            <div>LinkedIn: <a href="https://linkedin.com/in/siddartha-arekanti-05557b24b" target="_blank" rel="noreferrer" className="text-sky-400 underline">linkedin.com/in/siddartha-arekanti-05557b24b</a></div>
            <div>GitHub: <a href="https://github.com/Siddartharekanti" target="_blank" rel="noreferrer" className="text-purple-400 underline">github.com/Siddartharekanti</a></div>
          </div>
        );
        break;

      case 'hire':
        output = (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5 text-emerald-300">
            <div className="font-bold text-white text-sm">Why Hire Arekanti Siddartha?</div>
            <div>1. <strong className="text-white">Defensive & Systems Mindset:</strong> High academic standing in Cyber Security (8.30 CGPA) + Approved Patent Author. Writes resilient, self-defending software.</div>
            <div>2. <strong className="text-white">End-to-End Delivery:</strong> Engineered and deployed full-stack microservices, serverless cloud databases (Neon), and Linux observability stacks from scratch.</div>
            <div>3. <strong className="text-white">Ready for High-Impact SDE Roles:</strong> Immediate availability, strong algorithmic foundations (350+ DSA), and production discipline.</div>
            <div className="pt-1">
              <a href="mailto:siddarthaarekanti@gmail.com" className="inline-block px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors">
                Schedule Interview ➔
              </a>
            </div>
          </div>
        );
        break;

      case 'cat resume.txt':
        output = (
          <pre className="text-[11px] text-slate-300 leading-relaxed font-mono">
{`============================================================
AREKANTI SIDDARTHA — EXECUTIVE SUMMARY
============================================================
Location: Amaravati, Andhra Pradesh, India
Contact : siddarthaarekanti@gmail.com | +91 8688050497
Education:
- M.Tech in Cyber Security (CGPA: 8.30/10.0), SRM University-AP
- B.Tech in CSE (CGPA: 7.57/10.0), SRM University-AP
Patent: FEELGAN (App #202441083307) - Medical GANs & Federated Edge
Experience: Software Engineering Intern @ SECENAI Semiconductors
Skills: TypeScript, Next.js 14, Python, AWS, Azure, Prometheus, Grafana,
        Prisma ORM, PostgreSQL, Docker, Digital Forensics, Linux.
============================================================`}
          </pre>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <div className="text-xs text-rose-400">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-amber-400 font-bold">help</span> to list valid commands.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: inputVal, output }]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <TerminalIcon className="h-3.5 w-3.5 text-amber-400" />
              siddartha@dev-terminal:~ (zsh)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400 font-bold">siddartha@portfolio:~$</span>
                <span className="text-slate-100">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCommand} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-mono text-xs font-bold pl-2">siddartha@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'skills', 'hire', 'cat resume.txt'..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs outline-none focus:ring-0 placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
