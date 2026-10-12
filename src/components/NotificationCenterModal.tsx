import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Trash2,
  Check,
  Plus,
  BookmarkCheck,
  Bookmark,
  Volume2,
  ExternalLink,
  Shield,
  Search,
  Sparkles,
} from 'lucide-react';
import { useNotifications, IssueNotification } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';
import { IssueStatus } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIssue: (ref: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenIssue,
}) => {
  const {
    notifications,
    unreadCount,
    followedRefs,
    followIssue,
    unfollowIssue,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    browserPermission,
    requestBrowserPermission,
    triggerTestNotification,
  } = useNotifications();

  const { issues } = useApp();

  const [activeTab, setActiveTab] = useState<'alerts' | 'followed'>('alerts');
  const [newRefInput, setNewRefInput] = useState('');
  const [followError, setFollowError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFollow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefInput.trim()) return;

    let clean = newRefInput.trim().toUpperCase();
    if (!clean.startsWith('CPM-') && !isNaN(Number(clean))) {
      clean = `CPM-${clean}`;
    }

    const exists = issues.find((i) => i.reference_number.toUpperCase() === clean);
    if (!exists) {
      setFollowError(`Reference "${clean}" was not found among registered issues. Please verify the code.`);
      return;
    }

    followIssue(clean, exists.status);
    setNewRefInput('');
    setFollowError(null);
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Reported':
        return {
          bg: 'bg-blue-950/80 text-blue-300 border-blue-800',
          icon: Clock,
          label: 'Reported',
        };
      case 'Under Investigation':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800',
          icon: AlertCircle,
          label: 'Under Investigation',
        };
      case 'Dispatched':
        return {
          bg: 'bg-purple-950/80 text-purple-300 border-purple-800',
          icon: Truck,
          label: 'Dispatched to Depot',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
          icon: CheckCircle2,
          label: 'Resolved & Verified',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow flex items-center justify-center text-slate-950 font-black">
              <Bell className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Issue Tracker Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-sm">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Instant alerts when municipal dispatchers or task teams update your tracked reports
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Notification Banner */}
        <div className="px-6 py-2.5 bg-[#0a1832] border-b border-blue-900/40 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Audio & In-App Toast: <strong>Active</strong></span>
            <span className="text-slate-500">|</span>
            <span>
              Desktop Alert: {browserPermission === 'granted' ? (
                <span className="text-emerald-400 font-semibold">Enabled</span>
              ) : browserPermission === 'denied' ? (
                <span className="text-rose-400 font-semibold">Blocked in browser</span>
              ) : (
                <span className="text-amber-300 font-semibold">Not Enabled</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {browserPermission !== 'granted' && (
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow"
              >
                Enable Desktop Alerts
              </button>
            )}

            <button
              type="button"
              onClick={triggerTestNotification}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] transition"
              title="Test notification alert and chime"
            >
              <Sparkles className="w-3 h-3" />
              <span>Test Alert</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'alerts'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Recent Updates ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('followed')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'followed'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              My Tracked Issues ({followedRefs.length})
            </button>
          </div>

          {activeTab === 'alerts' && notifications.length > 0 && (
            <div className="flex items-center gap-2 pb-2">
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                Mark all read
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={clearNotifications}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'alerts' && (
            <>
              {notifications.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">
                    No status update alerts yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Whenever you log a report or track an issue code, you will receive real-time notifications here as soon as municipal teams review, dispatch, or resolve it.
                  </p>
                  <button
                    type="button"
                    onClick={triggerTestNotification}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send A Test Alert</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => {
                    const badge = getStatusBadge(notif.new_status);
                    const StatusIcon = badge.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 rounded-xl border transition-all relative ${
                          notif.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                            : 'bg-slate-950/90 border-amber-500/50 text-white shadow-md shadow-amber-950/20'
                        }`}
                      >
                        {!notif.read && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                              {notif.reference_number}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {notif.suburb}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>

                        <h5 className="font-bold text-xs sm:text-sm text-white mt-2 leading-snug">
                          {notif.issue_title}
                        </h5>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {notif.old_status && (
                            <span className="text-slate-400 text-xs line-through">
                              {notif.old_status}
                            </span>
                          )}
                          {notif.old_status && (
                            <span className="text-slate-400 text-xs">→</span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {notif.note && (
                          <p className="mt-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                            "{notif.note}"
                          </p>
                        )}

                        <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onOpenIssue(notif.reference_number);
                            }}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open Tracker Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'followed' && (
            <div className="space-y-4">
              {/* Follow a new issue form */}
              <form
                onSubmit={handleAddFollow}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
              >
                <label className="block text-xs font-bold text-slate-300">
                  Follow an Issue by Reference Code:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. CPM-8491, CPM-8492"
                      value={newRefInput}
                      onChange={(e) => {
                        setNewRefInput(e.target.value);
                        setFollowError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </button>
                </div>
                {followError && (
                  <p className="text-xs text-rose-400">{followError}</p>
                )}
              </form>

              {/* List of followed issues */}
              {followedRefs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  You are not currently following any issues. Use the input above or click the bell icon on any issue in the tracker.
                </div>
              ) : (
                <div className="space-y-2">
                  {followedRefs.map((ref) => {
                    const issue = issues.find((i) => i.reference_number.toUpperCase() === ref.toUpperCase());
                    const badge = issue ? getStatusBadge(issue.status) : null;
                    const StatusIcon = badge ? badge.icon : Clock;

                    return (
                      <div
                        key={ref}
                        className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">
                              {ref}
                            </span>
                            {badge && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                              >
                                <StatusIcon className="w-2.5 h-2.5" />
                                <span>{badge.label}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-white font-medium truncate">
                            {issue ? issue.title : 'Registered municipal report'}
                          </p>
                          {issue && (
                            <p className="text-slate-400 text-[11px] truncate">
                              {issue.location}, {issue.suburb}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenIssue(ref);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => unfollowIssue(ref)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Unfollow updates for this issue"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Local alert storage enabled across browser sessions</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
