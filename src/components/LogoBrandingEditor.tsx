import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  AlertTriangle,
  Eye,
  Sliders,
  Shield,
  Award,
  Sparkles,
  Trash2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
} from 'lucide-react';

interface LogoBrandingEditorProps {
  logoUrl: string;
  onChangeLogo: (url: string) => void;
  founderImage?: string;
  onChangeFounderImage?: (url: string) => void;
  orgName?: string;
  taskTeamTitle?: string;
  motto?: string;
}

const PRESET_LOGOS = [
  {
    id: 'official-jpg',
    title: 'Official Task Team Badge (JPG)',
    url: '/logo.jpg',
    badge: 'Primary Emblem',
    description: 'Official seal with Concerned Citizens crest and regional gold trim.',
  },
  {
    id: 'vector-svg',
    title: 'High-Def Vector Crest (SVG)',
    url: '/logo.svg',
    badge: 'Vector Sharp',
    description: 'Ultra-crisp SVG vector badge optimized for high-resolution displays.',
  },
  {
    id: 'civic-shield',
    title: 'Civil Defense & Task Team Shield',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
    badge: 'Community Watch',
    description: 'Civic safety and neighborhood vigilance emblem.',
  },
  {
    id: 'hands-relief',
    title: 'Humanitarian Relief & Care',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    badge: 'Relief Scheme',
    description: 'Community hands unity symbol for soup kitchens and borehole drives.',
  },
];

const PRESET_FOUNDER_AVATARS = [
  { label: 'Official Movement Logo', url: '/logo.jpg' },
  { label: 'Vector SVG Crest', url: '/logo.svg' },
  { label: 'Founder Portrait (Civil Leader)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
  { label: 'Task Team Convener', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
  { label: 'Civil Activist Portrait', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80' },
];

export const LogoBrandingEditor: React.FC<LogoBrandingEditorProps> = ({
  logoUrl,
  onChangeLogo,
  founderImage = '/logo.jpg',
  onChangeFounderImage,
  orgName = 'Concerned Citizens of PE Metro',
  taskTeamTitle = 'Concerned Citizens Task Team',
  motto = "Giving Hope To Those Who Don't Have...",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const founderFileInputRef = useRef<HTMLInputElement>(null);

  // Preview options
  const [previewBg, setPreviewBg] = useState<'slate' | 'white' | 'checker' | 'red'>('slate');
  const [frameShape, setFrameShape] = useState<'circle' | 'square' | 'shield'>('circle');
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [founderLoadError, setFounderLoadError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'logo' | 'founder'>('logo');
  const [urlInput, setUrlInput] = useState<string>(logoUrl || '');
  const [founderUrlInput, setFounderUrlInput] = useState<string>(founderImage || '');

  // Synchronize local input state if props change externally
  useEffect(() => {
    setUrlInput(logoUrl || '');
    setImageLoadError(false);
  }, [logoUrl]);

  useEffect(() => {
    setFounderUrlInput(founderImage || '');
    setFounderLoadError(false);
  }, [founderImage]);

  // Compress & convert file to data URL
  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // For SVGs, keep as is
      if (file.type === 'image/svg+xml' || file.size < 500 * 1024) {
        callback(result);
        return;
      }

      // Resize high-res images in canvas to prevent local storage quota overflow
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800; // ample for logos and avatars
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
          callback(compressed);
        } else {
          callback(result);
        }
      };
      img.onerror = () => callback(result);
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, (dataUrl) => {
      onChangeLogo(dataUrl);
      setUrlInput(dataUrl);
      setImageLoadError(false);
    });
  };

  const handleFounderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, (dataUrl) => {
      if (onChangeFounderImage) {
        onChangeFounderImage(dataUrl);
      }
      setFounderUrlInput(dataUrl);
      setFounderLoadError(false);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (activeTab === 'logo') {
        processImageFile(file, (dataUrl) => {
          onChangeLogo(dataUrl);
          setUrlInput(dataUrl);
          setImageLoadError(false);
        });
      } else {
        processImageFile(file, (dataUrl) => {
          if (onChangeFounderImage) {
            onChangeFounderImage(dataUrl);
          }
          setFounderUrlInput(dataUrl);
          setFounderLoadError(false);
        });
      }
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-image.png', { type: imageType });
          if (activeTab === 'logo') {
            processImageFile(file, (dataUrl) => {
              onChangeLogo(dataUrl);
              setUrlInput(dataUrl);
              setImageLoadError(false);
            });
          } else {
            processImageFile(file, (dataUrl) => {
              if (onChangeFounderImage) {
                onChangeFounderImage(dataUrl);
              }
              setFounderUrlInput(dataUrl);
              setFounderLoadError(false);
            });
          }
          return;
        }
      }
      alert('No image found on clipboard. Copy an image first, then click paste.');
    } catch {
      alert('Could not access clipboard directly. Please use file upload or paste an image URL.');
    }
  };

  // Apply custom URL input
  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChangeLogo('/logo.jpg');
      setUrlInput('/logo.jpg');
    } else {
      onChangeLogo(trimmed);
    }
    setImageLoadError(false);
  };

  const handleApplyFounderUrl = () => {
    const trimmed = founderUrlInput.trim();
    if (onChangeFounderImage) {
      onChangeFounderImage(trimmed || '/logo.jpg');
    }
    setFounderLoadError(false);
  };

  const effectiveLogoUrl = logoUrl || '/logo.jpg';
  const effectiveFounderUrl = founderImage || '/logo.jpg';

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs: Movement Logo vs Founder Photo */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === 'logo'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Official Movement Logo & Badges</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('founder')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === 'founder'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Founder & Convener Photo</span>
        </button>
      </div>

      {activeTab === 'logo' ? (
        <div className="space-y-6">
          {/* Main Interactive Preview & Adjustment Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                  Live Visual Inspector
                </span>
                <h3 className="text-base font-black text-white tracking-tight mt-1 flex items-center gap-2">
                  <span>Emblem Display & Sizing Controls</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect the emblem under various backgrounds, aspect ratios, and header containers
                </p>
              </div>

              {/* Reset to Official Logo Button */}
              <button
                type="button"
                onClick={() => {
                  onChangeLogo('/logo.jpg');
                  setUrlInput('/logo.jpg');
                  setImageLoadError(false);
                  setObjectFit('contain');
                  setZoomScale(100);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Official Logo</span>
              </button>
            </div>

            {/* Visual Preview Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Stage (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                {/* Canvas Container with selectable background */}
                <div
                  className={`w-full aspect-square max-w-[280px] rounded-2xl p-6 flex items-center justify-center relative shadow-inner border transition-all ${
                    previewBg === 'slate'
                      ? 'bg-slate-900 border-slate-800'
                      : previewBg === 'white'
                      ? 'bg-white border-slate-300'
                      : previewBg === 'red'
                      ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border-blue-800'
                      : 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 border-slate-800'
                  }`}
                >
                  {/* The Logo Frame */}
                  <div
                    className={`relative overflow-hidden transition-all shadow-2xl flex items-center justify-center ${
                      frameShape === 'circle'
                        ? 'w-48 h-48 rounded-full border-4 border-amber-400 bg-white p-2 shadow-xl shadow-black/40'
                        : frameShape === 'shield'
                        ? 'w-48 h-52 rounded-2xl border-4 border-blue-500 bg-white p-2 shadow-xl shadow-black/40'
                        : 'w-48 h-48 rounded-xl border-4 border-blue-600 bg-white p-2 shadow-xl shadow-black/40'
                    }`}
                  >
                    <img
                      src={effectiveLogoUrl}
                      alt="Concerned Citizens Official Logo"
                      style={{
                        transform: `scale(${zoomScale / 100})`,
                        transition: 'transform 0.15s ease-out',
                      }}
                      className={`w-full h-full ${
                        objectFit === 'contain' ? 'object-contain' : 'object-cover'
                      } ${frameShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                      referrerPolicy="no-referrer"
                      onError={() => setImageLoadError(true)}
                      onLoad={() => setImageLoadError(false)}
                    />

                    {imageLoadError && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mb-1" />
                        <span className="text-[11px] font-bold text-white">Image Failed to Load</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Check image URL or upload a file
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Background & Frame Shape Selectors */}
                <div className="w-full max-w-[280px] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold">Canvas Backing:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewBg('slate')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          previewBg === 'slate'
                            ? 'bg-slate-800 text-white border border-slate-600'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewBg('white')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          previewBg === 'white'
                            ? 'bg-slate-200 text-slate-900 border border-slate-300'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        White
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewBg('red')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          previewBg === 'red'
                            ? 'bg-blue-700 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Navy
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewBg('checker')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          previewBg === 'checker'
                            ? 'bg-slate-800 text-amber-300 border border-amber-600/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold">Frame Shape:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFrameShape('circle')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          frameShape === 'circle'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white bg-slate-900'
                        }`}
                      >
                        Circle Seal
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrameShape('shield')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          frameShape === 'shield'
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-400 hover:text-white bg-slate-900'
                        }`}
                      >
                        Shield
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrameShape('square')}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          frameShape === 'square'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white bg-slate-900'
                        }`}
                      >
                        Square
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sizing, Fitting & Real-life Simulation (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Fitting and Scale Controls */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      Display & Fitting Options
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {objectFit === 'contain' ? '✓ Full Logo Visible (No crop)' : 'Cover (Fill Frame)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setObjectFit('contain')}
                      className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2 ${
                        objectFit === 'contain'
                          ? 'bg-blue-950/60 border-blue-600 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Minimize2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-xs text-white">Contain (Recommended)</strong>
                        <span className="text-[10px] text-slate-400 leading-tight block">
                          Prevents circular cropping, keeping all text & edges visible
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setObjectFit('cover')}
                      className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2 ${
                        objectFit === 'cover'
                          ? 'bg-blue-950/60 border-blue-600 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Maximize2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-xs text-white">Cover (Full Bleed)</strong>
                        <span className="text-[10px] text-slate-400 leading-tight block">
                          Fills the entire circular shape edge-to-edge
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Zoom Scale Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-[11px] font-semibold">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                        Badge Scale / Padding:
                      </span>
                      <span className="font-mono text-amber-400 font-bold">{zoomScale}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="range"
                        min="60"
                        max="140"
                        step="5"
                        value={zoomScale}
                        onChange={(e) => setZoomScale(Number(e.target.value))}
                        className="flex-1 accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                      <button
                        type="button"
                        onClick={() => setZoomScale(100)}
                        className="text-[10px] text-slate-400 hover:text-white underline ml-1"
                      >
                        100%
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-Life Header Simulation */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      Actual Portal Header Simulation
                    </span>
                    <span className="text-[10px] text-slate-400">Desktop & Mobile Navigation</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-amber-400 shadow-md shrink-0 flex items-center justify-center p-0.5">
                        <img
                          src={effectiveLogoUrl}
                          alt="Header Preview"
                          style={{ transform: `scale(${zoomScale / 100})` }}
                          className={`w-full h-full ${
                            objectFit === 'contain' ? 'object-contain' : 'object-cover'
                          } rounded-full`}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white tracking-tight leading-tight">
                            CONCERNED CITIZENS
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 border border-red-600/40">
                            TASK TEAM
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400 font-bold tracking-wide leading-none mt-0.5">
                          OF PE METRO • GQEBERHA
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Site Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload, Paste & URL Input Controls */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              Upload or Replace Logo Image
            </h3>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-900/40 scale-[1.01]'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoFileChange}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Drop logo file here, or{' '}
                    <span className="text-blue-400 underline">browse from your device</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports high-resolution PNG, JPG, WebP, and SVG vector logos (auto-compressed & stored safely)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950/60 transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Picture from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePasteFromClipboard();
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Paste from Clipboard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Or Enter External Image Link / Relative Asset Path
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyUrl();
                      }
                    }}
                    placeholder="/logo.jpg, /logo.svg, or https://..."
                    className="w-full pl-3 pr-20 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Apply Link</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Current active source:{' '}
                <span className="text-amber-300 font-mono break-all">
                  {effectiveLogoUrl.startsWith('data:')
                    ? 'Custom Uploaded Device File (Embedded Base64)'
                    : effectiveLogoUrl}
                </span>
              </p>
            </div>

            {/* Preset Logos Library */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Concerned Citizens Preset Emblems
                </h4>
                <span className="text-[11px] text-slate-400">1-click select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = effectiveLogoUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        onChangeLogo(preset.url);
                        setUrlInput(preset.url);
                        setImageLoadError(false);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-amber-400 p-0.5 shrink-0 flex items-center justify-center shadow-md">
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-contain rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-white truncate">{preset.title}</h5>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</p>
                        <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {preset.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Founder & Convener Photo Inspector */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                Founder Portrait Inspector
              </span>
              <h3 className="text-base font-black text-white tracking-tight mt-1">
                Founder & Chief Convener Photo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Displayed in the homepage Founder Creed banner, Executive Leadership directory, and official statements
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onChangeFounderImage) {
                  onChangeFounderImage('/logo.jpg');
                }
                setFounderUrlInput('/logo.jpg');
                setFounderLoadError(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Use Movement Logo as Avatar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Founder Avatar Preview */}
            <div className="sm:col-span-4 flex flex-col items-center space-y-3">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-amber-500 bg-slate-900 shadow-2xl p-1 group">
                <img
                  src={effectiveFounderUrl}
                  alt="Founder of Concerned Citizens of PE Metro"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={() => setFounderLoadError(true)}
                  onLoad={() => setFounderLoadError(false)}
                />
                {founderLoadError && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs font-bold text-white">Image Failed</span>
                  </div>
                )}
              </div>

              <span className="text-xs font-bold text-white text-center">
                Rizaan Brown
                <span className="block text-[10px] text-amber-400 font-semibold">
                  Founder & Chief Convener
                </span>
              </span>
            </div>

            {/* Founder Upload & Inputs */}
            <div className="sm:col-span-8 space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={founderFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFounderFileChange}
                  />

                  <button
                    type="button"
                    onClick={() => founderFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/60 transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Founder Photo from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Paste Clipboard</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Or Founder Photo Web URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={founderUrlInput}
                      onChange={(e) => setFounderUrlInput(e.target.value)}
                      placeholder="/logo.jpg or https://..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyFounderUrl}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Founder Avatars */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Select Preset Portrait / Crest:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_FOUNDER_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (onChangeFounderImage) {
                          onChangeFounderImage(preset.url);
                        }
                        setFounderUrlInput(preset.url);
                        setFounderLoadError(false);
                      }}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center gap-2 text-left transition"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-8 h-8 rounded-full object-cover bg-white p-0.5 border border-slate-700 shrink-0"
                      />
                      <span className="text-xs text-slate-300 truncate font-semibold">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
