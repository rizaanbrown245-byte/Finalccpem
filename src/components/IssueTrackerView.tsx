import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Filter,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityIssue, IssueCategory, IssueStatus } from '../types';

interface IssueTrackerViewProps {
  onOpenReportModal: () => void;
  onOpenIssueDetails: (ref: string) => void;
}

export const IssueTrackerView: React.FC<IssueTrackerViewProps> = ({
  onOpenReportModal,
  onOpenIssueDetails,
}) => {
  const { issues } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [suburbFilter, setSuburbFilter] = useState<string>('all');

  // Unique suburbs present in issues
  const availableSuburbs = Array.from(new Set(issues.map((i) => i.suburb)));

  const filteredIssues = issues.filter((issue) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      issue.reference_number.toLowerCase().includes(term) ||
      issue.title.toLowerCase().includes(term) ||
      issue.location.toLowerCase().includes(term) ||
      issue.suburb.toLowerCase().includes(term) ||
      issue.description.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSuburb = suburbFilter === 'all' || issue.suburb === suburbFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSuburb;
  });

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Reported':
        return {
          bg: 'bg-blue-950 text-blue-300 border-blue-800',
          icon: Clock,
          label: 'Reported',
        };
      case 'Under Investigation':
        return {
          bg: 'bg-amber-950 text-amber-300 border-amber-800',
          icon: AlertCircle,
          label: 'Under Investigation',
        };
      case 'Dispatched':
        return {
          bg: 'bg-purple-950 text-purple-300 border-purple-800',
          icon: Truck,
          label: 'Dispatched to Depot',
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1832] to-slate-900 border border-blue-900/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-black/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-bold border border-blue-500/40">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Nelson Mandela Bay Civic Oversight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Municipal Issue Escalation Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every water leak, pothole, sewerage overflow, and streetlight logged by residents is assigned a public tracking reference number and escalated directly to municipal infrastructure directors.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenReportModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center gap-2 transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Municipal Issue</span>
        </button>
      </div>

      {/* Search & Multi-Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reference code (e.g. CPM-8491), street name, or problem description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1 text-[11px]">
              Status Filter:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="all">All Statuses ({issues.length})</option>
              <option value="Reported">Reported</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Dispatched">Dispatched to Depot</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1 text-[11px]">
              Category Filter:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="all">All Problem Types</option>
              <option value="pothole">Potholes & Roads</option>
              <option value="water-leak">Water Leaks & Bursts</option>
              <option value="sewer-burst">Sewer Overflow</option>
              <option value="electricity-outage">Electricity / Cables</option>
              <option value="illegal-dumping">Illegal Dumping</option>
              <option value="streetlights">Streetlights</option>
              <option value="crime-hotspot">Crime Hotspots</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1 text-[11px]">
              Suburb / Area:
            </label>
            <select
              value={suburbFilter}
              onChange={(e) => setSuburbFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="all">All Metro Areas</option>
              {availableSuburbs.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <span>Found {filteredIssues.length} issues</span>
          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || suburbFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setSuburbFilter('all');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Issues Found Matching Filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or log a new issue using the button below.
            </p>
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs"
            >
              Report New Issue
            </button>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const badge = getStatusBadge(issue.status);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={issue.id}
                onClick={() => onOpenIssueDetails(issue.reference_number)}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 sm:p-6 transition cursor-pointer space-y-3 group"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded text-xs">
                        {issue.reference_number}
                      </span>
                      <span className="text-xs uppercase font-semibold text-slate-400">
                        {issue.category.replace('-', ' ')}
                      </span>
                      {issue.ward && (
                        <span className="text-xs text-slate-400">• {issue.ward}</span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          issue.urgency === 'Critical'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : issue.urgency === 'High'
                            ? 'bg-amber-600/30 text-amber-300 border border-amber-600/50'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {issue.urgency} Urgency
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                      {issue.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                  {issue.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {issue.location}, <strong className="text-slate-300">{issue.suburb}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <span className="text-blue-400 font-bold text-xs flex items-center gap-1 group-hover:underline">
                    <span>View Timeline ({issue.timeline.length} updates)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
