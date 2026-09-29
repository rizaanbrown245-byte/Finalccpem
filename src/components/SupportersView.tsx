import React, { useState } from 'react';
import {
  Award,
  Building,
  Heart,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportersView: React.FC = () => {
  const { supporters, settings } = useApp();
  const [copiedBank, setCopiedBank] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // Sponsor pledge form
  const [pName, setPName] = useState('');
  const [pOrg, setPOrg] = useState('');
  const [pContact, setPContact] = useState('');
  const [pType, setPType] = useState('Food Groceries');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.banking_details.account_number);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pContact.trim()) return;
    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeSuccess(false);
      setPName('');
      setPOrg('');
      setPContact('');
    }, 3000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-800/60 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/30 text-amber-300 text-xs font-bold border border-amber-500/40">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Solidarity & Stewardship</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Our Supporters, Donors & Faith Partners
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We salute the local grocers, butchers, transport providers, and compassionate families whose donations keep our pots boiling and water flowing.
          </p>
        </div>
      </div>

      {/* Verified Banking Details Box */}
      <div className="bg-slate-900 border-2 border-amber-600/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Verified Non-Profit Bank Account
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Direct EFT Donations for Relief Supplies
            </h3>
          </div>

          <button
            type="button"
            onClick={handleCopyAccount}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
          >
            {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedBank ? 'Account Copied!' : 'Copy Account Number'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Bank Name</span>
            <div className="font-bold text-white text-sm">{settings.banking_details.bank}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Account Name</span>
            <div className="font-bold text-slate-200 text-sm truncate">
              {settings.banking_details.account_name}
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-700/60 space-y-1">
            <span className="text-[11px] text-amber-400 font-bold">Account Number</span>
            <div className="font-mono font-extrabold text-amber-300 text-base">
              {settings.banking_details.account_number}
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Branch & Reference</span>
            <div className="font-medium text-slate-200 text-xs">
              Code: {settings.banking_details.branch_code} • Ref: {settings.banking_details.reference}
            </div>
          </div>
        </div>
      </div>

      {/* Supporters Directory */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-400" />
          <span>Recognized Community Benefactors</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supporters.map((supporter) => (
            <div
              key={supporter.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {supporter.category}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{supporter.name}</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Heart className="w-4 h-4 fill-amber-400/20" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {supporter.contribution}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Partner since {supporter.since}</span>
                {supporter.website && (
                  <a
                    href={supporter.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pledge / Sponsor Contact Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-bold text-white text-center">
          Pledge Food, Water, or Materials
        </h3>
        <p className="text-xs text-slate-300 text-center max-w-md mx-auto">
          If your business or family would like to donate vegetables, meat bones, cooking gas, or plumbing supplies, leave your details below and our logistics coordinator will arrange collection.
        </p>

        {pledgeSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Thank You for Your Generosity!</h4>
            <p className="text-xs text-slate-300">
              Our Task Team logistics coordinator will contact you promptly to arrange pickup.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePledgeSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Davids"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Business / Church / Family Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. PE Fresh Produce Market"
                  value={pOrg}
                  onChange={(e) => setPOrg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Cell / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 082 555 1234"
                  value={pContact}
                  onChange={(e) => setPContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  What would you like to donate?
                </label>
                <select
                  value={pType}
                  onChange={(e) => setPType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="Food Groceries">Vegetables / Rice / Bread / Meat</option>
                  <option value="Clean Drinking Water">Bulk Clean Drinking Water / Tanker fuel</option>
                  <option value="School Supplies">School Shoes / Uniforms / Stationery</option>
                  <option value="Plumbing & Road Repairs">Plumbing Pipes / Tar / Pothole Cold-Mix</option>
                  <option value="Cooking Gas">LP Gas Cylinders / Large Pots</option>
                </select>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 transition"
              >
                Send Donation Pledge
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
