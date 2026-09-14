import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number, currency = 'USD'): string {
  if (!min && !max) return 'Not disclosed';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  if (min && max) {
    return `${symbol}${(min / 1000).toFixed(0)}k - ${symbol}${(max / 1000).toFixed(0)}k`;
  }
  if (min) return `From ${symbol}${(min / 1000).toFixed(0)}k`;
  if (max) return `Up to ${symbol}${(max / 1000).toFixed(0)}k`;
  return 'Not disclosed';
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Applied':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Shortlisted':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'Interview':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'Offer':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Withdrawn':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
}
