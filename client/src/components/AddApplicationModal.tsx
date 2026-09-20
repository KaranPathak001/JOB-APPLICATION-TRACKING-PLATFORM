import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { X, Sparkles, Loader2, Building, Briefcase, Link as LinkIcon } from 'lucide-react';
import { WorkMode, ApplicationStatus } from '../types';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  jobUrl?: string;
  source: string;
  notes?: string;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [jobDescription, setJobDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'ai'>('form');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      status: 'Applied',
      workMode: 'Remote',
      currency: 'USD',
      source: 'LinkedIn',
      location: 'Remote',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/applications', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onClose();
    },
  });

  const handleAIExtract = async () => {
    if (!jobDescription.trim()) {
      setExtractError('Please paste a job description first.');
      return;
    }
    setIsExtracting(true);
    setExtractError('');

    try {
      const res = await api.post('/ai/parse-job', { jobDescription });
      const data = res.data?.data;
      if (data) {
        if (data.company) setValue('company', data.company);
        if (data.role) setValue('role', data.role);
        if (data.location) setValue('location', data.location);
        if (data.workMode) setValue('workMode', data.workMode);
        if (data.salaryMin) setValue('salaryMin', data.salaryMin);
        if (data.salaryMax) setValue('salaryMax', data.salaryMax);
        if (data.jobUrl) setValue('jobUrl', data.jobUrl);
        if (data.summary) setValue('notes', `Key Responsibilities: ${data.summary}\nRequired Skills: ${data.skills?.join(', ')}`);
        setActiveTab('form');
      }
    } catch (err: any) {
      setExtractError(err.response?.data?.message || 'Failed to parse job description. Please fill manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Job Application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'form'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'ai'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI Auto-Fill</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300">
                ✨ <strong>Paste a job description from LinkedIn, Indeed, or company careers page.</strong> AI will automatically extract the company, role, salary range, location, and key skills.
              </div>
              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting text here..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100"
              />
              {extractError && <p className="text-xs text-rose-500">{extractError}</p>}
              <button
                type="button"
                onClick={handleAIExtract}
                disabled={isExtracting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract & Auto-Fill Form</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'form' && (
            <form id="add-app-form" onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      {...register('company', { required: 'Company is required' })}
                      placeholder="e.g. Stripe"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Role / Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      {...register('role', { required: 'Role is required' })}
                      placeholder="e.g. Senior Frontend Architect"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  {errors.role && <p className="text-[11px] text-rose-500 mt-1">{errors.role.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Mode
                  </label>
                  <select
                    {...register('workMode')}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    placeholder="e.g. San Francisco / Remote"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Salary Range (Min - Max)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      {...register('salaryMin', { valueAsNumber: true })}
                      placeholder="Min ($120k)"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      {...register('salaryMax', { valueAsNumber: true })}
                      placeholder="Max ($180k)"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Posting URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      {...register('jobUrl')}
                      placeholder="https://..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Preparation Strategy
                </label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  placeholder="Key interview notes, referral details, or tech stack requirements..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900 dark:text-slate-100"
                />
              </div>

              {createMutation.isError && (
                <p className="text-xs text-rose-500">
                  {(createMutation.error as any)?.response?.data?.message || 'Failed to save application.'}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'form' && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-app-form"
              disabled={createMutation.isPending}
              className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-500/20 transition flex items-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Application</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
