import React from 'react';
import {
  Bell,
  X,
  ArrowRight,
  Clock,
  AlertCircle,
  Truck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useNotifications, IssueNotification } from '../context/NotificationContext';
import { IssueStatus } from '../types';

interface NotificationToastProps {
  onOpenIssue: (ref: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onOpenIssue }) => {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Reported':
        return {
          bg: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
          icon: Clock,
          label: 'Reported',
        };
      case 'Under Investigation':
        return {
          bg: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
          icon: AlertCircle,
          label: 'Under Investigation',
        };
      case 'Dispatched':
        return {
          bg: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
          icon: Truck,
          label: 'Dispatched to Depot',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50',
          icon: CheckCircle2,
          label: 'Resolved & Verified',
        };
    }
  };

  const badge = getStatusBadge(activeToast.new_status);
  const StatusIcon = badge.icon;

  return (
    <aside
      aria-label="Issue status update notification"
      className="fixed bottom-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto"
    >
      <div className="relative bg-gradient-to-br from-slate-900 via-[#0a1832] to-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100 p-4">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top line with Bell and Ref */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  {activeToast.reference_number}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Tracked Ticket Update
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Issue Title & Status Change */}
        <div className="mt-2.5 space-y-1.5">
          <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1 leading-snug">
            {activeToast.issue_title}
          </h4>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {activeToast.old_status && (
              <>
                <span className="text-slate-400 line-through">
                  {activeToast.old_status}
                </span>
                <span className="text-slate-400">→</span>
              </>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${badge.bg}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              • {activeToast.suburb}
            </span>
          </div>

          {activeToast.note && (
            <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed line-clamp-2">
              "{activeToast.note}"
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            {activeToast.timestamp}
          </span>

          <button
            type="button"
            onClick={() => {
              const ref = activeToast.reference_number;
              dismissToast();
              onOpenIssue(ref);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/40 transition group"
          >
            <span>View Resolution Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};
