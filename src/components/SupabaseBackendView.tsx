import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  FileCode,
  ShieldCheck,
  Key,
  Layers,
  Table,
  Terminal,
  HelpCircle,
  Info,
  Server,
  Code2,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  testSupabaseConnection,
  seedLocalDataToSupabase,
  SupabaseStatus,
} from '../services/supabaseService';
import { useApp } from '../context/AppContext';

export const SupabaseBackendView: React.FC = () => {
  const {
    issues,
    posts,
    safetyNotices,
    communityWork,
    stats,
    leadership,
    supporters,
    gallery,
    settings,
  } = useApp();

  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    count: number;
    errorMsg?: string;
  } | null>(null);

  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tables' | 'sql' | 'guide'>('overview');
  const [expandedTable, setExpandedTable] = useState<string | null>('community_issues');

  useEffect(() => {
    runConnectionTest();
  }, []);

  const runConnectionTest = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setStatus(res);
    } catch {
      setStatus({
        isConfigured: false,
        isConnected: false,
        message: 'Unable to communicate with Supabase service.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await seedLocalDataToSupabase({
        issues,
        posts,
        safetyNotices,
        communityWork,
        stats,
        leadership,
        supporters,
        gallery,
        settings,
      });
      setSyncResult({
        success: res.success,
        count: res.syncedCount,
        errorMsg: res.errors.length > 0 ? res.errors[0] : undefined,
      });
      runConnectionTest();
    } catch (e: any) {
      setSyncResult({
        success: false,
        count: 0,
        errorMsg: e.message || 'Sync failed',
      });
    } finally {
      setSyncing(false);
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const copySqlSchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const tableDefinitions = [
    {
      name: 'community_issues',
      label: 'Municipal Issues Tracker',
      description: 'Logged citizen reports for potholes, water leaks, sewer bursts, streetlights, and power outages with GPS locations, photos, status, and municipal depots.',
      localCount: issues.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'reference_number (TEXT, e.g. CPM-8492)',
      columns: ['reference_number', 'title', 'category', 'location', 'suburb', 'ward', 'urgency', 'status', 'reporter_name', 'reporter_contact', 'images', 'admin_notes', 'assigned_team', 'timeline', 'created_at'],
    },
    {
      name: 'crime_safety_notices',
      label: 'Crime & Safety Bulletins',
      description: 'Emergency security advisories, hijacking and theft hotspots, neighbourhood alerts, and SAPS emergency contact details.',
      localCount: safetyNotices.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['title', 'description', 'area', 'alert_level', 'category', 'date', 'action_required', 'contact_person', 'emergency_numbers', 'created_at'],
    },
    {
      name: 'community_posts',
      label: 'Community Wall & Updates',
      description: 'Live community feed, citizen announcements, municipal notices, feedback discussions, and posts synced from Facebook.',
      localCount: posts.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['title', 'content', 'author', 'author_role', 'category', 'images', 'likes', 'comments_count', 'is_pinned', 'source', 'facebook_post_url', 'created_at'],
    },
    {
      name: 'community_work',
      label: 'Relief Projects & Humanitarian Work',
      description: 'Feeding schemes, clean-up operations, emergency water distribution, and community empowerment initiatives.',
      localCount: communityWork.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['title', 'description', 'category', 'date', 'location', 'impact_stat', 'images', 'organizer', 'volunteers_count', 'created_at'],
    },
    {
      name: 'community_stats',
      label: 'Impact Metrics & Counters',
      description: 'Key statistics: issues resolved, families fed, litres of water distributed, active patrols, and community volunteers.',
      localCount: 6,
      primaryKey: 'id (TEXT)',
      uniqueKey: "id = 'current'",
      columns: ['issues_resolved', 'families_fed', 'water_litres_distributed', 'active_patrols', 'cleanups_conducted', 'community_volunteers', 'updated_at'],
    },
    {
      name: 'leadership_members',
      label: 'Task Team Leaders & Committee',
      description: 'Founder, executive leadership, area coordinators, and portfolio heads with roles, bios, and verified badges.',
      localCount: leadership.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['name', 'role', 'ward_or_area', 'bio', 'phone', 'email', 'avatar_url', 'is_founder', 'badges', 'joined_date'],
    },
    {
      name: 'supporters',
      label: 'Sponsors & Donors',
      description: 'Local business donors, community benefactors, and civic partners.',
      localCount: supporters.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['name', 'contribution_type', 'description', 'logo_url', 'website', 'is_featured'],
    },
    {
      name: 'gallery_items',
      label: 'Community Media Gallery',
      description: 'Photo archive of field operations, pothole repairs, food deliveries, and community meetings.',
      localCount: gallery.length,
      primaryKey: 'id (UUID)',
      uniqueKey: 'id',
      columns: ['title', 'category', 'image_url', 'description', 'date', 'photographer'],
    },
    {
      name: 'org_settings',
      label: 'Civic Portal Configuration',
      description: 'Emergency hotline, motto, banner ticker, logo, official NPO registration details, and banking information for donations.',
      localCount: 1,
      primaryKey: 'id (TEXT)',
      uniqueKey: "id = 'default'",
      columns: ['org_name', 'motto', 'emergency_hotline', 'npo_number', 'bank_name', 'bank_account_number', 'bank_branch_code', 'bank_account_type', 'bank_recipient_name', 'alert_banner_active', 'alert_banner_text', 'logo_url'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title & Status Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center shrink-0">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Supabase Cloud Backend
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    status?.isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status?.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  {status?.isConnected ? 'Cloud Database Active' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Persistent PostgreSQL cloud storage for the Concerned Citizens of PE Metro Civic Portal.
                Manage database connectivity, inspect live tables, and sync local records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={runConnectionTest}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{testing ? 'Checking...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncData}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 transition disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${syncing ? 'animate-bounce' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Data to Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Card */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Database Provider</span>
            </div>
            <div className="font-bold text-white text-sm">Supabase PostgreSQL 14+</div>
            <div className="text-[11px] text-slate-400">Cloud-hosted with Row-Level Security</div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connection Status</span>
            </div>
            <div className="font-bold text-white text-sm truncate">
              {status?.isConnected
                ? 'Connected & Synchronized'
                : isSupabaseConfigured
                ? 'Credentials Found (Testing Ping)'
                : 'Safe Local Storage Fallback'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {status?.urlPreview || 'No target cloud URL set'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-amber-400" />
              <span>Managed Tables</span>
            </div>
            <div className="font-bold text-white text-sm">
              {tableDefinitions.length} Structured Tables
            </div>
            <div className="text-[11px] text-slate-400">
              {issues.length} Issues • {posts.length} Posts • {safetyNotices.length} Alerts
            </div>
          </div>
        </div>

        {/* Sync Notification Banner */}
        {syncResult && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              syncResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {syncResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>
                {syncResult.success
                  ? `Successfully pushed ${syncResult.count} records to your Supabase tables!`
                  : `Sync notice: ${syncResult.errorMsg || 'Could not push records to cloud.'}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSyncResult(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Quick Setup & Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'tables'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Database Tables ({tableDefinitions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'sql'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>SQL Schema Code</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Where to Insert Keys</span>
        </button>
      </div>

      {/* Subtab 1: Quick Setup & Guide */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>3-Step Supabase Backend Setup</span>
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      Create a Free Supabase Project
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Visit{' '}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      and create a project named <strong>Concerned Citizens PE Metro</strong> in the
                      Johannesburg (af-south-1) or Frankfurt (eu-central-1) region.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Execute the Database Schema SQL
                      </h3>
                      <button
                        type="button"
                        onClick={copySqlSchemaPath}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied path!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> supabase/schema.sql
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      In your Supabase dashboard, go to the <strong>SQL Editor</strong> tab on the left.
                      Paste and run the contents of{' '}
                      <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">
                        supabase/schema.sql
                      </code>
                      . When executed, Supabase returns <em>"Success. No rows returned"</em>, which
                      confirms all tables and security policies are active.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      Set Environment Variables in <code className="text-amber-300 font-mono">.env</code>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Go to Supabase <strong>Project Settings → API</strong>. Copy your{' '}
                      <strong>Project URL</strong> and <strong>anon public key</strong> into your root{' '}
                      <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.env</code> file:
                    </p>

                    <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 space-y-1 overflow-x-auto">
                      <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
                      <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
                      <button
                        type="button"
                        onClick={copyEnvSnippet}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Copy template"
                      >
                        {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      Alternatively, simply send your Project URL and Anon Key in chat to the assistant, and it will be populated in .env automatically!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Sync */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Instant Cloud Data Seeder</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you already have community issues, relief projects, or notices logged in local storage, you can migrate them to your Supabase tables in one click.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Tracked Municipal Issues:</span>
                  <strong className="text-white">{issues.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Crime Bulletins:</span>
                  <strong className="text-white">{safetyNotices.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Community Updates:</span>
                  <strong className="text-white">{posts.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Relief Projects:</span>
                  <strong className="text-white">{communityWork.length}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncData}
                disabled={syncing}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UploadCloud className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Pushing Data...' : 'Sync All Data to Supabase'}</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Why Safe Local Storage Mode?</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Concerned Citizens portal includes a resilient hybrid architecture. If Supabase keys are not set, the app continues functioning seamlessly using browser local storage with zero crashes, allowing testing before going live.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Tables Inspector */}
      {activeSubTab === 'tables' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL Schema Tables ({tableDefinitions.length})</span>
            </h2>
            <p className="text-xs text-slate-300">
              These tables are created in Supabase by running <code className="text-amber-300 font-mono">supabase/schema.sql</code>. Each table has Row-Level Security (RLS) policies configured.
            </p>
          </div>

          <div className="space-y-3">
            {tableDefinitions.map((t) => {
              const isExpanded = expandedTable === t.name;
              return (
                <div
                  key={t.name}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  <div
                    onClick={() => setExpandedTable(isExpanded ? null : t.name)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        SQL
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-emerald-300">
                            public.{t.name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">({t.label})</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium border border-slate-700">
                        {t.localCount} records
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        {isExpanded ? '▲ Hide' : '▼ View Columns'}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-slate-400">Primary Key:</span>{' '}
                          <code className="text-emerald-400 font-mono">{t.primaryKey}</code>
                        </div>
                        <div>
                          <span className="text-slate-400">Unique Constraint:</span>{' '}
                          <code className="text-amber-400 font-mono">{t.uniqueKey}</code>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-slate-400 font-semibold">Table Columns:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {t.columns.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 font-mono text-[11px] text-slate-300"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: SQL Schema Code */}
      {activeSubTab === 'sql' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Supabase SQL Migration Script</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Located in{' '}
                <code className="text-amber-300 font-mono">supabase/schema.sql</code>. Contains all 9 tables, UUID generators, full text search indexes, and RLS policies.
              </p>
            </div>

            <button
              type="button"
              onClick={copySqlSchemaPath}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition shrink-0"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied Path!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy File Path</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[500px]">
            <pre className="text-slate-300">
{`-- ==============================================================================
-- Concerned Citizens of PE Metro Task Team - Supabase Database Schema
-- Nelson Mandela Bay Metropolitan Civic Portal & Issue Tracker
-- Compatible with PostgreSQL 14+ / Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMMUNITY ISSUES & SERVICE DELIVERY TRACKER
CREATE TABLE IF NOT EXISTS public.community_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'pothole', 'water-leak', 'sewer-burst', 'electricity-outage',
    'illegal-dumping', 'streetlights', 'crime-hotspot', 'other'
  )),
  location TEXT NOT NULL,
  suburb TEXT NOT NULL,
  ward TEXT,
  urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN ('Reported', 'Under Investigation', 'Dispatched', 'Resolved')),
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  assigned_team TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. CRIME & SAFETY NOTICES
CREATE TABLE IF NOT EXISTS public.crime_safety_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  area TEXT NOT NULL,
  alert_level TEXT NOT NULL CHECK (alert_level IN ('High Alert', 'Warning', 'Info')),
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  action_required TEXT,
  contact_person TEXT,
  emergency_numbers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. COMMUNITY RELIEF & REPAIR WORK
CREATE TABLE IF NOT EXISTS public.community_work (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  impact_stat TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  organizer TEXT NOT NULL,
  volunteers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. COMMUNITY POSTS & WALL
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  comments_count INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  area TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'direct',
  facebook_post_url TEXT,
  facebook_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- [RLS & Security Policies are included in full file: supabase/schema.sql]`}
            </pre>
          </div>
        </div>
      )}

      {/* Subtab 4: Guide on Keys */}
      {activeSubTab === 'guide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Where Do I Insert My Supabase Keys?</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with secure web standards, secret database credentials are kept out of exposed frontend input fields and instead placed in the environment configuration:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">
                  A
                </span>
                <span>Option 1: Paste directly in chat</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can simply paste your <strong>Supabase Project URL</strong> and <strong>Anon Key</strong> right here in the conversation. The assistant will safely insert them into your project's <code className="text-amber-300 font-mono">.env</code> file.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xs">
                  B
                </span>
                <span>Option 2: Edit <code className="text-amber-300 font-mono">.env</code> file</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open the <code className="text-amber-300 font-mono">.env</code> file in the root directory and fill in:
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-[11px] text-emerald-300 border border-slate-800">
                <div>VITE_SUPABASE_URL=https://...</div>
                <div>VITE_SUPABASE_ANON_KEY=eyJ...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
