import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loadDemoMode } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    try {
      const res = await api.post('/auth/login', data);
      if (res.data?.data) {
        login(res.data.data.token, res.data.data.user);
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    await loadDemoMode();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative backdrop-blur-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              JobFlow<span className="text-sky-500">.ai</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight pt-2">Sign in to your command center</h2>
          <p className="text-xs text-slate-400">Continue managing your applications and interviews</p>
        </div>

        {/* 1-Click Demo Sandbox Login */}
        <button
          onClick={handleDemoLogin}
          disabled={isDemoLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
        >
          {isDemoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Instant 1-Click Demo (Preloaded Data)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-800" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Or with email</span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800 bg-slate-950 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800 bg-slate-950 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
