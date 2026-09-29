import React, { useState } from 'react';
import {
  Image as ImageIcon,
  MapPin,
  Calendar,
  X,
  Eye,
  Filter,
  PlusCircle,
  FolderUp,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { GalleryItem } from '../types';
import { ImageFolderUploader } from './ImageFolderUploader';

export const GalleryView: React.FC = () => {
  const { gallery, createGalleryItem, deleteGalleryItem } = useApp();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<
    'soup-kitchen' | 'water-relief' | 'cleanup' | 'patrol' | 'school-outreach'
  >('soup-kitchen');
  const [uploadLocation, setUploadLocation] = useState('Bethelsdorp, PE Metro');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      alert('Please upload at least one photo or folder of pictures.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    uploadedImages.forEach((img, idx) => {
      const suffix = uploadedImages.length > 1 ? ` (Part ${idx + 1})` : '';
      createGalleryItem({
        title: (uploadTitle.trim() || 'Community Action Photo') + suffix,
        category: uploadCategory,
        image_url: img,
        description: uploadDescription.trim() || 'Photographic evidence from community operations.',
        date: todayDate,
        location: uploadLocation.trim() || 'Nelson Mandela Bay',
      });
    });

    setUploadModalOpen(false);
    setUploadTitle('');
    setUploadDescription('');
    setUploadedImages([]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this photo from the gallery?')) {
      deleteGalleryItem(id);
      if (activeImage?.id === id) {
        setActiveImage(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Field Evidence & Community Moments
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Photo Gallery: Community Relief in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real photos capturing our volunteers, soup kitchens, cleanups, water tankers, and patrols across Nelson Mandela Bay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <FolderUp className="w-4 h-4" />
            <span>Upload Photos / Folder</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Photos' },
          { id: 'soup-kitchen', label: 'Soup Kitchens' },
          { id: 'water-relief', label: 'Water Relief' },
          { id: 'cleanup', label: 'Cleanups' },
          { id: 'patrol', label: 'Patrols' },
          { id: 'school-outreach', label: 'School Outreach' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition transform hover:-translate-y-1 shadow-md"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                {item.category.replace('-', ' ')}
              </span>

              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition opacity-0 group-hover:opacity-100"
                  title="Delete from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <h4 className="text-white font-bold text-sm leading-snug group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    {item.location}
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.image_url}
                alt={activeImage.title}
                className="max-h-[70vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 space-y-2 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-red-400">
                  {activeImage.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{activeImage.date}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(activeImage.id, e)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">{activeImage.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{activeImage.description}</p>
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{activeImage.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photos to Gallery Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Upload Photos to Gallery</h3>
                <p className="text-xs text-slate-400">
                  Add photos directly from your phone, computer, or an entire folder. No URLs needed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Photo / Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bethelsdorp Warm Soup Kitchen & Hamper Distribution"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="soup-kitchen">Soup Kitchens & Relief</option>
                    <option value="water-relief">Water Relief & Tankers</option>
                    <option value="cleanup">Cleanups & Waste Clearance</option>
                    <option value="patrol">Safety & Patrols</option>
                    <option value="school-outreach">School Outreach & Youth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bethelsdorp Ext 31, PE Metro"
                    value={uploadLocation}
                    onChange={(e) => setUploadLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the initiative or activity in the photos."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs resize-none placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Image & Folder Uploader */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <ImageFolderUploader
                  images={uploadedImages}
                  onChange={setUploadedImages}
                  maxImages={30}
                  allowFolder={true}
                  label="Upload Photos or Album Folder (No URL needed)"
                  helperText="Select photos or an entire folder from your device. They will be compressed and added to the gallery."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow-md shadow-blue-900/30"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
