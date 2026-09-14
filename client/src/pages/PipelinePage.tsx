import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../api/client';
import {
  Plus,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { IApplication, ApplicationStatus } from '../types';
import { formatSalary } from '../utils';

const STAGES: { key: ApplicationStatus; label: string; dotColor: string }[] = [
  { key: 'Applied', label: 'Applied', dotColor: 'bg-blue-500' },
  { key: 'Shortlisted', label: 'Shortlisted', dotColor: 'bg-cyan-500' },
  { key: 'Interview', label: 'Interview', dotColor: 'bg-purple-500' },
  { key: 'Offer', label: 'Offer', dotColor: 'bg-emerald-500' },
  { key: 'Rejected', label: 'Rejected', dotColor: 'bg-rose-500' },
];

export const PipelinePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openAddModal } = useOutletContext<{ openAddModal: () => void }>();

  const { data, isLoading } = useQuery<{ data: IApplication[] }>({
    queryKey: ['applications', 'pipeline'],
    queryFn: async () => {
      const res = await api.get('/applications', { params: { limit: 100 } });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      await api.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      updateStatusMutation.mutate({ id, status: targetStatus });
    }
  };

  const applications = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kanban Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop cards across stages to seamlessly transition application statuses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-500/20 transition active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {STAGES.map((stage) => {
          const stageApps = applications.filter((app) => app.status === stage.key);

          return (
            <div
              key={stage.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
              className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {stage.label}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageApps.map((app) => (
                  <div
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app._id)}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-sky-500/40 transition group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/app/applications/${app._id}`}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-sky-500 transition line-clamp-1"
                      >
                        {app.company}
                      </Link>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {app.role}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {app.location || 'Remote'}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatSalary(app.salaryMin, app.salaryMax, app.currency)}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <Link
                        to={`/app/applications/${app._id}`}
                        className="text-sky-500 hover:text-sky-400 font-medium flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-center p-3 text-[11px] text-slate-400">
                    Drop applications here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
