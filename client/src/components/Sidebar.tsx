import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Calendar,
  BarChart3,
  Activity,
  Mail,
  Bot,
  User,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  PlusCircle,
  X,
} from 'lucide-react';
import { cn } from '../utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<{ onAddApplication: () => void; isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }> = ({
  onAddApplication,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const overviewItems: NavItem[] = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Applications', path: '/app/applications', icon: Briefcase },
    { label: 'Pipeline', path: '/app/pipeline', icon: KanbanSquare },
    { label: 'Calendar', path: '/app/calendar', icon: Calendar },
  ];

  const insightItems: NavItem[] = [
    { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { label: 'Activity Feed', path: '/app/activity', icon: Activity },
  ];

  const automationItems: NavItem[] = [
    { label: 'Email Sync', path: '/app/automation', icon: Mail, badge: 'Live' },
    { label: 'AI Assistant', path: '/app/assistant', icon: Bot, badge: 'AI' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSection = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 group',
                isActive
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    isActive ? 'text-sky-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
            <NavLink to="/app/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  JobFlow<span className="text-sky-500">.ai</span>
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <button
              onClick={onAddApplication}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-sm transition-all shadow-sky-500/20 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {navSection('Overview', overviewItems)}
            {navSection('Insights', insightItems)}
            {navSection('AI & Automation', automationItems)}
            {navSection('Account', [{ label: 'Profile & Settings', path: '/app/profile', icon: User }])}
          </div>

          {/* User Profile Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                    {user?.name || 'Candidate'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  title="Toggle theme"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
