import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactView: React.FC = () => {
  const { settings, emergencyContacts } = useApp();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [suburb, setSuburb] = useState('Bethelsdorp');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1832] to-slate-950 border border-blue-900/40 rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Community Escalation & Operations Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Contact & 24/7 Rapid Emergency Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need urgent community support, want to report a service failure, or reach our night patrol team? We are ready to assist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Desk Details */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Direct Contact Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">24/7 Emergency Desk Hotline:</span>
                  <a
                    href={`tel:${settings.emergency_hotline}`}
                    className="font-mono font-extrabold text-amber-400 text-sm hover:underline"
                  >
                    {settings.emergency_hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Administrative Office:</span>
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="font-bold text-white text-xs hover:underline"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Official Email:</span>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="font-bold text-white text-xs hover:underline"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Physical Operations Base:</span>
                  <span className="font-medium text-slate-200 text-xs">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Operating Hours:</span>
                  <span className="font-medium text-slate-200 text-xs">
                    Civic Office: Mon–Fri 08:00–17:00 • Emergency Dispatch: 24/7/365
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Link */}
          <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Citizen Support Desk</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Send voice notes, photos of water leaks, or live location for emergency patrol assistance.
            </p>
            <a
              href="https://wa.me/27741234567"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition mt-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Us on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Middle & Right Column: Message Form & Emergency Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Send Message Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Send an Escalation or Inquiry to Task Team Coordinators
            </h3>

            {sent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-slate-300">
                  A Task Team community liaison officer will follow up with you on WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wayne Petersen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Cell / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 082 999 4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Your Nelson Mandela Bay Suburb *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Helenvale, New Brighton, Kariega, Bethelsdorp"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Message / Inquiry *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your question, request for food relief, water supply need, or municipal escalation."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow flex items-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Task Team</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Emergency Helplines Quick Reference Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Municipal & Emergency Hotlines for Gqeberha / Kariega</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {emergencyContacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{c.department}</span>
                  </div>
                  <a
                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                    className="font-mono font-bold text-rose-400 hover:text-rose-300 text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700"
                  >
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
