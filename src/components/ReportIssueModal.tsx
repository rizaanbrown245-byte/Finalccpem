import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  Shield,
  HelpCircle,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IssueCategory, IssueUrgency } from '../types';
import { ImageFolderUploader } from './ImageFolderUploader';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackSubmittedIssue: (ref: string) => void;
}

const CATEGORIES: { id: IssueCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'pothole', label: 'Pothole & Road Damage', icon: AlertTriangle, color: 'text-amber-400' },
  { id: 'water-leak', label: 'Water Leak / Burst Pipe', icon: Droplets, color: 'text-blue-400' },
  { id: 'sewer-burst', label: 'Sewage Overflow', icon: AlertTriangle, color: 'text-emerald-400' },
  { id: 'electricity-outage', label: 'Power / Cable Fault', icon: Zap, color: 'text-yellow-400' },
  { id: 'illegal-dumping', label: 'Illegal Dumping', icon: Trash2, color: 'text-red-400' },
  { id: 'streetlights', label: 'Streetlights Out', icon: Lightbulb, color: 'text-orange-400' },
  { id: 'crime-hotspot', label: 'Crime Hotspot / Safety', icon: Shield, color: 'text-purple-400' },
  { id: 'other', label: 'Other Municipal Issue', icon: HelpCircle, color: 'text-slate-400' },
];

const PE_SUBURBS = [
  'Bethelsdorp',
  'Gelvandale',
  'Helenvale',
  'Kariega (Uitenhage)',
  'Despatch',
  'New Brighton',
  'KwaZakhele',
  'Zwide',
  'Motherwell',
  'Korsten',
  'Schauderville',
  'Malabar',
  'Algoa Park',
  'Newton Park',
  'Summerstrand',
  'Humewood',
  'Walmer',
  'Central PE',
  'North End',
  'Arcadia',
  'West End',
  'Salt Lake',
  'Chatty',
  'Bloemendal',
  'Other / Rural NMBM',
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onTrackSubmittedIssue,
}) => {
  const { createIssue } = useApp();

  const [category, setCategory] = useState<IssueCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suburb, setSuburb] = useState('Bethelsdorp');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('');
  const [urgency, setUrgency] = useState<IssueUrgency>('High');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !reporterName.trim()) {
      return;
    }

    const created = createIssue({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      suburb,
      ward: ward.trim() ? `Ward ${ward.trim()}` : undefined,
      urgency,
      status: 'Reported',
      reporter_name: reporterName.trim(),
      reporter_contact: reporterContact.trim() || 'Not Provided',
      images: attachedImages,
    });

    setSubmittedRef(created.reference_number);
  };

  const handleCopy = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleTrackNow = () => {
    if (!submittedRef) return;
    const refToTrack = submittedRef;
    setSubmittedRef(null);
    onClose();
    onTrackSubmittedIssue(refToTrack);
  };

  const resetAndClose = () => {
    setSubmittedRef(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setReporterName('');
    setReporterContact('');
    setAttachedImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Report a Municipal & Community Issue
              </h3>
              <p className="text-xs text-blue-200">
                Concerned Citizens Task Team • Direct Community Escalation Desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedRef ? (
            /* Success View with Reference Number */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Issue Successfully Logged!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your report has been entered into the Task Team database and dispatched to our civic monitors for field verification and municipal follow-up.
                </p>
              </div>

              <div className="bg-slate-950 border border-red-500/40 rounded-xl p-4 max-w-sm mx-auto space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Your Official Tracking Reference
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-amber-400 tracking-wider">
                    {submittedRef}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    title="Copy reference number"
                  >
                    {copiedRef ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Keep this reference to check investigation and repair status at any time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTrackNow}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Track This Issue Now</span>
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Select Issue Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-start gap-1 transition ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : cat.color}`} />
                        <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title / Summary */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Brief Issue Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole on corner Stanford & Gail Rd"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs"
                />
              </div>

              {/* Suburb and Specific Street Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Suburb / Area *
                  </label>
                  <select
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition text-xs"
                  >
                    {PE_SUBURBS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Exact Street Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45 Fern Road, opposite church"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs"
                  />
                </div>
              </div>

              {/* Urgency & Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as IssueUrgency)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition text-xs"
                  >
                    <option value="Low">Low - Minor nuisance</option>
                    <option value="Medium">Medium - Regular hazard</option>
                    <option value="High">High - Urgent road/water issue</option>
                    <option value="Critical">Critical - Flooding / Severe Safety Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Municipal Ward (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 13, 24, 31"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, how long it has been ongoing, damage caused, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs resize-none"
                />
              </div>

              {/* Photo Evidence (Direct device upload - no URL required) */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <ImageFolderUploader
                  images={attachedImages}
                  onChange={setAttachedImages}
                  maxImages={8}
                  allowFolder={true}
                  label="Photo Evidence (Device / Camera Upload - No URL)"
                  helperText="Attach photos or an album folder directly from your phone camera or computer."
                />
              </div>

              {/* Reporter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Smith"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Cell / WhatsApp Number (For Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 082 123 4567"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/40 transition"
                >
                  Submit Issue & Generate Tracking ID
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
