import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  HeartHandshake,
  Droplets,
  Users,
  Search,
  PlusCircle,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  MapPin,
  Calendar,
  Award,
  Quote,
  ExternalLink,
  Download,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FacebookImporterModal } from './FacebookImporterModal';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenTrackerModal: () => void;
  onTrackIssue: (ref: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenReportModal,
  onOpenTrackerModal,
  onTrackIssue,
}) => {
  const { stats, safetyNotices, communityWork, issues, settings, leadership, posts } = useApp();
  const [isFbModalOpen, setIsFbModalOpen] = useState(false);

  // High alert notice for ticker banner
  const urgentNotice = safetyNotices.find((n) => n.alert_level === 'High Alert') || safetyNotices[0];

  return (
    <div className="space-y-12">
      {/* Top Urgent Alert Banner if high alert exists */}
      {urgentNotice && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0d1c38] to-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-xl shadow-black/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-950/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono shadow-sm">
                    {urgentNotice.alert_level}
                  </span>
                  <span className="text-xs font-semibold text-amber-300">
                    {urgentNotice.area}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug mt-0.5">
                  {urgentNotice.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('safety')}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-blue-200 text-xs font-bold border border-blue-500/40 transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Read Full Notice</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c162c] via-[#070d18] to-black border border-blue-950/80 p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Nelson Mandela Bay Community Civil Action</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Standing in the Gap for the Citizens of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">
                PE Metro
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              The <span className="font-bold text-white">{settings.task_team_title}</span> is a grassroots civic organisation delivering real relief, water distributions, soup kitchens, crime patrol coordination, and direct service delivery accountability across Port Elizabeth, Kariega, and Despatch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-950/60 transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Municipal Issue</span>
              </button>

              <button
                type="button"
                onClick={onOpenTrackerModal}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition"
              >
                <Search className="w-4 h-4 text-blue-400" />
                <span>Track Existing Report</span>
              </button>

              <a
                href={`tel:${settings.emergency_hotline}`}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-amber-300 font-semibold text-sm border border-amber-500/30 transition"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>24/7 Hotline</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Volunteer Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Non-Partisan Civilian Action</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Registered Non-Profit NPC</span>
              </div>
            </div>
          </div>

          {/* Official Emblem Banner Showcase */}
          <div className="shrink-0 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/80 border border-blue-950/80 shadow-2xl backdrop-blur-sm max-w-xs w-full">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl shadow-blue-950/60 bg-white flex items-center justify-center p-2 group ring-2 ring-blue-500/40">
              <img
                src={settings.logo_url || '/logo.jpg'}
                alt="Concerned Citizens of PE Metro Official Emblem"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <h3 className="mt-4 font-black text-sm text-white tracking-wider uppercase">
              {settings.org_name}
            </h3>
            <p className="text-xs text-amber-400 font-semibold mt-0.5 italic">
              "{settings.motto}"
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 w-full flex flex-col gap-1 text-[11px] text-slate-400">
              <span className="font-mono text-slate-300 font-semibold">
                {settings.npo_number || 'NPO Registered NPC'}
              </span>
              <span className="text-[10px] text-slate-400">
                Nelson Mandela Bay Metropolitan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Impact Counters */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
            {stats.issues_resolved.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-300">Issues Resolved</div>
          <div className="text-[10px] text-slate-400">Potholes, water & sewage</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {stats.families_fed.toLocaleString()}+
          </div>
          <div className="text-xs font-semibold text-slate-300">Meals & Families Fed</div>
          <div className="text-[10px] text-slate-400">Through soup kitchens</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {(stats.water_litres_distributed / 1000).toFixed(0)}k L
          </div>
          <div className="text-xs font-semibold text-slate-300">Water Distributed</div>
          <div className="text-[10px] text-slate-400">Emergency drought tankers</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
            {stats.active_patrols}
          </div>
          <div className="text-xs font-semibold text-slate-300">Active Night Patrols</div>
          <div className="text-[10px] text-slate-400">Coordinated with SAPS</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {stats.cleanups_conducted}
          </div>
          <div className="text-xs font-semibold text-slate-300">Dumping Sites Cleared</div>
          <div className="text-[10px] text-slate-400">Converted into gardens</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">
            {stats.community_volunteers}
          </div>
          <div className="text-xs font-semibold text-slate-300">Active Volunteers</div>
          <div className="text-[10px] text-slate-400">Across 60 Metro Wards</div>
        </div>
      </section>

      {/* Quick Action Navigation Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Report & Track Issues */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Report & Track Municipal Issues</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report burst pipes, potholes, blocked sewers, electricity cable theft, or broken streetlights. Every report receives an official tracking reference code.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition text-center shadow"
            >
              Report New Issue Now
            </button>
            <button
              type="button"
              onClick={onOpenTrackerModal}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition text-center border border-slate-700"
            >
              Check Status of My Issue
            </button>
          </div>
        </div>

        {/* Card 2: Crime & Safety Hotlines */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Crime Alerts & Safety Patrols</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay alerted to active crime hotspots, syndicate bakkie reports, cable theft warnings, and join your local ward civilian patrol team.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onSelectTab('safety')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition text-center shadow"
            >
              View Crime Notices & Patrols
            </button>
            <a
              href={`tel:${settings.emergency_hotline}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition text-center border border-slate-700"
            >
              Call Task Team Rapid Desk
            </a>
          </div>
        </div>

        {/* Card 3: Community Work & Soup Kitchens */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Community Relief & Soup Kitchens</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Giving hope to those who don't have: weekend soup kitchens, school shoe distributions, and community borehole water relief.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onSelectTab('community-work')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center shadow"
            >
              Explore Community Projects
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('supporters')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs transition text-center border border-slate-700"
            >
              Donate Food / Support Relief
            </button>
          </div>
        </div>
      </section>

      {/* Founder & Movement Leadership Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Civil Movement Leadership</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Meet the Founder & Task Team Leadership
            </h2>
            <p className="text-xs text-slate-400">
              Grassroots community servants standing together for every forgotten family in Nelson Mandela Bay
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('members')}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/40 px-3.5 py-2 rounded-xl transition"
          >
            <span>View Full Directory & Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Founder Feature Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="shrink-0 relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500 shadow-xl shadow-amber-950/60">
              <img
                src={settings.founder_image || settings.logo_url || '/logo.jpg'}
                alt={settings.founder_name || 'Founder'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-1 text-center">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">
                  Founder
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400">
                  {settings.founder_title || 'Founder & Chief Task Team Convener'}
                </span>
                <h3 className="text-2xl font-black text-white">
                  {settings.founder_name || 'Rizaan Brown'}
                </h3>
              </div>

              <div className="relative bg-slate-950/80 border-l-4 border-amber-500 rounded-xl p-3.5 text-xs text-slate-200 italic">
                <p>
                  "{settings.founder_quote || settings.motto || "Giving Hope To Those Who Don't Have"}"
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {settings.founder_bio ||
                  'Grassroots civil activist who established the Concerned Citizens of PE Metro to give a strong, unified voice to the forgotten residents of Nelson Mandela Bay.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => onSelectTab('members')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950 transition flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View All {leadership.length} Officers & Members</span>
                </button>
                {settings.founder_email && (
                  <a
                    href={`mailto:${settings.founder_email}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  >
                    Direct Email: {settings.founder_email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Issues Logged by Citizens */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recent Issues Logged in Nelson Mandela Bay
            </h2>
            <p className="text-xs text-slate-400">
              Real citizen reports tracked by the Concerned Citizens Task Team
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTrackerModal}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Search All Issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.slice(0, 3).map((issue) => (
            <div
              key={issue.id}
              onClick={() => onTrackIssue(issue.reference_number)}
              className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 space-y-3 cursor-pointer transition transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                  {issue.reference_number}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    issue.status === 'Resolved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : issue.status === 'Dispatched'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {issue.status}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                {issue.title}
              </h4>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="line-clamp-1">{issue.location}, {issue.suburb}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                <span className="text-blue-400 font-semibold group-hover:underline">
                  Click to track →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Work Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Community Relief in Action
            </h2>
            <p className="text-xs text-slate-400">
              Recent humanitarian outreach projects across Gqeberha and Kariega
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('community-work')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityWork.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-emerald-500/40 transition"
            >
              {item.images.length > 0 && (
                <div className="sm:w-2/5 h-48 sm:h-auto shrink-0 relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 border border-white/20">
                    {item.impact_stat}
                  </div>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {item.category.replace('-', ' ')}
                  </span>
                  <h4 className="font-bold text-white text-base leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <span>{item.volunteers_count} Volunteers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Facebook Community Channel & Live Sync Section */}
      <section className="bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-900 text-blue-200 px-3 py-1 rounded-full border border-blue-500/40">
                Official Social Media Channel
              </span>
              <span className="text-xs text-blue-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Live Feed Integrated
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Connect with Concerned Citizens on Facebook
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stay connected with daily neighborhood updates, photos from food hamper drives, and emergency alerts directly from our active Facebook community page. Have existing posts on Facebook? Use our 1-click importer to sync them straight onto this portal!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsFbModalOpen(true)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-950/60 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Import Posts from Facebook</span>
            </button>

            <a
              href={settings.facebook_url || 'https://facebook.com/ConcernedCitizensPEMetro'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <span>Visit Facebook Page</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => onSelectTab('updates')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Live Community Wall ({posts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Facebook Importer Modal */}
      <FacebookImporterModal
        isOpen={isFbModalOpen}
        onClose={() => setIsFbModalOpen(false)}
      />
    </div>
  );
};
