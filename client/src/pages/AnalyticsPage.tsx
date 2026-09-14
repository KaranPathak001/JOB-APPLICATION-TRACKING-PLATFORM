import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { IAnalyticsResponse } from '../types';

const COLORS = ['#0284c7', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#f43f5e'];

export const AnalyticsPage: React.FC = () => {
  const { data: analyticsData, isLoading } = useQuery<{ data: IAnalyticsResponse }>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const res = await api.get('/analytics/overview');
      return res.data;
    },
  });

  const data = analyticsData?.data;

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading comprehensive analytics...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Job Search Analytics & Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics computed directly from your pipeline history to optimize response rates.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Response Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {data.responseRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Recruiter replies received</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interview Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold text-purple-400">
            {data.interviewRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Converted to interview</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Offer Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-500">
            {data.offerRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Final offer conversion</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Avg. Turnaround
          </span>
          <div className="mt-2 text-2xl font-extrabold text-sky-500">
            {data.averageResponseDays}d
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Days to initial reply</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Applications by Channel</h3>
            <p className="text-xs text-slate-400">Where you generate the highest outreach volume</p>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.bySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.bySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Salary Range Distribution</h3>
            <p className="text-xs text-slate-400">Compensation brackets across active roles</p>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bySalary}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
