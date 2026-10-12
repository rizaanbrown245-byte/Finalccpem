import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { CommunityIssue } from '../types';

interface ShareIssueModalProps {
  issue: CommunityIssue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const getIssueShareUrl = (referenceNumber: string): string => {
  const origin = window.location.origin;
  const path = window.location.pathname;
  return `${origin}${path}?issue=${encodeURIComponent(referenceNumber)}`;
};

export const ShareIssueModal: React.FC<ShareIssueModalProps> = ({
  issue,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !issue) return null;

  const shareUrl = getIssueShareUrl(issue.reference_number);

  const shareText = `📢 [Concerned Citizens of PE Metro] Civic Alert:\n` +
    `Issue Ref: ${issue.reference_number}\n` +
    `Title: ${issue.title}\n` +
    `Location: ${issue.location}, ${issue.suburb}\n` +
    `Status: ${issue.status} (${issue.urgency} Urgency)\n\n` +
    `Track and monitor real-time municipal response here:\n${shareUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`Track municipal issue ${issue.reference_number}: ${issue.title}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Concerned Citizens PE Metro - Track Issue ${issue.reference_number}: ${issue.title}`)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Concerned Citizens PE Metro - Issue ${issue.reference_number}`,
          text: `Track municipal issue ${issue.reference_number}: ${issue.title} in ${issue.suburb}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Share Issue Report
              </h3>
              <p className="text-xs text-slate-400">
                Generate a unique tracking link for WhatsApp & social media
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Issue Card Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded text-[11px]">
              {issue.reference_number}
            </span>
            <span className="text-[11px] font-bold text-slate-300">
              {issue.status}
            </span>
          </div>
          <h4 className="font-bold text-white text-xs line-clamp-1">{issue.title}</h4>
          <p className="text-[11px] text-slate-400">{issue.location}, {issue.suburb}</p>
        </div>

        {/* Unique Link Input with Copy Button */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-slate-300 font-bold">Unique Tracking Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono select-all focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-400 font-medium">
              Link copied to clipboard! Anyone who opens this link will jump straight to this issue.
            </p>
          )}
        </div>

        {/* 1-Click WhatsApp & Social Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Share Directly via
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-950/60"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share on WhatsApp</span>
            </a>

            {/* Native Mobile Share / Web Share API */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Device Share</span>
              </button>
            ) : (
              /* Facebook */
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Share on Facebook</span>
              </a>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-1">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Share to X / Twitter</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Share to Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
