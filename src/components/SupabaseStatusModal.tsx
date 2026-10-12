import React, { useState, useEffect } from 'react';
import {
  X,
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
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  testSupabaseConnection,
  seedLocalDataToSupabase,
  SupabaseStatus,
} from '../services/supabaseService';
import { useApp } from '../context/AppContext';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { issues, posts, safetyNotices, communityWork, stats, leadership, supporters, gallery, settings } = useApp();

  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; count: number; errorMsg?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setStatus(res);
    } catch {
      setStatus({
        isConfigured: false,
        isConnected: false,
        message: 'Could not contact database service.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncAll = async () => {
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

  const handleCopySqlHint = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Supabase Cloud Database Status
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    status?.isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {status?.isConnected ? 'Cloud Active' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Nelson Mandela Bay Civic Portal persistent storage & synchronization
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Current Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              status?.isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            {status?.isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-white">
                {status?.isConnected
                  ? 'Connected to Supabase'
                  : isSupabaseConfigured
                  ? 'Credentials Detected (Testing Connection)'
                  : 'Operating in Safe Local Storage Mode'}
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                {status?.message || 'Inspecting database configuration...'}
              </p>
              {status?.urlPreview && (
                <div className="pt-1 text-[11px] font-mono text-emerald-400">
                  Target: {status.urlPreview}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={checkStatus}
              disabled={testing}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
              title="Refresh connection test"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* Setup Guide & Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              How to complete your Supabase integration:
            </h4>

            <div className="bg-slate-950/70 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  1
                </span>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-white">Create or Open Supabase Project</div>
                  <p className="text-slate-400 leading-relaxed">
                    Create a free project at{' '}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  2
                </span>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-white">Run Schema in Supabase SQL Editor</div>
                  <p className="text-slate-400 leading-relaxed">
                    A complete, production-ready schema with tables, RLS policies, and indexes has been created in{' '}
                    <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">
                      supabase/schema.sql
                    </code>
                    . Copy and run it in your Supabase SQL Editor.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopySqlHint}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition mt-1"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied path!
                      </>
                    ) : (
                      <>
                        <FileCode className="w-3 h-3" /> Copy schema path
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  3
                </span>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-white">Add Your Environment Variables</div>
                  <p className="text-slate-400 leading-relaxed">
                    Under Supabase <strong>Project Settings → API</strong>, obtain your Project URL and Publishable Anon Key, then set them in your deployment environment or <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.env</code>:
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                    <div>VITE_SUPABASE_URL=https://xyzcompany.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Local Data button */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-blue-400" />
                  Seed / Sync Local Portal Data
                </h5>
                <p className="text-xs text-slate-400">
                  Transfer existing issues, notices, relief projects, and stats from local state to your Supabase cloud tables.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSyncAll}
                disabled={!isSupabaseConfigured || syncing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" /> Push Data to Cloud
                  </>
                )}
              </button>
            </div>

            {syncResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  syncResult.success
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-amber-950/60 border border-amber-800 text-amber-300'
                }`}
              >
                {syncResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>
                  {syncResult.success
                    ? `Successfully synchronized ${syncResult.count} items to Supabase!`
                    : `Sync notice: ${syncResult.errorMsg || 'Could not complete cloud sync'}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Row Level Security (RLS) configured in schema</span>
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
