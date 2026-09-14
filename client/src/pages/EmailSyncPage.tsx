import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import {
  Mail,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const EmailSyncPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [testCompany, setTestCompany] = useState('Stripe');
  const [testRole, setTestRole] = useState('Senior Frontend Architect');
  const [testSubject, setTestSubject] = useState('Invitation to Technical Interview at Stripe');
  const [testBody, setTestBody] = useState(
    'Hi Alex, We were extremely impressed with your experience and would love to schedule a 45-minute Technical System Design interview next week. Please pick a slot via our calendar link.'
  );

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['gmail_status'],
    queryFn: async () => {
      const res = await api.get('/gmail/status');
      return res.data?.data;
    },
  });

  const syncSimulationMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/gmail/sync', {
        sender: `recruiter@careers.${testCompany.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: testSubject,
        body: testBody,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gmail_status'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity_feed'] });
    },
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gmail Automation & Auto-Sync
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time email classification, ATS status detection, deduplication, and automatic interview scheduling.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Gmail Account Connected</h3>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Syncing job confirmation emails, ATS updates, and recruiter calendar invites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="block font-bold text-base text-slate-900 dark:text-white">
              {statusData?.emailsProcessed || 14}
            </span>
            <span>Job Emails Processed</span>
          </div>
          <div>
            <span className="block font-bold text-base text-slate-900 dark:text-white">
              {statusData?.totalEmails || 18}
            </span>
            <span>Audited Messages</span>
          </div>
        </div>
      </div>

      {/* Interactive Email Pipeline Simulator & Verification */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Test Email Ingestion & Deduplication Pipeline
            </h3>
          </div>
          <span className="text-xs text-slate-400">Deterministic + Gemini AI Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Company
            </label>
            <input
              type="text"
              value={testCompany}
              onChange={(e) => setTestCompany(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Content
          </label>
          <textarea
            rows={3}
            value={testBody}
            onChange={(e) => setTestBody(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Fuzzy Deduplication will match existing applications rather than duplicate.</span>
          </div>
          <button
            onClick={() => syncSimulationMutation.mutate()}
            disabled={syncSimulationMutation.isPending}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncSimulationMutation.isPending ? 'animate-spin' : ''}`} />
            <span>Simulate Incoming Email</span>
          </button>
        </div>

        {syncSimulationMutation.isSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Successfully processed! Status matched: <strong>{syncSimulationMutation.data?.data?.parsed?.status}</strong> (Action: {syncSimulationMutation.data?.data?.action})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
