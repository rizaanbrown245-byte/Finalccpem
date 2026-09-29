import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Phone,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityIssue, IssueStatus } from '../types';

interface IssueTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRef?: string | null;
}

export const IssueTrackerModal: React.FC<IssueTrackerModalProps> = ({
  isOpen,
  onClose,
  initialRef,
}) => {
  const { issues, getIssueByRef } = useApp();
  const [searchRef, setSearchRef] = useState(initialRef || '');
  const [selectedIssue, setSelectedIssue] = useState<CommunityIssue | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef) {
      setSearchRef(initialRef);
      const found = getIssueByRef(initialRef);
      if (found) {
        setSelectedIssue(found);
        setSearchError(null);
      }
    } else if (issues.length > 0 && !selectedIssue) {
      // Default to first active issue for quick browsing
      setSelectedIssue(issues[0]);
    }
  }, [initialRef, issues]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    const found = getIssueByRef(searchRef.trim());
    if (found) {
      setSelectedIssue(found);
      setSearchError(null);
    } else {
      setSearchError(`No issue found matching reference "${searchRef.trim()}". Please check your number (e.g. CPM-8491).`);
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Reported':
        return {
          bg: 'bg-blue-950 text-blue-300 border-blue-800',
          icon: Clock,
          label: 'Reported (Under Review)',
        };
      case 'Under Investigation':
        return {
          bg: 'bg-amber-950 text-amber-300 border-amber-800',
          icon: AlertCircle,
          label: 'Under Active Investigation',
        };
      case 'Dispatched':
        return {
          bg: 'bg-purple-950 text-purple-300 border-purple-800',
          icon: Truck,
          label: 'Dispatched to Municipal Depot',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          icon: CheckCircle2,
          label: 'Resolved & Verified',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Live Municipal Issue Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Look up real-time progress, municipal referrals, and resolution timeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Reference Number (e.g. CPM-8491, CPM-8492)"
                value={searchRef}
                onChange={(e) => {
                  setSearchRef(e.target.value);
                  setSearchError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition"
            >
              Search
            </button>
          </form>

          {searchError && (
            <div className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick reference tags */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
            <span className="shrink-0 font-medium">Recent Reports:</span>
            {issues.slice(0, 4).map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  setSearchRef(i.reference_number);
                  setSelectedIssue(i);
                  setSearchError(null);
                }}
                className={`px-2 py-0.5 rounded border transition font-mono ${
                  selectedIssue?.id === i.id
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {i.reference_number} ({i.suburb})
              </button>
            ))}
          </div>
        </div>

        {/* Issue Details View */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs">
          {selectedIssue ? (
            <>
              {/* Header Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                        REF: {selectedIssue.reference_number}
                      </span>
                      <span className="text-slate-400 text-[11px] capitalize">
                        {selectedIssue.category.replace('-', ' ')}
                      </span>
                      {selectedIssue.ward && (
                        <span className="text-slate-400 text-[11px]">• {selectedIssue.ward}</span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white mt-1 leading-snug">
                      {selectedIssue.title}
                    </h4>
                  </div>

                  {(() => {
                    const badge = getStatusBadge(selectedIssue.status);
                    const Icon = badge.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badge.bg}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>
                      {selectedIssue.location}, {selectedIssue.suburb}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Logged: {new Date(selectedIssue.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reported by: {selectedIssue.reporter_name}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed pt-1">
                  {selectedIssue.description}
                </p>

                {selectedIssue.images.length > 0 && (
                  <div className="pt-2">
                    <img
                      src={selectedIssue.images[0]}
                      alt="Evidence"
                      className="w-full h-48 object-cover rounded-lg border border-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Assigned Municipal Team */}
              {selectedIssue.assigned_team && (
                <div className="bg-blue-950/30 border border-blue-900/60 rounded-xl p-3 flex items-center justify-between text-xs text-blue-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">Assigned Municipal Depot: </span>
                      <span>{selectedIssue.assigned_team}</span>
                    </div>
                  </div>
                  {selectedIssue.admin_notes && (
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {selectedIssue.admin_notes}
                    </span>
                  )}
                </div>
              )}

              {/* Progress Timeline */}
              <div className="space-y-3">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Escalation & Resolution Timeline</span>
                </h5>

                <div className="relative border-l-2 border-slate-800 ml-4 pl-4 space-y-4">
                  {selectedIssue.timeline.map((event, idx) => {
                    const badge = getStatusBadge(event.status);
                    const Icon = badge.icon;
                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline dot */}
                        <div
                          className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
                            event.status === 'Resolved'
                              ? 'border-emerald-500 text-emerald-400'
                              : 'border-red-500 text-red-400'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{event.status}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{event.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p>Enter a tracking reference number above to view real-time status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
