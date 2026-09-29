import React, { useState } from 'react';
import { X, Save, Award, Trash2 } from 'lucide-react';
import { LeadershipMember } from '../types';
import { AvatarUpload } from './AvatarUpload';

interface EditLeaderModalProps {
  leader: LeadershipMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<LeadershipMember>) => void;
  onDelete?: (id: string) => void;
}

export const EditLeaderModal: React.FC<EditLeaderModalProps> = ({
  leader,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !leader) return null;

  const [name, setName] = useState(leader.name);
  const [roleTitle, setRoleTitle] = useState(leader.role_title);
  const [category, setCategory] = useState(leader.category);
  const [bio, setBio] = useState(leader.bio);
  const [wardOrArea, setWardOrArea] = useState(leader.ward_or_area);
  const [phone, setPhone] = useState(leader.phone || '');
  const [email, setEmail] = useState(leader.email || '');
  const [avatarUrl, setAvatarUrl] = useState(leader.avatar_url || '/logo.jpg');
  const [joinedDate, setJoinedDate] = useState(leader.joined_date);
  const [badgesText, setBadgesText] = useState((leader.badges || []).join(', '));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) return;

    const badges = badgesText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    onSave(leader.id, {
      name: name.trim(),
      role_title: roleTitle.trim(),
      category,
      bio: bio.trim(),
      ward_or_area: wardOrArea.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatar_url: avatarUrl,
      joined_date: joinedDate.trim(),
      badges,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${leader.name}" from task team leadership?`)) {
      onDelete?.(leader.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {leader.is_founder ? 'Edit Founder Profile & Photo' : 'Edit Leadership Officer & Photo'}
              </h3>
              <p className="text-[11px] text-slate-400">Update officer details, portfolio, and avatar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar upload */}
          <AvatarUpload
            value={avatarUrl}
            onChange={setAvatarUrl}
            label={leader.is_founder ? 'Founder Portrait / Photo' : 'Officer Portrait / Photo'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Title / Portfolio *</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Leadership Category</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as 'founder' | 'executive' | 'ward_coordinator' | 'community_lead'
                  )
                }
                disabled={leader.is_founder}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs disabled:opacity-75"
              >
                <option value="founder">Founder & Movement Convener</option>
                <option value="executive">Executive Board</option>
                <option value="ward_coordinator">Ward Coordinator</option>
                <option value="community_lead">Community Operations Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ward / Coverage Area</label>
              <input
                type="text"
                value={wardOrArea}
                onChange={(e) => setWardOrArea(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="082 555 4911"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="officer@citizenofpemetro.org.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Joined Date / Tenure</label>
              <input
                type="text"
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                placeholder="e.g. March 2023"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Badges (comma separated)</label>
              <input
                type="text"
                value={badgesText}
                onChange={(e) => setBadgesText(e.target.value)}
                placeholder="Civil Convener, Relief Lead, Patrols"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Short Bio / Civic Story</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="History of civic activism and community contribution..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {onDelete && !leader.is_founder ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Leader</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-blue-950/60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
