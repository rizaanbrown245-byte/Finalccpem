import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, RefreshCw, Loader2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageUpload';

interface AvatarUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const PRESET_AVATARS = [
  { label: 'Movement Logo (Badge)', url: '/logo.jpg' },
  { label: 'Vector Crest (SVG)', url: '/logo.svg' },
  { label: 'Leader 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 4', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 5', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 6', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 7', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
];

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  label = 'Member Photo / Profile Picture',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const dataUrl = await compressImageFile(file, 600, 0.85);
      onChange(dataUrl);
    } catch (err) {
      console.error('Avatar upload compression error:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-300">{label}</label>

      <div className="flex items-center gap-4">
        {/* Current Avatar Preview */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-950 border-2 border-red-500/60 shrink-0 shadow-lg group flex items-center justify-center">
          {isProcessing ? (
            <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
          ) : (
            <img
              src={value || '/logo.jpg'}
              alt="Profile Preview"
              className={`w-full h-full ${
                value?.includes('logo') || value?.endsWith('.svg')
                  ? 'object-contain p-1 bg-white rounded-full'
                  : 'object-cover'
              }`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.jpg';
              }}
            />
          )}
        </div>

        {/* Upload Buttons */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-md shadow-blue-900/30 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing Photo...' : 'Upload Photo from Device'}</span>
            </button>

            {value && value !== '/logo.jpg' && (
              <button
                type="button"
                onClick={() => onChange('/logo.jpg')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
                title="Reset to default movement logo"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Logo</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Select a photo from your phone or computer. No URL required.
          </p>
        </div>
      </div>

      {/* Fast Presets */}
      <div>
        <span className="block text-[11px] text-slate-400 mb-1.5">Or choose a leadership avatar:</span>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_AVATARS.map((p, idx) => {
            const isSelected = value === p.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(p.url)}
                className={`relative w-8 h-8 rounded-full overflow-hidden border transition ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700 opacity-75 hover:opacity-100'
                }`}
                title={p.label}
              >
                <img
                  src={p.url}
                  alt={p.label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
