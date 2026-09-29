import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Save,
  PlusCircle,
  Users,
  Settings,
  Filter,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { IssueStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    issues,
    updateIssueStatus,
    stats,
    updateStats,
    settings,
    updateSettings,
    safetyNotices,
    createSafetyNotice,
    setIsEditorOpen,
    setEditorActiveSection,
  } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'issues' | 'stats' | 'notice'>('issues');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(issues[0]?.id || null);
  const [statusToSet, setStatusToSet] = useState<IssueStatus>('Under Investigation');
  const [assignedTeam, setAssignedTeam] = useState('Central PE Roads & Stormwater Depot');
  const [adminNote, setAdminNote] = useState('');
  const [updateSaved, setUpdateSaved] = useState(false);

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeArea, setNoticeArea] = useState('');
  const [noticeLevel, setNoticeLevel] = useState<'High Alert' | 'Warning' | 'Info'>('Warning');

  // Stats edit form
  const [statIssues, setStatIssues] = useState(stats.issues_resolved);
  const [statMeals, setStatMeals] = useState(stats.families_fed);
  const [statWater, setStatWater] = useState(stats.water_litres_distributed);
  const [statPatrols, setStatPatrols] = useState(stats.active_patrols);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  const handleApplyStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId) return;

    updateIssueStatus(selectedIssueId, statusToSet, adminNote.trim(), assignedTeam.trim());
    setUpdateSaved(true);
    setTimeout(() => {
      setUpdateSaved(false);
      setAdminNote('');
    }, 2000);
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats({
      issues_resolved: Number(statIssues),
      families_fed: Number(statMeals),
      water_litres_distributed: Number(statWater),
      active_patrols: Number(statPatrols),
    });
    alert('Community impact statistics updated!');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim() || !noticeArea.trim()) return;

    createSafetyNotice({
      title: noticeTitle.trim(),
      description: noticeDesc.trim(),
      area: noticeArea.trim(),
      alert_level: noticeLevel,
      category: 'patrol-update',
      date: 'Today',
      action_required: 'Task Team monitoring active in the area.',
    });

    setNoticeTitle('');
    setNoticeDesc('');
    setNoticeArea('');
    alert('Official safety bulletin posted!');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-800/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/30 text-amber-300 text-xs font-bold border border-amber-500/40">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Task Team Executive Console</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Operations & Field Escalation Management
          </h2>
          <p className="text-xs text-slate-300">
            Signed in as: <strong className="text-amber-300">{currentUser?.name || 'Administrator'}</strong> ({currentUser?.role})
          </p>
        </div>

        {/* Tab controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'issues'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Reports ({issues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notice')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'notice'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Post Notice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'stats'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Update Stats
          </button>
          <button
            type="button"
            onClick={() => {
              setEditorActiveSection('branding');
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 font-semibold transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open In-App Editor</span>
          </button>
        </div>
      </div>

      {/* Issues Management Tab */}
      {activeTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Selector List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-[650px] overflow-y-auto">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Select Issue to Update:
            </h3>

            <div className="space-y-2">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setStatusToSet(issue.status);
                    if (issue.assigned_team) setAssignedTeam(issue.assigned_team);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedIssueId === issue.id
                      ? 'bg-amber-950/40 border-amber-500/80 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400">
                      {issue.reference_number}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        issue.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 line-clamp-1">{issue.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {issue.suburb} • {issue.reporter_name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Editor Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            {selectedIssue ? (
              <form onSubmit={handleApplyStatusUpdate} className="space-y-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {selectedIssue.reference_number}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Reporter: {selectedIssue.reporter_name} ({selectedIssue.reporter_contact})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedIssue.title}</h3>
                  <p className="text-slate-300 text-xs">{selectedIssue.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Location: {selectedIssue.location}, {selectedIssue.suburb}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Update Issue Status *
                    </label>
                    <select
                      value={statusToSet}
                      onChange={(e) => setStatusToSet(e.target.value as IssueStatus)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold text-xs"
                    >
                      <option value="Reported">Reported (Pending review)</option>
                      <option value="Under Investigation">Under Investigation (Site inspected)</option>
                      <option value="Dispatched">Dispatched to Municipal Depot</option>
                      <option value="Resolved">Resolved & Verified Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Assigned Municipal Depot / Task Unit
                    </label>
                    <input
                      type="text"
                      value={assignedTeam}
                      onChange={(e) => setAssignedTeam(e.target.value)}
                      placeholder="e.g. Kariega Roads Depot, Bethelsdorp Water Team"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Timeline Note / Field Feedback (Publicly Visible on Tracker) *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Field coordinator inspected site. Municipal reference #WAR8819 lodged with NMBM Water Director."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs resize-none"
                  />
                </div>

                {updateSaved && (
                  <div className="text-emerald-400 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue status and public timeline updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Issue Status & Notify Timeline</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center text-slate-400">
                Please select an issue on the left to manage.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Safety Notice Tab */}
      {activeTab === 'notice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white">Post Official Safety Bulletin</h3>
          <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Alert Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Power Cable Theft Alert: Gelvandale Substation"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Area / Suburb *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gelvandale / Helenvale"
                  value={noticeArea}
                  onChange={(e) => setNoticeArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Alert Level</label>
                <select
                  value={noticeLevel}
                  onChange={(e) => setNoticeLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="High Alert">High Alert</option>
                  <option value="Warning">Warning</option>
                  <option value="Info">Info</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Description & Advice *</label>
              <textarea
                required
                rows={4}
                placeholder="Details of the threat, vehicles involved, and instructions for residents."
                value={noticeDesc}
                onChange={(e) => setNoticeDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30"
            >
              Publish Bulletin
            </button>
          </form>
        </div>
      )}

      {/* Impact Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white">Update Verified Impact Numbers</h3>
          <form onSubmit={handleSaveStats} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Issues Resolved</label>
                <input
                  type="number"
                  value={statIssues}
                  onChange={(e) => setStatIssues(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Meals / Families Fed</label>
                <input
                  type="number"
                  value={statMeals}
                  onChange={(e) => setStatMeals(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Water Distributed (Litres)
                </label>
                <input
                  type="number"
                  value={statWater}
                  onChange={(e) => setStatWater(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Active Patrol Teams</label>
                <input
                  type="number"
                  value={statPatrols}
                  onChange={(e) => setStatPatrols(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Save Impact Metrics
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
