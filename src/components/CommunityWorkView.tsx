import React, { useState } from 'react';
import {
  HeartHandshake,
  Droplets,
  Soup,
  Trash2,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Building,
  Copy,
  Check,
  PlusCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityWorkView: React.FC = () => {
  const { communityWork, settings, stats } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedBank, setCopiedBank] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  // Volunteer form
  const [vName, setVName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vArea, setVArea] = useState('Bethelsdorp');
  const [vRole, setVRole] = useState('Soup Kitchen Preparation');

  const filteredWork = communityWork.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.banking_details.account_number);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vPhone.trim()) return;
    setVolunteerSuccess(true);
    setTimeout(() => {
      setVolunteerSuccess(false);
      setVolunteerModalOpen(false);
      setVName('');
      setVPhone('');
    }, 2500);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-700/50 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl shadow-black/30">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>Giving Hope To Those Who Don't Have</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Community Relief & Humanitarian Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our volunteers cook warm meals for thousands of children and pensioners, dispatch clean drinking water tankers to communities without tap access, and clean illegal dumping sites across Nelson Mandela Bay.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setVolunteerModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Join As Volunteer</span>
          </button>
        </div>
      </div>

      {/* Verified Donation Banking Details Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-600/40 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Official Non-Profit Banking Account</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Support Our Weekend Soup Kitchens & Clean Water Relief
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every Rand goes directly to purchasing potatoes, rice, meat bones, bread, and water tanker fuel for the destitute families of Nelson Mandela Bay.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 w-full lg:w-auto text-xs space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Bank:</span>
              <span className="font-bold text-white">{settings.banking_details.bank}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Account Name:</span>
              <span className="font-semibold text-slate-200">{settings.banking_details.account_name}</span>
            </div>
            <div className="flex items-center justify-between gap-4 bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400">Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-amber-400 text-sm">
                  {settings.banking_details.account_number}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-1 rounded bg-slate-800 text-slate-200 hover:text-white"
                  title="Copy account number"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
              <span>Branch: {settings.banking_details.branch_code}</span>
              <span>Ref: {settings.banking_details.reference}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'soup-kitchen', label: 'Soup Kitchens & Food' },
          { id: 'water-relief', label: 'Clean Water Relief' },
          { id: 'cleanup', label: 'Dumping Cleanups' },
          { id: 'school-outreach', label: 'School Uniform Drives' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap font-medium ${
              selectedCategory === tab.id
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWork.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden transition flex flex-col justify-between"
          >
            {item.images.length > 0 && (
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/20">
                  {item.impact_stat}
                </div>
              </div>
            )}

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold text-emerald-400 tracking-wider text-[10px]">
                    {item.category.replace('-', ' ')}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 font-semibold shrink-0">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.volunteers_count} Volunteers</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Registration Modal */}
      {volunteerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Join as a Task Team Volunteer</h3>
              <button
                type="button"
                onClick={() => setVolunteerModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {volunteerSuccess ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Thank You for Stepping Forward!</h4>
                <p className="text-xs text-slate-300">
                  Our regional coordinator will contact you via WhatsApp with the upcoming feeding and patrol roster.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sandra Peterson"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    WhatsApp Cell Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 082 345 6789"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Suburb *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bethelsdorp, Helenvale, Kariega"
                    value={vArea}
                    onChange={(e) => setVArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    How would you like to help?
                  </label>
                  <select
                    value={vRole}
                    onChange={(e) => setVRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value="Soup Kitchen Preparation">Soup Kitchen Food Prep & Serving</option>
                    <option value="Clean Water Tanker Logistics">Clean Water Logistics & Transport</option>
                    <option value="Neighborhood Watch Night Patrol">Neighborhood Watch Night Patrol</option>
                    <option value="Dumping Site Cleanup">Dumping Site Cleanups</option>
                    <option value="Handyman & Borehole Repairs">Handyman & Plumbing Repairs</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setVolunteerModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Register as Volunteer
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
