import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Phone,
  Radio,
  Clock,
  MapPin,
  Filter,
  CheckCircle2,
  Bell,
  Eye,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CrimeSafetyNotice } from '../types';

export const CrimeSafetyView: React.FC = () => {
  const { safetyNotices, emergencyContacts, createSafetyNotice } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTipModal, setShowTipModal] = useState(false);

  // Form states for submitting safety tip
  const [tipTitle, setTipTitle] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  const [tipArea, setTipArea] = useState('');
  const [tipCategory, setTipCategory] = useState<CrimeSafetyNotice['category']>('general');
  const [tipAlertLevel, setTipAlertLevel] = useState<CrimeSafetyNotice['alert_level']>('Warning');
  const [tipSuccess, setTipSuccess] = useState(false);

  const filteredNotices = safetyNotices.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipTitle.trim() || !tipDesc.trim() || !tipArea.trim()) return;

    createSafetyNotice({
      title: tipTitle.trim(),
      description: tipDesc.trim(),
      area: tipArea.trim(),
      alert_level: tipAlertLevel,
      category: tipCategory,
      date: 'Just now',
      action_required: 'Community reported vigilance notice.',
    });

    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setShowTipModal(false);
      setTipTitle('');
      setTipDesc('');
      setTipArea('');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0c1a36] to-slate-950 border border-blue-900/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-black/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Nelson Mandela Bay Community Watch Liaison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Crime & Community Safety Bulletins
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct coordination between Concerned Citizens civilian patrol networks, the Community Policing Forum (CPF), and SAPS stations across Port Elizabeth, Kariega, and Despatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTipModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center gap-2 transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Community Safety Alert</span>
        </button>
      </div>

      {/* Emergency Hotlines Directory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>24/7 Verified Emergency Numbers for PE Metro</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="font-bold text-white text-xs">{contact.name}</div>
                <div className="text-[10px] text-slate-400">{contact.department}</div>
                <div className="text-[10px] text-amber-400 font-medium">{contact.available}</div>
              </div>
              <a
                href={`tel:${contact.number.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs transition"
              >
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'cable-theft', label: 'Cable Theft' },
            { id: 'burglary', label: 'Robbery & Burglary' },
            { id: 'patrol-update', label: 'Patrol Updates' },
            { id: 'scam-alert', label: 'Scam Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredNotices.length} active notices
        </span>
      </div>

      {/* Safety Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 space-y-3 transition ${
              notice.alert_level === 'High Alert'
                ? 'border-red-600/80 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900'
                : notice.alert_level === 'Warning'
                ? 'border-amber-600/60'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${
                    notice.alert_level === 'High Alert'
                      ? 'bg-red-600 text-white animate-pulse'
                      : notice.alert_level === 'Warning'
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {notice.alert_level}
                </span>

                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {notice.area}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{notice.date}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {notice.description}
            </p>

            {notice.action_required && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex items-start gap-2 text-xs">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Recommended Citizen Action: </span>
                  <span className="text-amber-200">{notice.action_required}</span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              {notice.contact_person && (
                <span>Reported by / Point of Contact: <strong className="text-slate-200">{notice.contact_person}</strong></span>
              )}

              {notice.emergency_numbers && notice.emergency_numbers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">Dial Direct:</span>
                  {notice.emergency_numbers.map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num}`}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-400 font-mono font-bold text-xs"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Safety Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Post Community Safety Notice</h3>
              <button
                type="button"
                onClick={() => setShowTipModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tipSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Notice Published</h4>
                <p className="text-xs text-slate-300">
                  Your safety alert is now live for Port Elizabeth residents.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTip} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Alert Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suspicious white bakkie tampering with cables"
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Area / Suburb *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gelvandale / Stanford Rd"
                      value={tipArea}
                      onChange={(e) => setTipArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Alert Level *</label>
                    <select
                      value={tipAlertLevel}
                      onChange={(e) => setTipAlertLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    >
                      <option value="Info">Info (General patrol)</option>
                      <option value="Warning">Warning (Heightened risk)</option>
                      <option value="High Alert">High Alert (Immediate danger)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details, descriptions, vehicle marks, and police station notified."
                    value={tipDesc}
                    onChange={(e) => setTipDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTipModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold"
                  >
                    Publish Alert
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
