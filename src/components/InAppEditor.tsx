import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Sliders,
  Building2,
  BellRing,
  BarChart3,
  CreditCard,
  FileCheck2,
  ShieldAlert,
  HeartHandshake,
  MessageSquarePlus,
  Check,
  AlertTriangle,
  Trash2,
  Edit2,
  ExternalLink,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  Users,
  Award,
  Sparkles,
  UserCheck,
  Globe,
  Download,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { IssueStatus, LeadershipMember, PostCategory } from '../types';
import { FacebookImporterModal } from './FacebookImporterModal';
import { LogoBrandingEditor } from './LogoBrandingEditor';

export const InAppEditor: React.FC = () => {
  const {
    isEditorOpen,
    setIsEditorOpen,
    editorActiveSection,
    setEditorActiveSection,
    settings,
    updateSettings,
    stats,
    updateStats,
    issues,
    updateIssueStatus,
    updateIssue,
    deleteIssue,
    safetyNotices,
    createSafetyNotice,
    updateSafetyNotice,
    deleteSafetyNotice,
    communityWork,
    createCommunityWork,
    updateCommunityWork,
    deleteCommunityWork,
    posts,
    createPost,
    updatePost,
    deletePost,
    leadership,
    createLeadershipMember,
    updateLeadershipMember,
    deleteLeadershipMember,
    resetToDefaults,
  } = useApp();

  const { members, createMember, deleteMember } = useAuth();

  // Local form states initialized with settings
  const [formSettings, setFormSettings] = useState(settings);
  const [formStats, setFormStats] = useState(stats);
  const [savedBanner, setSavedBanner] = useState(false);
  const [isFbModalOpen, setIsFbModalOpen] = useState(false);

  // New Leadership Officer Form
  const [newLeader, setNewLeader] = useState({
    name: '',
    role_title: '',
    category: 'ward_coordinator' as 'executive' | 'ward_coordinator' | 'community_lead',
    bio: '',
    ward_or_area: 'Gelvandale / Ward 13',
    phone: '',
    email: '',
    avatar_url: '',
    badges: 'Task Team Volunteer',
  });

  // New Member Form
  const [newMemberInput, setNewMemberInput] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'Gelvandale / Ward 13',
    role: 'member' as 'admin' | 'moderator' | 'member',
  });

  // Keep formSettings in sync with settings when updated
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Safety notice creation form
  const [newNotice, setNewNotice] = useState({
    title: '',
    area: '',
    alert_level: 'Warning' as 'High Alert' | 'Warning' | 'Notice' | 'Resolved',
    incident_type: 'Suspicious Activity',
    advice: '',
    time_reported: 'Recently',
  });

  // Community work creation form
  const [newWork, setNewWork] = useState({
    title: '',
    category: 'Relief Scheme' as 'Soup Kitchen' | 'Water Distribution' | 'Pothole Repair' | 'Clean-up' | 'Relief Scheme',
    description: '',
    location: '',
    schedule: 'Ongoing weekly',
    progress: 50,
    target: 100,
    unit: 'beneficiaries',
    lead_coordinator: 'Task Team Coordinator',
    urgent_needs: 'Volunteers and non-perishables',
  });

  // New announcement post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'announcements' as PostCategory,
    location: 'Nelson Mandela Bay',
    author: 'Task Team Secretariat',
    author_role: 'Official Task Team',
  });

  // Selected issue to edit in modal tab
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issueStatusUpdate, setIssueStatusUpdate] = useState<IssueStatus>('In Progress');
  const [issueNoteUpdate, setIssueNoteUpdate] = useState('');
  const [issueDepotUpdate, setIssueDepotUpdate] = useState('');

  if (!isEditorOpen) return null;

  const handleSaveSettings = () => {
    updateSettings(formSettings);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleSaveStats = () => {
    updateStats(formStats);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.area.trim()) return;

    createSafetyNotice({
      title: newNotice.title,
      area: newNotice.area,
      alert_level: newNotice.alert_level,
      incident_type: newNotice.incident_type,
      advice: newNotice.advice || 'Exercise vigilance and report emergencies to SAPS 10111.',
      time_reported: newNotice.time_reported,
      verified_by: 'Task Team Safety Desk',
      suburbs_affected: [newNotice.area],
      emergency_call: '10111',
    });

    setNewNotice({
      title: '',
      area: '',
      alert_level: 'Warning',
      incident_type: 'Suspicious Activity',
      advice: '',
      time_reported: 'Recently',
    });

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWork.title.trim()) return;

    createCommunityWork({
      title: newWork.title,
      category: newWork.category,
      description: newWork.description,
      location: newWork.location || 'Nelson Mandela Bay',
      schedule: newWork.schedule,
      current_metric: Number(newWork.progress),
      target_metric: Number(newWork.target),
      metric_unit: newWork.unit,
      lead_coordinator: newWork.lead_coordinator,
      urgent_needs: newWork.urgent_needs ? [newWork.urgent_needs] : ['Volunteers'],
      image_url:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    });

    setNewWork({
      title: '',
      category: 'Relief Scheme',
      description: '',
      location: '',
      schedule: 'Ongoing weekly',
      progress: 50,
      target: 100,
      unit: 'beneficiaries',
      lead_coordinator: 'Task Team Coordinator',
      urgent_needs: 'Volunteers and non-perishables',
    });

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    createPost({
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: newPost.author,
      author_role: newPost.author_role,
      location: newPost.location,
      images: [settings.logo_url || '/logo.jpg'],
      is_pinned: true,
    });

    setNewPost({
      title: '',
      content: '',
      category: 'announcements',
      location: 'Nelson Mandela Bay',
      author: 'Task Team Secretariat',
      author_role: 'Official Task Team',
    });

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleUpdateSelectedIssue = () => {
    if (!selectedIssueId) return;
    updateIssueStatus(selectedIssueId, issueStatusUpdate, issueNoteUpdate, issueDepotUpdate);
    setSelectedIssueId(null);
    setIssueNoteUpdate('');
    setIssueDepotUpdate('');
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const navTabs = [
    { id: 'branding', label: 'Branding & Logo', icon: Building2 },
    { id: 'facebook', label: 'Facebook Integration', icon: Globe },
    { id: 'founder', label: 'Founder & Leaders', icon: Award },
    { id: 'members', label: 'Members Directory', icon: Users },
    { id: 'alert', label: 'Alert Ticker', icon: BellRing },
    { id: 'stats', label: 'Impact Stats', icon: BarChart3 },
    { id: 'banking', label: 'Banking & NPO', icon: CreditCard },
    { id: 'issues', label: 'Issues Manager', icon: FileCheck2 },
    { id: 'safety', label: 'Crime Bulletins', icon: ShieldAlert },
    { id: 'work', label: 'Relief Projects', icon: HeartHandshake },
    { id: 'posts', label: 'Announcements', icon: MessageSquarePlus },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Editor Top Bar */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  In-App Content & Site Editor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modify portal texts, emergency notices, impact statistics, and official branding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedBanner && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                Updated Live!
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all content and settings back to original defaults?')) {
                  resetToDefaults();
                  setFormSettings(settings);
                  setFormStats(stats);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset state to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = editorActiveSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEditorActiveSection(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-red-500 text-red-400 bg-red-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SECTION 1: BRANDING & LOGO */}
          {editorActiveSection === 'branding' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <LogoBrandingEditor
                logoUrl={formSettings.logo_url}
                onChangeLogo={(newLogo) => {
                  setFormSettings((prev) => ({ ...prev, logo_url: newLogo }));
                  updateSettings({ logo_url: newLogo });
                }}
                founderImage={formSettings.founder_image}
                onChangeFounderImage={(newImg) => {
                  setFormSettings((prev) => ({ ...prev, founder_image: newImg }));
                  updateSettings({ founder_image: newImg });
                }}
                orgName={formSettings.org_name}
                taskTeamTitle={formSettings.task_team_title}
                motto={formSettings.motto}
              />

              <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                <p className="text-xs text-slate-300">
                  Logo changes are applied instantly across the header, badges, and reports.
                </p>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Branding Changes</span>
                </button>
              </div>

              {/* General Organization Info */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Organization & Mission Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.org_name}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, org_name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Task Team Full Title
                    </label>
                    <input
                      type="text"
                      value={formSettings.task_team_title}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, task_team_title: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official Motto
                    </label>
                    <input
                      type="text"
                      value={formSettings.motto}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, motto: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      NPO / PBO Number
                    </label>
                    <input
                      type="text"
                      value={formSettings.npo_number || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, npo_number: e.target.value })
                      }
                      placeholder="NPO: 284-912 | PBO: 930074211"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Region / Municipal Coverage
                    </label>
                    <input
                      type="text"
                      value={formSettings.region}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, region: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency & Contact Channels */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Emergency Desks & Public Contacts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      24/7 Emergency Dispatch Hotline
                    </label>
                    <input
                      type="text"
                      value={formSettings.emergency_hotline}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, emergency_hotline: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-red-400 font-mono font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Relief / Crime Patrol Line
                    </label>
                    <input
                      type="text"
                      value={formSettings.whatsapp_number}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, whatsapp_number: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      General Enquiries Telephone
                    </label>
                    <input
                      type="text"
                      value={formSettings.contact_phone}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, contact_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Public Email Address
                    </label>
                    <input
                      type="email"
                      value={formSettings.contact_email}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, contact_email: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      HQ & Relief Depot Address
                    </label>
                    <input
                      type="text"
                      value={formSettings.address}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, address: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Profile Details */}
              <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Founder & Chief Convener Profile
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Featured prominently across the portal, home spotlight, and leadership directory
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.founder_name || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_name: e.target.value })
                      }
                      placeholder="Rizaan Brown"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Title / Designation
                    </label>
                    <input
                      type="text"
                      value={formSettings.founder_title || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_title: e.target.value })
                      }
                      placeholder="Founder & Chief Task Team Convener"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Quote / Creed
                    </label>
                    <input
                      type="text"
                      value={formSettings.founder_quote || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_quote: e.target.value })
                      }
                      placeholder="Giving Hope To Those Who Don't Have..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 italic focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Bio / Story
                    </label>
                    <textarea
                      rows={3}
                      value={formSettings.founder_bio || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_bio: e.target.value })
                      }
                      placeholder="Visionary civil activist who established the Concerned Citizens..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Direct Phone
                    </label>
                    <input
                      type="text"
                      value={formSettings.founder_phone || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_phone: e.target.value })
                      }
                      placeholder="+27 (0)82 555 4911"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Direct Email
                    </label>
                    <input
                      type="email"
                      value={formSettings.founder_email || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_email: e.target.value })
                      }
                      placeholder="rizaanbrown245@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder Photo / Portrait (or Movement Logo)
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-500/80 bg-slate-950 shrink-0 shadow flex items-center justify-center p-0.5">
                        <img
                          src={formSettings.founder_image || '/logo.jpg'}
                          alt="Founder Preview"
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formSettings.founder_image || ''}
                            onChange={(e) =>
                              setFormSettings({ ...formSettings, founder_image: e.target.value })
                            }
                            placeholder="/logo.jpg or https://..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormSettings({ ...formSettings, founder_image: '/logo.jpg' })
                            }
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600 hover:text-white transition whitespace-nowrap"
                          >
                            Use Logo
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition">
                            <Upload className="w-3 h-3 text-amber-400" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  const res = evt.target?.result as string;
                                  if (res) {
                                    setFormSettings({ ...formSettings, founder_image: res });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <span className="text-[11px] text-slate-400">
                            Instant preview & base64 storage
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Founder & Organization Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: FACEBOOK INTEGRATION */}
          {editorActiveSection === 'facebook' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Facebook Quick Action Card */}
              <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-600/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0">
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-900/80 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                          Facebook Sync Tool
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          ● Active
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                        Concerned Citizens Facebook Page Importer
                      </h3>
                      <p className="text-xs text-slate-300">
                        Easily pull posts, photos, relief drives, and crime alerts from your Facebook page into the portal.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFbModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Launch Importer & Live Feed</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    Currently featured on site:{' '}
                    <strong className="text-white font-bold">
                      {posts.filter((p) => p.source === 'facebook').length} Facebook Posts
                    </strong>
                  </span>
                  <a
                    href={formSettings.facebook_url || 'https://facebook.com/ConcernedCitizensPEMetro'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  >
                    <span>Visit Concerned Citizens Facebook Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Facebook Configuration Form */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Facebook Page Settings
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure your official page links and API connection
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSettings.facebook_auto_sync ?? true}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, facebook_auto_sync: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-xs text-slate-300">Auto Sync Active</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official Facebook Page URL *
                    </label>
                    <input
                      type="url"
                      value={formSettings.facebook_url || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, facebook_url: e.target.value })
                      }
                      placeholder="https://facebook.com/ConcernedCitizensPEMetro"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Page Display Name
                      </label>
                      <input
                        type="text"
                        value={formSettings.facebook_page_name || ''}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, facebook_page_name: e.target.value })
                        }
                        placeholder="Concerned Citizens of PE Metro"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Facebook Page ID / Handle
                      </label>
                      <input
                        type="text"
                        value={formSettings.facebook_page_id || ''}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, facebook_page_id: e.target.value })
                        }
                        placeholder="ConcernedCitizensPEMetro"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Meta Graph API Page Access Token (Optional)</span>
                      <span className="text-[10px] text-slate-500">
                        Optional: For automated API background polling
                      </span>
                    </label>
                    <input
                      type="password"
                      value={formSettings.facebook_access_token || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, facebook_access_token: e.target.value })
                      }
                      placeholder="EAA..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Facebook Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {editorActiveSection === 'alert' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Municipal Emergency Broadcast Ticker
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Display high-visibility alerts at the very top of every page for immediate resident awareness
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSettings.alert_banner_active ?? true}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          alert_banner_active: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
                    <span className="ml-2 text-xs font-bold text-white">
                      {formSettings.alert_banner_active ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Alert Message Content
                  </label>
                  <textarea
                    rows={3}
                    value={formSettings.alert_banner_text || ''}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        alert_banner_text: e.target.value,
                      })
                    }
                    placeholder="e.g. Critical water outage affecting Ward 11, Gelvandale and Bethelsdorp. Emergency water tankers deployed to Gelvan Bowling Club."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Live Preview:</strong>{' '}
                    {formSettings.alert_banner_text || 'No active announcement'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply Alert Banner Live</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: IMPACT STATS */}
          {editorActiveSection === 'stats' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Community Impact Metrics
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update the live verified impact numbers displayed across the homepage and reports
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Municipal Issues Resolved
                    </label>
                    <input
                      type="number"
                      value={formStats.issues_resolved}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          issues_resolved: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Families Fed (Soup Kitchens)
                    </label>
                    <input
                      type="number"
                      value={formStats.families_fed}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          families_fed: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Water Distributed (Litres)
                    </label>
                    <input
                      type="number"
                      value={formStats.water_litres_distributed}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          water_litres_distributed: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-blue-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Active Community Patrols
                    </label>
                    <input
                      type="number"
                      value={formStats.active_patrols}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          active_patrols: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-red-400 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cleanups Conducted
                    </label>
                    <input
                      type="number"
                      value={formStats.cleanups_conducted}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          cleanups_conducted: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-purple-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Registered Task Team Volunteers
                    </label>
                    <input
                      type="number"
                      value={formStats.community_volunteers}
                      onChange={(e) =>
                        setFormStats({
                          ...formStats,
                          community_volunteers: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleSaveStats}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Impact Stats Live</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BANKING & NPO */}
          {editorActiveSection === 'banking' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Verified Non-Profit Banking Information
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    These banking details are displayed in the donation and supporters section for community audits
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.bank}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            bank: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.account_name}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            account_name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.account_number}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            account_number: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Universal Branch Code
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.branch_code}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            branch_code: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.account_type}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            account_type: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deposit Reference Instructions
                    </label>
                    <input
                      type="text"
                      value={formSettings.banking_details.reference}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          banking_details: {
                            ...formSettings.banking_details,
                            reference: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Banking Details Live</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: ISSUES MANAGER */}
          {editorActiveSection === 'issues' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Manage Reported Municipal Issues ({issues.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inspect, update status, assign task team units, and post investigation logs
                  </p>
                </div>
              </div>

              {/* Edit Selected Issue Modal / Box */}
              {selectedIssueId && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      Updating Issue Ref: {issues.find((i) => i.id === selectedIssueId)?.reference_number}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedIssueId(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Status
                      </label>
                      <select
                        value={issueStatusUpdate}
                        onChange={(e) => setIssueStatusUpdate(e.target.value as IssueStatus)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Reported">Reported</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Unit / Depot
                      </label>
                      <input
                        type="text"
                        value={issueDepotUpdate}
                        onChange={(e) => setIssueDepotUpdate(e.target.value)}
                        placeholder="e.g. Korsten Municipal Depot Unit 4"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                      </input>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Progress Update Note (Visible to Resident Tracker)
                      </label>
                      <input
                        type="text"
                        value={issueNoteUpdate}
                        onChange={(e) => setIssueNoteUpdate(e.target.value)}
                        placeholder="e.g. Water team on-site. Valve isolated, replacement pipe sections delivered."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIssueId(null)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateSelectedIssue}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow"
                    >
                      Save Status Update
                    </button>
                  </div>
                </div>
              )}

              {/* Issues Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Title & Area</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {issues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {issue.reference_number}
                        </td>
                        <td className="p-3 max-w-xs">
                          <p className="font-semibold text-white truncate">{issue.title}</p>
                          <p className="text-[11px] text-slate-400">{issue.suburb}</p>
                        </td>
                        <td className="p-3 capitalize text-slate-300">
                          {issue.category.replace('-', ' ')}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              issue.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : issue.status === 'In Progress'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIssueId(issue.id);
                              setIssueStatusUpdate(issue.status);
                              setIssueDepotUpdate(issue.assigned_team || '');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                          >
                            Edit Status
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete issue ${issue.reference_number}?`)) {
                                deleteIssue(issue.id);
                              }
                            }}
                            className="p-1 rounded text-red-400 hover:bg-red-950/60"
                            title="Delete issue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: CRIME & SAFETY BULLETINS */}
          {editorActiveSection === 'safety' && (
            <div className="space-y-6">
              {/* Form to create new bulletin */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Post New Crime or Safety Alert Bulletin
                </h3>

                <form onSubmit={handleAddNotice} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Incident Title
                      </label>
                      <input
                        type="text"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="e.g. Copper Cable Stripping and Power Tripping"
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Alert Level
                      </label>
                      <select
                        value={newNotice.alert_level}
                        onChange={(e) =>
                          setNewNotice({
                            ...newNotice,
                            alert_level: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="High Alert">High Alert</option>
                        <option value="Warning">Warning</option>
                        <option value="Notice">Notice</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Area / Suburb
                      </label>
                      <input
                        type="text"
                        value={newNotice.area}
                        onChange={(e) => setNewNotice({ ...newNotice, area: e.target.value })}
                        placeholder="e.g. Gelvandale / Algoa Park"
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Incident Type
                      </label>
                      <input
                        type="text"
                        value={newNotice.incident_type}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, incident_type: e.target.value })
                        }
                        placeholder="e.g. Infrastructure Theft"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Reported Time
                      </label>
                      <input
                        type="text"
                        value={newNotice.time_reported}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, time_reported: e.target.value })
                        }
                        placeholder="e.g. Today, 04:30 AM"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Resident Safety Advisory & Steps
                      </label>
                      <textarea
                        rows={2}
                        value={newNotice.advice}
                        onChange={(e) => setNewNotice({ ...newNotice, advice: e.target.value })}
                        placeholder="e.g. Keep perimeter lighting on. Patrol unit 12 deployed. Report sightings to 10111 immediately."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Alert Bulletin</span>
                  </button>
                </form>
              </div>

              {/* Existing Bulletins List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Published Bulletins ({safetyNotices.length})
                </h4>
                {safetyNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-400 border border-red-500/40">
                          {notice.alert_level}
                        </span>
                        <span className="text-xs font-semibold text-amber-300">
                          {notice.area}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {notice.time_reported}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{notice.title}</h5>
                      <p className="text-xs text-slate-300">{notice.advice}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this safety notice?')) {
                          deleteSafetyNotice(notice.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      title="Delete Bulletin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: RELIEF PROJECTS */}
          {editorActiveSection === 'work' && (
            <div className="space-y-6">
              {/* Form to create new community work item */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  Add Community Relief Scheme or Project
                </h3>

                <form onSubmit={handleAddWork} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={newWork.title}
                        onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                        placeholder="e.g. Gelvandale Clean Water Tanker Dispatch"
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newWork.category}
                        onChange={(e) =>
                          setNewWork({
                            ...newWork,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Soup Kitchen">Soup Kitchen</option>
                        <option value="Water Distribution">Water Distribution</option>
                        <option value="Pothole Repair">Pothole Repair</option>
                        <option value="Clean-up">Clean-up</option>
                        <option value="Relief Scheme">Relief Scheme</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Project Description
                      </label>
                      <textarea
                        rows={2}
                        value={newWork.description}
                        onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                        placeholder="Details of relief distribution, community impact, and schedule..."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Current Metric
                      </label>
                      <input
                        type="number"
                        value={newWork.progress}
                        onChange={(e) =>
                          setNewWork({ ...newWork, progress: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target Metric
                      </label>
                      <input
                        type="number"
                        value={newWork.target}
                        onChange={(e) =>
                          setNewWork({ ...newWork, target: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={newWork.unit}
                        onChange={(e) => setNewWork({ ...newWork, unit: e.target.value })}
                        placeholder="e.g. Litres / Meals / Potholes"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Community Project</span>
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Projects ({communityWork.length})
                </h4>
                {communityWork.map((work) => (
                  <div
                    key={work.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {work.category}
                        </span>
                        <span className="text-xs text-slate-400">{work.location}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{work.title}</h5>
                      <p className="text-xs text-slate-300">{work.description}</p>
                      <div className="text-xs text-slate-400 pt-1">
                        Progress: <strong className="text-white">{work.current_metric.toLocaleString()}</strong> / {work.target_metric.toLocaleString()} {work.metric_unit}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this community work item?')) {
                          deleteCommunityWork(work.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: ANNOUNCEMENTS & POSTS */}
          {editorActiveSection === 'posts' && (
            <div className="space-y-6">
              {/* Form to create official post */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-blue-400" />
                  Publish Official Task Team Announcement
                </h3>

                <form onSubmit={handleAddPost} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Announcement Headline
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="e.g. Weekend Food Drive & Clean Water Distribution Schedule"
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="announcements">Announcements</option>
                        <option value="community-work">Community Work</option>
                        <option value="crime-safety">Crime & Safety</option>
                        <option value="municipal">Municipal Alerts</option>
                        <option value="events">Events</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Announcement Body Content
                      </label>
                      <textarea
                        rows={3}
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Write detailed statement or update to residents..."
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Live Announcement</span>
                  </button>
                </form>
              </div>

              {/* Existing Posts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Published Announcements ({posts.length})
                </h4>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {post.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          By {post.author} ({post.author_role || 'Member'})
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{post.title}</h5>
                      <p className="text-xs text-slate-300 line-clamp-2">{post.content}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this announcement?')) {
                          deletePost(post.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: FOUNDER & LEADERSHIP OFFICERS */}
          {editorActiveSection === 'founder' && (
            <div className="space-y-6">
              {/* Founder Profile Card with Direct Edit */}
              <div className="bg-slate-950/70 border border-amber-500/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Founder & Chief Convener
                      </h3>
                      <p className="text-xs text-slate-400">
                        Primary civil leader of Concerned Citizens of PE Metro
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                    Founder
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Founder Name</label>
                    <input
                      type="text"
                      value={formSettings.founder_name || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                    <input
                      type="text"
                      value={formSettings.founder_title || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Founder Creed / Quote</label>
                    <input
                      type="text"
                      value={formSettings.founder_quote || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_quote: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 italic focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Founder Bio</label>
                    <textarea
                      rows={2}
                      value={formSettings.founder_bio || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_bio: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      value={formSettings.founder_phone || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={formSettings.founder_email || ''}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, founder_email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Founder Information</span>
                  </button>
                </div>
              </div>

              {/* Form to Add New Leadership Member */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-red-500" />
                  <span>Add New Task Team Coordinator / Officer</span>
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newLeader.name.trim() || !newLeader.role_title.trim()) return;

                    createLeadershipMember({
                      name: newLeader.name.trim(),
                      role_title: newLeader.role_title.trim(),
                      category: newLeader.category,
                      bio: newLeader.bio.trim() || 'Dedicated Task Team leader serving Nelson Mandela Bay communities.',
                      ward_or_area: newLeader.ward_or_area.trim(),
                      phone: newLeader.phone.trim(),
                      email: newLeader.email.trim(),
                      avatar_url: newLeader.avatar_url.trim() || '/logo.jpg',
                      joined_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      badges: newLeader.badges.split(',').map((b) => b.trim()).filter(Boolean),
                      is_founder: false,
                    });

                    setNewLeader({
                      name: '',
                      role_title: '',
                      category: 'ward_coordinator',
                      bio: '',
                      ward_or_area: 'Gelvandale / Ward 13',
                      phone: '',
                      email: '',
                      avatar_url: '',
                      badges: 'Task Team Volunteer',
                    });

                    setSavedBanner(true);
                    setTimeout(() => setSavedBanner(false), 2500);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bradley Matthews"
                        value={newLeader.name}
                        onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Role Title / Portfolio *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bethelsdorp Relief Convener"
                        value={newLeader.role_title}
                        onChange={(e) => setNewLeader({ ...newLeader, role_title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Leadership Category *</label>
                      <select
                        value={newLeader.category}
                        onChange={(e) =>
                          setNewLeader({
                            ...newLeader,
                            category: e.target.value as 'executive' | 'ward_coordinator' | 'community_lead',
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="executive">Executive Board</option>
                        <option value="ward_coordinator">Ward Coordinator</option>
                        <option value="community_lead">Community Lead</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ward / Area *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Helenvale / Ward 11"
                        value={newLeader.ward_or_area}
                        onChange={(e) => setNewLeader({ ...newLeader, ward_or_area: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="082 334 5566"
                        value={newLeader.phone}
                        onChange={(e) => setNewLeader({ ...newLeader, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                      <input
                        type="email"
                        placeholder="bradley@citizenofpemetro.org.za"
                        value={newLeader.email}
                        onChange={(e) => setNewLeader({ ...newLeader, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Badges (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Patrol Leader, Soup Kitchens, Water Taskforce"
                        value={newLeader.badges}
                        onChange={(e) => setNewLeader({ ...newLeader, badges: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Short Bio</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of their community action history..."
                        value={newLeader.bio}
                        onChange={(e) => setNewLeader({ ...newLeader, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Task Team Officer</span>
                  </button>
                </form>
              </div>

              {/* List of Officers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Task Team Officers ({leadership.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {leadership.map((lead, index) => (
                    <div
                      key={`${lead.id}-${index}`}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                          <img
                            src={lead.avatar_url || '/logo.jpg'}
                            alt={lead.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-white truncate">{lead.name}</h5>
                            {lead.is_founder && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded font-bold">
                                Founder
                              </span>
                            )}
                          </div>
                          <p className="text-amber-400 font-medium truncate">{lead.role_title}</p>
                          <span className="text-slate-400 text-[11px] block">{lead.ward_or_area}</span>
                        </div>
                      </div>

                      {!lead.is_founder && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove ${lead.name} from leadership?`)) {
                              deleteLeadershipMember(lead.id);
                            }
                          }}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 shrink-0"
                          title="Remove Leader"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: MEMBERS DIRECTORY */}
          {editorActiveSection === 'members' && (
            <div className="space-y-6">
              {/* Form to Register New Member */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Register New Community Member / Volunteer</span>
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMemberInput.name.trim() || !newMemberInput.email.trim()) return;

                    createMember({
                      name: newMemberInput.name.trim(),
                      email: newMemberInput.email.trim().toLowerCase(),
                      phone: newMemberInput.phone.trim(),
                      area: newMemberInput.area.trim(),
                      role: newMemberInput.role,
                    });

                    setNewMemberInput({
                      name: '',
                      email: '',
                      phone: '',
                      area: 'Gelvandale / Ward 13',
                      role: 'member',
                    });

                    setSavedBanner(true);
                    setTimeout(() => setSavedBanner(false), 2500);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jason Fredericks"
                      value={newMemberInput.name}
                      onChange={(e) => setNewMemberInput({ ...newMemberInput, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jason@gmail.com"
                      value={newMemberInput.email}
                      onChange={(e) => setNewMemberInput({ ...newMemberInput, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="083 456 7890"
                      value={newMemberInput.phone}
                      onChange={(e) => setNewMemberInput({ ...newMemberInput, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Ward / Suburb</label>
                    <input
                      type="text"
                      placeholder="Gelvandale / Ward 13"
                      value={newMemberInput.area}
                      onChange={(e) => setNewMemberInput({ ...newMemberInput, area: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role Permission</label>
                    <select
                      value={newMemberInput.role}
                      onChange={(e) =>
                        setNewMemberInput({
                          ...newMemberInput,
                          role: e.target.value as 'admin' | 'moderator' | 'member',
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="member">Civil Volunteer / Member</option>
                      <option value="moderator">Ward Moderator / Coordinator</option>
                      <option value="admin">Task Team Director / Admin</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Register Member</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Members Directory ({members.length})
                </h4>
                <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden text-xs">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
                          {m.avatar_url ? (
                            <img
                              src={m.avatar_url}
                              alt={m.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            m.name.charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-white truncate">{m.name}</h5>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                m.role === 'admin'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : m.role === 'moderator'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {m.role}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] truncate">
                            {m.email} • {m.area || 'PE Metro'} {m.phone ? `• ${m.phone}` : ''}
                          </p>
                        </div>
                      </div>

                      {deleteMember && m.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete member ${m.name}?`)) {
                              deleteMember(m.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editor Bottom Bar */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Changes are immediately stored in browser cache and reflected on the portal</span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditorOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Done & View Portal
          </button>
        </div>
      </div>

      {/* Facebook Importer & Sync Modal */}
      <FacebookImporterModal
        isOpen={isFbModalOpen}
        onClose={() => setIsFbModalOpen(false)}
      />
    </div>
  );
};
