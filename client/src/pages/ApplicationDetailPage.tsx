import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Circle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { IApplication, IApplicationEvent, INote, ITask, ApplicationStatus } from '../types';
import { formatSalary, getStatusColor } from '../utils';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'timeline' | 'notes' | 'tasks'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newInterviewDate, setNewInterviewDate] = useState('');
  const [newInterviewType, setNewInterviewType] = useState('Technical');
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // 1. Fetch Application Detail
  const { data: appData, isLoading } = useQuery<{ data: IApplication }>({
    queryKey: ['application', id],
    queryFn: async () => {
      const res = await api.get(`/applications/${id}`);
      return res.data;
    },
  });

  // 2. Fetch Timeline Events
  const { data: eventsData } = useQuery<{ data: IApplicationEvent[] }>({
    queryKey: ['application_events', id],
    queryFn: async () => {
      const res = await api.get(`/applications/${id}/events`);
      return res.data;
    },
    enabled: !!id,
  });

  // 3. Fetch Notes
  const { data: notesData } = useQuery<{ data: INote[] }>({
    queryKey: ['application_notes', id],
    queryFn: async () => {
      const res = await api.get(`/applications/${id}/notes`);
      return res.data;
    },
    enabled: !!id,
  });

  // 4. Fetch Tasks
  const { data: tasksData } = useQuery<{ data: ITask[] }>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
    enabled: !!id,
  });

  const app = appData?.data;
  const events = eventsData?.data || [];
  const notes = notesData?.data || [];
  const appTasks = (tasksData?.data || []).filter((t) => t.applicationId === id);

  // Status Change Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: ApplicationStatus) => {
      await api.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['application_events', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Add Note Mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/applications/${id}/notes`, { content });
    },
    onSuccess: () => {
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['application_notes', id] });
      queryClient.invalidateQueries({ queryKey: ['application_events', id] });
    },
  });

  // Add Task Mutation
  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      await api.post('/tasks', { applicationId: id, title, priority: 'medium' });
    },
    onSuccess: () => {
      setNewTaskTitle('');
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });

  // Toggle Task Mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      await api.patch(`/tasks/${taskId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });

  // Schedule Interview Mutation
  const createInterviewMutation = useMutation({
    mutationFn: async () => {
      await api.post('/interviews', {
        applicationId: id,
        type: newInterviewType,
        scheduledAt: newInterviewDate,
      });
    },
    onSuccess: () => {
      setIsInterviewModalOpen(false);
      setNewInterviewDate('');
      queryClient.invalidateQueries({ queryKey: ['application_events', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Delete Application Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/applications/${id}`);
    },
    onSuccess: () => {
      navigate('/app/applications');
    },
  });

  if (isLoading || !app) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading opportunity details...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
        <button
          onClick={() => deleteMutation.mutate()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Application</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {app.company}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(
                app.status
              )}`}
            >
              {app.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{app.role}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {app.location || 'Remote'} ({app.workMode || 'Remote'})
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <DollarSign className="w-3.5 h-3.5" />
              {formatSalary(app.salaryMin, app.salaryMax, app.currency)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Applied {new Date(app.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Job Posting</span>
            </a>
          )}

          <button
            onClick={() => setIsInterviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </button>

          {/* Status Dropdown */}
          <select
            value={app.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value as ApplicationStatus)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
          >
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Visual Timeline</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes & Prep</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            {notes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Action Items</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            {appTasks.length}
          </span>
        </button>
      </div>

      {/* Tab: Visual Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
            {events.map((evt, idx) => (
              <div key={evt._id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-sky-500 border-4 border-white dark:border-slate-900" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
                      {evt.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                      {evt.source}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="text-xs text-slate-400">No events logged yet for this opportunity.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add interview notes, recruiter questions, system design thoughts..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
            />
            <div className="flex justify-end">
              <button
                onClick={() => newNote.trim() && addNoteMutation.mutate(newNote)}
                disabled={!newNote.trim() || addNoteMutation.isPending}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <p className="text-[10px] text-slate-400">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add next action (e.g. Follow up on Tuesday, review System Design)..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => newTaskTitle.trim() && addTaskMutation.mutate(newTaskTitle)}
              disabled={!newTaskTitle.trim() || addTaskMutation.isPending}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              Add Task
            </button>
          </div>

          <div className="space-y-2">
            {appTasks.map((task) => (
              <div
                key={task._id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      toggleTaskMutation.mutate({ taskId: task._id, completed: !task.completed })
                    }
                    className="text-slate-400 hover:text-sky-500 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  {task.priority || 'medium'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Interview Round</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interview Type
              </label>
              <select
                value={newInterviewType}
                onChange={(e) => setNewInterviewType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="Screening">Recruiter Screening</option>
                <option value="Technical">Technical Coding</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral / Leadership</option>
                <option value="Hiring Manager">Hiring Manager</option>
                <option value="Final Round">Final Round</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={newInterviewDate}
                onChange={(e) => setNewInterviewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => newInterviewDate && createInterviewMutation.mutate()}
                disabled={!newInterviewDate || createInterviewMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-sm disabled:opacity-50"
              >
                Schedule & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
