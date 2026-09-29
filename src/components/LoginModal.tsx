import React, { useState } from 'react';
import { X, LogIn, Shield, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser, logout, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const ok = login(email.trim());
    if (ok) {
      setError(null);
      onClose();
    } else {
      setError('Could not sign in. Please verify your email.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'member') => {
    if (role === 'admin') {
      login('director@citizenofpemetro.org.za');
    } else {
      login('member@citizenofpemetro.org.za');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white border-2 border-amber-400 ring-2 ring-blue-500/30 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Concerned Citizens of PE Metro Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Member & Task Team Access</h3>
              <p className="text-[11px] text-slate-400">Citizen of PE Metro Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4 py-2 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Logged in as:</span>
                <span className="font-bold text-amber-400 uppercase text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800">
                  {currentUser.role}
                </span>
              </div>
              <p className="font-bold text-white text-sm">{currentUser.name}</p>
              <p className="text-slate-400">{currentUser.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
              >
                Log Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-bold">Email Address</label>
                <span className="text-[10px] text-emerald-400 font-semibold">Passwordless Login</span>
              </div>
              <input
                type="email"
                required
                placeholder="director@citizenofpemetro.org.za or your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                No password required. Enter any admin or registered email to sign in immediately.
              </p>
            </div>

            {error && <div className="text-rose-400 text-xs">{error}</div>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow"
            >
              Sign In
            </button>

            {/* Quick Demo Sign-Ins */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="block text-[11px] text-slate-400 text-center font-medium">
                Quick 1-Click Access for Demonstration:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3 h-3" />
                  <span>Director / Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('member')}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <UserIcon className="w-3 h-3" />
                  <span>Active Member</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
