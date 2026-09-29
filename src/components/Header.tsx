import React, { useState } from 'react';
import {
  Menu,
  X,
  ShieldAlert,
  PhoneCall,
  Search,
  PlusCircle,
  LogIn,
  LogOut,
  User as UserIcon,
  Shield,
  HeartHandshake,
  AlertTriangle,
  FileText,
  Users,
  Image as ImageIcon,
  Award,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FacebookImporterModal } from './FacebookImporterModal';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal,
  onOpenTrackerModal,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fbImporterOpen, setFbImporterOpen] = useState(false);
  const { settings, issues, setIsEditorOpen } = useApp();
  const { currentUser, isAdmin, logout } = useAuth();

  const unresolvedCount = issues.filter((i) => i.status !== 'Resolved').length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'members', label: 'Founder & Members', icon: Users },
    { id: 'safety', label: 'Crime & Safety', icon: AlertTriangle, badge: 'Alerts' },
    { id: 'community-work', label: 'Community Work', icon: HeartHandshake },
    {
      id: 'tracker',
      label: 'Issue Tracker',
      icon: FileText,
      badge: unresolvedCount > 0 ? String(unresolvedCount) : undefined,
    },
    { id: 'updates', label: 'Live Wall', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'supporters', label: 'Donate', icon: Award },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070d18]/95 border-b border-blue-950/60 backdrop-blur-md shadow-lg shadow-black/20">
      {/* Top Urgent Emergency Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0a1832] to-slate-950 border-b border-blue-900/40 text-slate-200 px-3 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-600 font-mono text-[10px] uppercase tracking-wider font-extrabold text-white shadow-sm shadow-rose-900/50">
              24/7 HOTLINE
            </span>
            <span className="hidden sm:inline text-slate-300">Concerned Citizens Emergency Desk:</span>
            <a
              href={`tel:${settings.emergency_hotline}`}
              className="font-bold underline text-amber-300 hover:text-amber-200 tracking-wider font-mono"
            >
              {settings.emergency_hotline}
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden lg:inline text-blue-200/80 font-medium italic">
              "{settings.motto}"
            </span>
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <UserIcon className="w-3 h-3" />
                  {currentUser.name} ({currentUser.role})
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-slate-300 hover:text-white underline ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1 text-slate-200 hover:text-amber-300 font-semibold transition"
              >
                <LogIn className="w-3 h-3 text-amber-400" />
                <span>Member / Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Alert Ticker (if enabled in settings) */}
      {settings.alert_banner_active && settings.alert_banner_text && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 sm:px-6 py-1.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-hidden">
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0">
              ALERT
            </span>
            <p className="truncate font-medium">{settings.alert_banner_text}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline shrink-0 hidden sm:inline"
          >
            Edit Ticker
          </button>
        </div>
      )}

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Titles */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-amber-400 shadow-md shadow-blue-950/50 ring-2 ring-blue-500/30 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform p-0.5">
            <img
              src={settings.logo_url || '/logo.jpg'}
              alt="Concerned Citizens of PE Metro Official Logo"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.jpg';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                CONCERNED CITIZENS
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/40">
                TASK TEAM
              </span>
            </div>
            <p className="text-xs text-amber-400 font-bold tracking-wide leading-none mt-0.5">
              OF PE METRO • GQEBERHA
            </p>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Nelson Mandela Bay Metropolitan Community Portal
            </p>
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {/* In-App Content & Site Editor Button */}
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 shadow-sm transition"
            title="Open In-App Content & Site Editor"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>In-App Editor</span>
          </button>

          <button
            type="button"
            onClick={onOpenTrackerModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Track Reference</span>
          </button>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/40 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-amber-950/60 text-amber-300 border-amber-700 hover:bg-amber-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Facebook Sync Button */}
          <button
            type="button"
            onClick={() => setFbImporterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-600/60 shadow-sm transition"
            title="Import from Facebook Page"
          >
            <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>FB Sync</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="p-2 text-amber-400 bg-slate-900 border border-amber-700/60 rounded-lg"
            title="In-App Editor"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-1 shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:block border-t border-blue-950/80 bg-[#060b14]/90 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center text-xs text-blue-300/60 font-mono">
            <span>PE Metro • Service & Safety</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070d18] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenReportModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditorOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-700/80 font-bold text-xs"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>In-App Editor</span>
            </button>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-900">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-amber-950/70 text-amber-300 font-bold border border-amber-800/80"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Facebook Sync Mobile Item */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setFbImporterOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm bg-blue-950/50 text-blue-300 font-bold border border-blue-800/50 hover:bg-blue-900/50 transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook Importer & Sync</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white">
                Sync
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Global Facebook Importer Modal */}
      <FacebookImporterModal
        isOpen={fbImporterOpen}
        onClose={() => setFbImporterOpen(false)}
      />
    </header>
  );
};
