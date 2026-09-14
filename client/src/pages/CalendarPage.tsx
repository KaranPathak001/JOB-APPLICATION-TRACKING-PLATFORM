import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { IInterview, ITask } from '../types';

export const CalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('agenda');

  const { data: interviewsData, isLoading: isInvLoading } = useQuery<{ data: IInterview[] }>({
    queryKey: ['interviews'],
    queryFn: async () => {
      const res = await api.get('/interviews');
      return res.data;
    },
  });

  const { data: tasksData } = useQuery<{ data: ITask[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  const interviews = interviewsData?.data || [];
  const tasks = tasksData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview & Activity Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Coordinate interview schedules, preparation deadlines, and recruiter follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'agenda'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Agenda View
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'month'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Month View
          </button>
        </div>
      </div>

      {/* Agenda Timeline List */}
      {viewMode === 'agenda' ? (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Scheduled Interviews
            </h3>

            <div className="space-y-3">
              {interviews.map((inv) => (
                <div
                  key={inv._id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {inv.company}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
                        {inv.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {inv.role}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(inv.scheduledAt).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(inv.scheduledAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {inv.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                        "{inv.notes}"
                      </p>
                    )}
                  </div>

                  {inv.meetingUrl ? (
                    <a
                      href={inv.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition self-start md:self-auto"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No meeting URL provided</span>
                  )}
                </div>
              ))}

              {interviews.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No upcoming interviews. Schedule one from any application detail page.
                </p>
              )}
            </div>
          </div>

          {/* Action Item Deadlines */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pending Action Items & Preparation
            </h3>
            <div className="space-y-2">
              {tasks.filter((t) => !t.completed).map((task) => (
                <div
                  key={task._id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {task.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : 'No deadline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Month Grid Preview */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="grid grid-cols-7 gap-2 pt-3">
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const hasInterview = [15, 18, 22].includes(day);
              return (
                <div
                  key={idx}
                  className={`min-h-[85px] p-2 rounded-xl border transition ${
                    hasInterview
                      ? 'border-purple-500/40 bg-purple-500/5 dark:bg-purple-500/10'
                      : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {day}
                  </span>
                  {hasInterview && (
                    <div className="mt-1 p-1 rounded bg-purple-600 text-white text-[9px] font-semibold truncate">
                      Tech Screen
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
