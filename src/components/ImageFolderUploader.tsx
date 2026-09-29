import React, { useRef, useState } from 'react';
import {
  Upload,
  FolderUp,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { processImageFiles } from '../utils/imageUpload';

interface ImageFolderUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  allowFolder?: boolean;
}

export const ImageFolderUploader: React.FC<ImageFolderUploaderProps> = ({
  images,
  onChange,
  maxImages = 20,
  label = 'Attached Photos',
  helperText = 'Upload pictures from your phone/computer or select an entire folder of photos. No URLs needed.',
  allowFolder = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setErrorMsg(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: fileList.length });

    try {
      const processed = await processImageFiles(fileList, (current, total) => {
        setProgress({ current, total });
      });

      if (processed.length === 0) {
        setErrorMsg('No valid image files found in the selection.');
      } else {
        const combined = [...images, ...processed].slice(0, maxImages);
        onChange(combined);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing uploaded images.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-slate-300 font-bold text-xs">
            {label}{' '}
            {images.length > 0 && (
              <span className="text-amber-400 font-normal">
                ({images.length} photo{images.length === 1 ? '' : 's'})
              </span>
            )}
          </label>
          {images.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] text-red-400 hover:text-red-300 font-medium underline"
            >
              Remove All
            </button>
          )}
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {allowFolder && (
        <input
          type="file"
          ref={folderInputRef}
          multiple
          {...{ webkitdirectory: '', directory: '' }}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}

      {/* Dropzone & Action Buttons */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-4 text-center transition-all ${
          isDragging
            ? 'border-red-500 bg-red-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-slate-600 bg-slate-950/60'
        }`}
      >
        {isProcessing ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-xs text-white font-medium">
              Optimizing and processing images...
            </p>
            {progress && (
              <p className="text-[11px] text-slate-400">
                {progress.current} of {progress.total} processed
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>

              {allowFolder && (
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs shadow-sm transition"
                  title="Select an entire folder from your computer to upload all pictures inside"
                >
                  <FolderUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Images Folder</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              {helperText || 'Drag & drop photos or a folder here directly from your computer or phone.'}
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden aspect-square bg-slate-900 border border-slate-700 shadow"
              >
                <img
                  src={img}
                  alt={`Upload preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white opacity-80 group-hover:opacity-100 transition shadow"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5">
                  #{idx + 1}
                </div>
              </div>
            ))}

            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg aspect-square border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/40 flex flex-col items-center justify-center text-slate-400 hover:text-white transition"
                title="Add more photos"
              >
                <Plus className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Add More</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
