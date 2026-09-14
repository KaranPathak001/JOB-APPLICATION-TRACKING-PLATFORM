import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Sparkles,
  Clock,
  ChevronRight,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IDashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { openAddModal } = useOutletContext<{ openAddModal: () => void }>();

  const { data: statsData, isLoading } = useQuery<IDashboardStats>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data?.data;
    },
  });

  const chartData = [
    { name: 'Week 1', apps: 4 },
    { name: 'Week 2', apps: 7 },
    { name: 'Week 3', apps: 12 },
    { name: 'Week 4', apps: 18 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0] || 'Candidate'} 👋
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening across your job search pipeline today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/assistant"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:border-sky-500/50 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>AI Advice</span>
          </Link>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-500/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-sky-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statsData?.totalApplications || 0}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +{statsData?.trends?.applicationsDelta || 18}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. previous period</p>
        </div>

        {/* Active Pipeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-cyan-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Pipeline
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statsData?.activeApplications || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">In active review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Applied & Shortlisted</p>
        </div>

        {/* Upcoming Interviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interviews
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statsData?.interviewsCount || 0}
            </span>
            <span className="text-xs font-medium text-purple-400">Scheduled rounds</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">This month</p>
        </div>

        {/* Offers Received */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Offers
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statsData?.offersCount || 0}
            </span>
            <span className="text-xs font-medium text-emerald-500">In negotiation</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target salary reached</p>
        </div>
      </div>

      {/* Main Grid: Application Funnel & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Funnel Flow (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Funnel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Stage-by-stage candidate progression</p>
              </div>
              <Link to="/app/pipeline" className="text-xs font-semibold text-sky-500 hover:text-sky-400 flex items-center gap-1">
                <span>View Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Applied</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{statsData?.funnel?.applied || 0}</p>
                <span className="text-[10px] text-slate-400">100% baseline</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Shortlisted</span>
                <p className="text-2xl font-bold text-sky-500 mt-1">{statsData?.funnel?.shortlisted || 0}</p>
                <span className="text-[10px] text-emerald-500">Screening stage</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Interview</span>
                <p className="text-2xl font-bold text-purple-400 mt-1">{statsData?.funnel?.interview || 0}</p>
                <span className="text-[10px] text-purple-400">Technical rounds</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Offer</span>
                <p className="text-2xl font-bold text-emerald-500 mt-1">{statsData?.funnel?.offer || 0}</p>
                <span className="text-[10px] text-emerald-500">Final selection</span>
              </div>
            </div>
          </div>

          <div className="h-44 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="apps" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#appGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Strategic Insights (1 Col) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-sm flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">AI Strategic Insights</h3>
                <p className="text-xs text-slate-400">Live intelligence from your pipeline</p>
              </div>
            </div>

            <div className="space-y-3 mt-2">
              {statsData?.aiInsights?.length ? (
                statsData.aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 transition hover:border-sky-500/40"
                  >
                    <p className="text-xs font-semibold text-sky-400">{insight.title}</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{insight.description}</p>
                    <div className="pt-1">
                      <Link
                        to={insight.actionUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
                      >
                        <span>{insight.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Add more applications to receive custom career insights.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link
              to="/app/assistant"
              className="w-full py-2 px-3 rounded-xl bg-sky-600/30 hover:bg-sky-600/40 border border-sky-500/30 text-xs font-semibold text-sky-300 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Job Search Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Upcoming Interviews & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Interviews</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Next scheduled interview rounds</p>
            </div>
            <Link to="/app/calendar" className="text-xs font-semibold text-sky-500 hover:text-sky-400">
              Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {statsData?.upcomingInterviews && statsData.upcomingInterviews.length > 0 ? (
              statsData.upcomingInterviews.map((inv) => (
                <div
                  key={inv._id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{inv.companyName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20">
                        {inv.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{inv.roleName}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(inv.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inv.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {inv.meetingUrl ? (
                    <a
                      href={inv.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-sky-600/10 hover:bg-sky-600 text-sky-600 hover:text-white transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={`/app/applications/${inv.applicationId}`}
                      className="text-xs font-semibold text-slate-400 hover:text-sky-500"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No upcoming interviews scheduled yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Pipeline Activity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time status shifts and email sync logs</p>
            </div>
            <Link to="/app/activity" className="text-xs font-semibold text-sky-500 hover:text-sky-400">
              All Activity →
            </Link>
          </div>

          <div className="space-y-3">
            {statsData?.recentActivity && statsData.recentActivity.length > 0 ? (
              statsData.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/30"
                >
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-200">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.source}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
