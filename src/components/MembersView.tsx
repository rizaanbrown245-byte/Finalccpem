import React, { useState } from 'react';
import {
  Users,
  Shield,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  Sliders,
  HeartHandshake,
  Star,
  Quote,
  Sparkles,
  UserCheck,
  Building,
  Radio,
  X,
  Edit2,
  Camera,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LeadershipMember, User } from '../types';
import { EditMemberModal } from './EditMemberModal';
import { EditLeaderModal } from './EditLeaderModal';

export const MembersView: React.FC = () => {
  const {
    leadership,
    settings,
    setIsEditorOpen,
    setEditorActiveSection,
    updateLeadershipMember,
    deleteLeadershipMember,
    updateSettings,
  } = useApp();
  const { members, createMember, updateMember, deleteMember, currentUser, isAdmin } = useAuth();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // Edit states for members and leaders
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeadershipMember | null>(null);
  const [isEditLeaderModalOpen, setIsEditLeaderModalOpen] = useState(false);

  // Join form state
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [joinArea, setJoinArea] = useState('Gelvandale / Ward 13');
  const [joinRoleInterest, setJoinRoleInterest] = useState('Community Volunteer');
  const [joinJoinedSuccess, setJoinJoinedSuccess] = useState(false);

  // Identify the Founder (either marked is_founder or category === 'founder' or first leader)
  const founder = leadership.find((l) => l.is_founder || l.category === 'founder') || {
    id: 'lead-01',
    name: settings.founder_name || 'Farouk Jeftha',
    role_title: settings.founder_title || 'Movement Founder & Civil Leader',
    category: 'founder' as const,
    bio:
      settings.founder_bio ||
      'Visionary founder who established the Concerned Citizens of PE Metro civil movement to champion the rights of forgotten communities across Nelson Mandela Bay.',
    avatar_url: settings.founder_image || settings.logo_url || '/logo.jpg',
    phone: settings.founder_phone || settings.emergency_hotline,
    email: settings.founder_email || settings.contact_email,
    ward_or_area: 'Nelson Mandela Bay Metropolitan',
    joined_date: 'Movement Founder (Established 2023)',
    badges: ['Founder', 'Civil Visionary', 'Grassroots Convener'],
    is_founder: true,
  };

  // Filter executive leadership excluding the founder for the executive section
  const executiveTeam = leadership.filter((l) => l.id !== founder.id);

  // Filtered members list combining leadership and general registered members
  const filteredLeaders = executiveTeam.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.ward_or_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.bio.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'executive') return lead.category === 'executive';
    if (activeFilter === 'ward') return lead.category === 'ward_coordinator';
    if (activeFilter === 'community') return lead.category === 'community_lead';
    return true;
  });

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.area && m.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'volunteers') return m.role === 'member';
    if (activeFilter === 'all') return true;
    return true;
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim() || !joinEmail.trim()) return;

    createMember({
      name: joinName.trim(),
      email: joinEmail.trim().toLowerCase(),
      phone: joinPhone.trim(),
      area: joinArea,
      role: 'member',
    });

    setJoinJoinedSuccess(true);
    setTimeout(() => {
      setJoinJoinedSuccess(false);
      setJoinModalOpen(false);
      setJoinName('');
      setJoinEmail('');
      setJoinPhone('');
    }, 1800);
  };

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Civil Movement Leadership & Members</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The People Standing in the Gap
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Meet the visionary founder, executive coordinators, ward captains, and grassroots volunteers powering the <span className="font-semibold text-white">{settings.task_team_title}</span> across Port Elizabeth, Kariega, and Despatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-950/60 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register as Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditorActiveSection('branding');
                setIsEditorOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-sm border border-amber-500/30 transition"
            >
              <Sliders className="w-4 h-4" />
              <span>In-App Editor</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-slate-400">Founder & Convener</span>
            <strong className="text-white text-sm">{founder.name}</strong>
          </div>
          <div>
            <span className="block text-slate-400">Task Team Leaders</span>
            <strong className="text-white text-sm">{leadership.length} Officers</strong>
          </div>
          <div>
            <span className="block text-slate-400">Registered Members</span>
            <strong className="text-amber-400 text-sm">{members.length}+ Active</strong>
          </div>
          <div>
            <span className="block text-slate-400">Metro Coverage</span>
            <strong className="text-white text-sm">All 60 Wards</strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FOUNDER SPOTLIGHT CARD */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Founder & Chief Task Team Convener
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              The founding visionary and grassroots convener of Concerned Citizens of PE Metro
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingLeader(founder);
                setIsEditLeaderModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-semibold px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/60 transition shadow hover:bg-amber-900"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Founder & Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditorActiveSection('branding');
                setIsEditorOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>In-App Editor</span>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Founder Avatar & Medallion */}
            <div className="shrink-0 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-blue-500 to-amber-300 shadow-2xl shadow-blue-950/60 ring-2 ring-blue-500/30">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-slate-950">
                  <img
                    src={founder.avatar_url || settings.logo_url || '/logo.jpg'}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.jpg';
                    }}
                  />
                </div>

                {/* Founder Ribbon Tag */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg border border-amber-300 whitespace-nowrap">
                  Movement Founder
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingLeader(founder);
                  setIsEditLeaderModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-amber-950 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition shadow"
                title="Change founder photo"
              >
                <Camera className="w-3 h-3 text-amber-400" />
                <span>Change Photo</span>
              </button>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-xs">
                {(founder.badges || ['Founder', 'Civil Convener', 'Grassroots Lead']).map(
                  (badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-[10px] font-bold"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Founder Story & Vision Details */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Founding Convener & Civic Leader</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {founder.name}
                </h3>
                <p className="text-amber-400 font-semibold text-sm sm:text-base mt-1">
                  {founder.role_title}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{founder.ward_or_area}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{founder.joined_date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Civil Leader</span>
                  </span>
                </div>
              </div>

              {/* Founder Quote */}
              <div className="relative bg-slate-950/80 border-l-4 border-amber-500 rounded-2xl p-5 sm:p-6 shadow-inner text-slate-200 text-sm sm:text-base italic leading-relaxed">
                <Quote className="w-8 h-8 text-amber-500/30 absolute -top-3 -left-2 pointer-events-none" />
                <p>
                  "{settings.founder_quote || settings.motto || "Giving Hope To Those Who Don't Have"}"
                </p>
                <span className="block not-italic font-bold text-xs text-amber-400 mt-2">
                  — {founder.name}, Founder of Concerned Citizens of PE Metro
                </span>
              </div>

              {/* Founder Bio / Manifesto */}
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {founder.bio}
              </p>

              {/* Direct Leadership Contacts */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs">
                {founder.phone && (
                  <a
                    href={`tel:${founder.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white transition font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{founder.phone}</span>
                  </a>
                )}
                {founder.email && (
                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white transition font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>{founder.email}</span>
                  </a>
                )}
                <span className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 font-semibold text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  <span>24/7 Field Dispatch Authorized</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE TASK TEAM LEADERSHIP GRID */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Executive Task Team & Operations Leads
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Department coordinators managing community water delivery, civilian patrols, food kitchens, and governance
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Leads ({executiveTeam.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('executive')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                activeFilter === 'executive'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive Board
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ward')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                activeFilter === 'ward'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ward Coordinators
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('community')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                activeFilter === 'community'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Community Leads
            </button>
          </div>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaders.map((leader, index) => (
            <div
              key={`${leader.id}-${index}`}
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700 shrink-0">
                    <img
                      src={leader.avatar_url || '/logo.jpg'}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.jpg';
                      }}
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-white text-base truncate">
                      {leader.name}
                    </h4>
                    <p className="text-xs text-amber-400 font-medium line-clamp-2">
                      {leader.role_title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{leader.ward_or_area}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {leader.bio}
                </p>

                {leader.badges && leader.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {leader.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">Joined: {leader.joined_date}</span>
                {leader.phone && (
                  <a
                    href={`tel:${leader.phone}`}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold text-xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ACTIVE MEMBERS & VOLUNTEER DIRECTORY */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Active Ward Volunteers & Registered Members
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Grassroots community members actively deployed in food prep, neighborhood watch patrols, and water convoys
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search members by name or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Member cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 space-y-3 shadow transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-white text-xs truncate">{member.name}</h5>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      member.role === 'admin'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : member.role === 'moderator'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {member.role === 'admin' ? 'Director' : member.role === 'moderator' ? 'Coordinator' : 'Civil Volunteer'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate">{member.area || 'Nelson Mandela Bay'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Member since: {member.joined_at}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Citizen</span>
                </span>
                {member.phone && (
                  <span className="text-slate-400 font-mono text-[10px]">{member.phone}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No registered members matching "{searchQuery}". Try a different keyword or register a new volunteer below.
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. JOIN THE TASK TEAM CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40">
            <HeartHandshake className="w-4 h-4 text-blue-400" />
            <span>Nelson Mandela Bay Needs You</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Stand in the Gap for Your Neighborhood
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Whether you can drive a water relief bakkie, help cook at a soup kitchen, patrol your street with CPF, or log potholes on our tracker, your hands make real change in PE Metro.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setJoinModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-950 transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Join Task Team / Register as Volunteer</span>
          </button>

          <a
            href={`tel:${settings.emergency_hotline}`}
            className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm border border-amber-500/30 transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Task Team HQ</span>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* JOIN / VOLUNTEER REGISTRATION MODAL */}
      {/* ========================================================================= */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Register as Task Team Volunteer
                  </h3>
                  <p className="text-xs text-slate-400">Concerned Citizens of PE Metro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setJoinModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {joinJoinedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Welcome to the Task Team!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  You have been successfully added to our active volunteer roster. Our area convener will be in touch for field deployment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wayne Alexander"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="wayne@gmail.com"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="082 123 4567"
                      value={joinPhone}
                      onChange={(e) => setJoinPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Ward / Suburb *</label>
                    <select
                      value={joinArea}
                      onChange={(e) => setJoinArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Gelvandale / Ward 13">Gelvandale / Ward 13</option>
                      <option value="Bethelsdorp / Ext 31">Bethelsdorp / Ext 31</option>
                      <option value="Helenvale / Ward 11">Helenvale / Ward 11</option>
                      <option value="Arcadia & West End">Arcadia & West End</option>
                      <option value="Korsten / Commercial Rd">Korsten / Commercial Rd</option>
                      <option value="Kariega / Uitenhage">Kariega / Uitenhage</option>
                      <option value="Despatch">Despatch</option>
                      <option value="Central & Summerstrand">Central & Summerstrand</option>
                      <option value="New Brighton / Zwide">New Brighton / Zwide</option>
                      <option value="Motherwell / Wells Estate">Motherwell / Wells Estate</option>
                      <option value="Other Nelson Mandela Bay Ward">Other NMB Ward</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Primary Interest *</label>
                    <select
                      value={joinRoleInterest}
                      onChange={(e) => setJoinRoleInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Community Soup Kitchens">Community Soup Kitchens</option>
                      <option value="Water Tanker Escort & Distribution">Water Tanker Escort</option>
                      <option value="Neighborhood Civilian Patrol">Civilian Street Patrols</option>
                      <option value="Illegal Dump Clearances & Cleanups">Street & Park Cleanups</option>
                      <option value="Municipal Issue Logging & Auditing">Municipal Issue Logging</option>
                      <option value="Youth Mentorship & Sports">Youth Mentorship</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setJoinModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow-lg shadow-blue-950"
                  >
                    Register as Member
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
