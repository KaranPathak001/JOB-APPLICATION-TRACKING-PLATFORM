import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  Activity,
  Briefcase,
  Calendar,
  Mail,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { IApplicationEvent } from '../types';

export const ActivityPage: React.FC = () => {
  const [filterType, setFilterType] = useState('ALL');

  const { data, isLoading } = useQuery<{ data: (IApplicationEvent & { company?: string; role?: string })[] }>({
    queryKey: ['activity_feed', filterType],
    queryFn: async () => {
      const res = await api.get('/analytics/activity', { params: { type: filterType } });
      return res.data;
    },
  });

  const activities = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Activity Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unified chronological audit trail of all applications, interview scheduling, and AI extractions.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex-wrap">
          {['ALL', 'Applications', 'Interviews', 'Emails', 'AI'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterType === type
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {activities.map((act) => (
          <div
            key={act._id}
            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4 transition hover:border-sky-500/30"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 mt-0.5">
                {act.source === 'GMAIL' ? (
                  <Mail className="w-4 h-4" />
                ) : act.source === 'GEMINI_AI' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
                    {act.type.replace(/_/g, ' ')}
                  </span>
                  {act.company && (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      • {act.company} {act.role ? `(${act.role})` : ''}
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                    {act.source}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {act.description}
                </p>
                <p className="text-[10px] text-slate-400">
                  {new Date(act.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {act.applicationId && (
              <Link
                to={`/app/applications/${act.applicationId}`}
                className="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No activity events recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
