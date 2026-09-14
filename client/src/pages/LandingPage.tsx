import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Briefcase,
  KanbanSquare,
  Mail,
  Bot,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loadDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await loadDemoMode();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-sky-500/30 selection:text-sky-300">
      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              JobFlow<span className="text-sky-500">.ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDemo}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Interactive Demo</span>
            </button>
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-md shadow-sky-500/20 transition"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The AI-Powered Career Command Center</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Your entire job search.{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              One intelligent workspace.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track applications, manage multi-round technical interviews, and let Gemini AI automatically organize incoming ATS recruiter emails.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition active:scale-[0.98]"
            >
              Start Tracking Free
            </Link>
            <button
              onClick={handleDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Demo Environment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Interactive Preview Box */}
        <div className="max-w-6xl mx-auto mt-16 p-3 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-800 shadow-2xl relative">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800/80 text-left space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 font-mono pl-2">jobflow.ai/app/pipeline</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                Live Data Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Applied (12)</span>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-bold text-white">Figma</p>
                  <p className="text-[11px] text-slate-400">Design Systems Lead</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Shortlisted (5)</span>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-bold text-white">Linear</p>
                  <p className="text-[11px] text-slate-400">Senior Product Engineer</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Interview (3)</span>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-bold text-white">Stripe</p>
                  <p className="text-[11px] text-purple-300 font-medium">System Design • Wed 2pm</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Offer (1)</span>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-500/30">
                  <p className="text-xs font-bold text-emerald-400">Vercel</p>
                  <p className="text-[11px] text-slate-300 font-semibold">$235k Base + Equity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for High-Growth Tech Careers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Everything you need to navigate recruiter reachouts, schedule technical rounds, and maximize offer packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-sky-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Gmail Auto-Sync & Deduplication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic ATS regex matching detects recruiter updates and merges timeline events without polluting your pipeline.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Gemini AI Career Strategist</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask natural language queries like "Which companies haven't responded in 7 days?" and get instant actionable advice.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-purple-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Funnel Analytics & Turnaround</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uncover your highest-converting application sources, salary distributions, and recruiter response velocity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span className="font-bold text-slate-200">JobFlow AI</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/signup" className="hover:text-white">Create Account</Link>
            <button onClick={handleDemo} className="text-sky-400 hover:text-sky-300">Live Demo</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
