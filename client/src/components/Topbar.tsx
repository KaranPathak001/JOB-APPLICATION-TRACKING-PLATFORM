import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';

export const Topbar: React.FC<{
  onOpenMobileNav: () => void;
  onAddApplication: () => void;
}> = ({ onOpenMobileNav, onAddApplication }) => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path.startsWith('/app/dashboard')) return 'Dashboard';
    if (path.startsWith('/app/applications')) return 'Applications';
    if (path.startsWith('/app/pipeline')) return 'Pipeline';
    if (path.startsWith('/app/calendar')) return 'Calendar';
    if (path.startsWith('/app/analytics')) return 'Analytics';
    if (path.startsWith('/app/activity')) return 'Activity Feed';
    if (path.startsWith('/app/automation')) return 'Email Sync & Automation';
    if (path.startsWith('/app/assistant')) return 'AI Job Search Assistant';
    if (path.startsWith('/app/profile')) return 'Profile & Preferences';
    return 'JobFlow AI';
  };

  return (
    <header className="h-16 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sync Active</span>
        </div>

        <button
          onClick={onAddApplication}
          className="sm:hidden p-2 rounded-lg bg-sky-600 text-white shadow-sm"
          title="Add Application"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
