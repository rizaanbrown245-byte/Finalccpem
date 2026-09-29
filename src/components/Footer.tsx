import React from 'react';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Heart,
  ExternalLink,
  Lock,
  FileText,
  AlertTriangle,
  Building,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenTrackerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenReportModal,
  onOpenTrackerModal,
}) => {
  const { settings, emergencyContacts, setIsEditorOpen } = useApp();

  return (
    <footer className="bg-[#050912] border-t border-blue-950/80 text-slate-400 text-xs mt-16">
      {/* Top Banner with Motto */}
      <div className="border-b border-blue-950/60 bg-[#070d18] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white flex items-center justify-center shrink-0 shadow-md p-0.5 ring-2 ring-blue-500/20">
              <img
                src={settings.logo_url || '/logo.jpg'}
                alt="Concerned Citizens of PE Metro Emblem"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                {settings.task_team_title}
              </h3>
              <p className="text-amber-400 text-xs font-semibold">"{settings.motto}"</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow shadow-blue-950/40"
            >
              Report an Issue
            </button>
            <button
              type="button"
              onClick={onOpenTrackerModal}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
            >
              Track Existing Report
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('supporters')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold transition"
            >
              Support Soup Kitchens
            </button>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-600/40 font-semibold transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>In-App Editor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Organization Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-amber-400 flex items-center justify-center shrink-0 p-0.5">
              <img
                src={settings.logo_url || '/logo.jpg'}
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <span className="font-bold text-white text-sm">Citizen of PE Metro</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            A non-profit community civil action task team serving Nelson Mandela Bay (Gqeberha, Kariega, Despatch). We stand in the gap for vulnerable residents through direct soup kitchens, clean water distribution, crime watch liaison, and service delivery accountability.
          </p>
          <div className="pt-2 text-slate-400 text-[11px] space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{settings.contact_email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{settings.contact_phone}</span>
            </p>
          </div>
        </div>

        {/* Column 2: Quick Community Links */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-blue-500 pl-2">
            Community Portals
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('members')}
                className="hover:text-amber-400 transition font-semibold text-amber-300"
              >
                Founder & Members Directory
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('safety')}
                className="hover:text-amber-400 transition"
              >
                Crime Alerts & Night Patrols
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('community-work')}
                className="hover:text-amber-400 transition"
              >
                Soup Kitchens & Water Relief
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('tracker')}
                className="hover:text-amber-400 transition"
              >
                Municipal Issue Tracker
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('updates')}
                className="hover:text-amber-400 transition"
              >
                Verified Member Reports
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('gallery')}
                className="hover:text-amber-400 transition"
              >
                Photo Gallery of Community Work
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('supporters')}
                className="hover:text-amber-400 transition"
              >
                Donors & Volunteer Registration
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Emergency Dispatch Numbers */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-rose-500 pl-2">
            24/7 Emergency Contacts
          </h4>
          <div className="space-y-2">
            {emergencyContacts.slice(0, 4).map((c) => (
              <div key={c.id} className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200 text-xs">{c.name}</span>
                  <a
                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                    className="font-mono font-bold text-rose-400 hover:text-rose-300 text-xs"
                  >
                    {c.number}
                  </a>
                </div>
                <div className="text-[10px] text-slate-400">{c.department}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Verified Donation Account */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Verified Donation Account
          </h4>
          <div className="bg-slate-900/90 border border-amber-600/30 rounded-lg p-3 space-y-1.5 text-[11px]">
            <p className="text-amber-300 font-bold flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              <span>{settings.banking_details.bank}</span>
            </p>
            <p className="text-slate-300 font-medium">{settings.banking_details.account_name}</p>
            <div className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center justify-between text-white font-bold">
              <span>ACC: {settings.banking_details.account_number}</span>
            </div>
            <p className="text-slate-400 text-[10px]">
              Branch Code: {settings.banking_details.branch_code} • {settings.banking_details.account_type}
            </p>
            <p className="text-amber-400 text-[10px] italic">
              Ref: {settings.banking_details.reference}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Attribution & Copyright Bar */}
      <div className="border-t border-blue-950/60 bg-black/90 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
          <div>
            <span className="text-slate-300 font-semibold">
              © {new Date().getFullYear()} {settings.task_team_title}.
            </span>{' '}
            <span className="text-slate-400">All rights reserved. Serving Nelson Mandela Bay.</span>
          </div>

          <div className="flex items-center gap-2 font-medium text-slate-300">
            <span>Powered for Community Action</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-400 font-bold tracking-wide">
              Made by RB digital solutions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
