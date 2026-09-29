import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
  PlusCircle,
  Clock,
  User,
  CheckCircle2,
  MapPin,
  X,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  FolderUp,
  Upload,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FacebookImporterModal } from './FacebookImporterModal';
import { ImageFolderUploader } from './ImageFolderUploader';

export const MemberUpdatesView: React.FC = () => {
  const { posts, likePost, addComment, createPost, settings } = useApp();
  const { currentUser } = useAuth();

  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [fbModalOpen, setFbModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'feedback' | 'alert' | 'event' | 'complaint'>('feedback');
  const [postArea, setPostArea] = useState('Bethelsdorp');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  // Lightbox modal state for viewing full photos
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  // Active comment inputs keyed by postId
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthor, setCommentAuthor] = useState(currentUser?.name || '');

  const openNewPost = (withFolderMode = false) => {
    setNewPostModalOpen(true);
    if (withFolderMode && !postTitle) {
      setPostTitle('Community Field Photos & Update');
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    createPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      author: currentUser?.name || 'Concerned Citizen',
      category: postCategory,
      area: postArea,
      images: attachedImages,
    });

    setNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    setAttachedImages([]);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const author = currentUser?.name || commentAuthor.trim() || 'Resident';
    addComment(postId, author, text);

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Citizen Voice & Community Wall
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Member & Community Updates
          </h2>
          <p className="text-xs text-slate-300">
            Real-time field dispatches, food drive photo albums, and neighborhood notifications from verified PE Metro residents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Upload Folder / Photos Action Button */}
          <button
            type="button"
            onClick={() => openNewPost(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 transition flex items-center gap-2"
            title="Upload multiple photos or an entire folder of pictures"
          >
            <FolderUp className="w-4 h-4 text-slate-950" />
            <span>Upload Images Folder</span>
          </button>

          <button
            type="button"
            onClick={() => openNewPost(false)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Post</span>
          </button>

          <button
            type="button"
            onClick={() => setFbModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-600/40 font-bold text-xs shadow transition flex items-center gap-2"
            title="Import updates from Facebook Page"
          >
            <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="hidden sm:inline">Import from Facebook</span>
            <span className="sm:hidden">FB Sync</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6 shadow-md"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{post.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      {post.area}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {post.source === 'facebook' && (
                  <a
                    href={post.facebook_post_url || settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Imported from Facebook</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                )}
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Attached Photo(s) / Photo Album Grid */}
            {post.images && post.images.length > 0 && (
              <div className="space-y-2">
                {post.images.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo Album ({post.images.length} pictures)</span>
                  </div>
                )}

                <div
                  className={`rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ${
                    post.images.length === 1
                      ? 'max-h-96'
                      : post.images.length === 2
                      ? 'grid grid-cols-2 gap-1.5 max-h-96'
                      : post.images.length === 3
                      ? 'grid grid-cols-3 gap-1.5 max-h-80'
                      : 'grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-96'
                  }`}
                >
                  {post.images.slice(0, 4).map((img, i) => {
                    const isLastOfFour = i === 3 && post.images.length > 4;
                    const remainingCount = post.images.length - 4;

                    return (
                      <div
                        key={i}
                        onClick={() => setLightbox({ images: post.images, index: i })}
                        className="relative group cursor-pointer overflow-hidden aspect-video sm:aspect-square bg-slate-900"
                      >
                        <img
                          src={img}
                          alt={`Post attachment ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />

                        {/* Hover Overlay with expand icon */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>

                        {/* Overflow "+X more" overlay on 4th image */}
                        {isLastOfFour && (
                          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white font-extrabold text-sm sm:text-base cursor-pointer">
                            <span>+{remainingCount}</span>
                            <span className="text-[10px] font-medium text-slate-300">more photos</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-red-400 transition"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20 hover:fill-red-500 transition" />
                  <span className="font-semibold text-slate-200">{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-200">{post.comments_count}</span>
                  <span className="hidden sm:inline">Comments</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Post link copied to clipboard!');
                }}
                className="flex items-center gap-1 hover:text-slate-200 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Comments Thread */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-2.5">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-[11px]">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-400">{comment.created_at}</span>
                      </div>
                      <p className="text-slate-300 text-xs">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Write a message of support or update..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendComment(post.id);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendComment(post.id)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shrink-0"
                  title="Send Comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal with Direct Image & Folder Upload */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Create Community Post</h3>
                <p className="text-xs text-slate-400">
                  Publish updates, food relief drives, alerts, and photo albums to the Live Wall.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewPostModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soup kitchen distribution completed in Helenvale"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="feedback">Community Feedback</option>
                    <option value="event">Community Event / Relief</option>
                    <option value="alert">Safety & Neighborhood</option>
                    <option value="complaint">Service Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Suburb / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bethelsdorp, Helenvale"
                    value={postArea}
                    onChange={(e) => setPostArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Post Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share what happened, who attended, and any follow-up needed."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs resize-none placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* DIRECT PHOTO & FOLDER UPLOADER - NO URL REQUIRED */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <ImageFolderUploader
                  images={attachedImages}
                  onChange={setAttachedImages}
                  maxImages={30}
                  allowFolder={true}
                  label="Attach Photos or Folder (No URL required)"
                  helperText="Select photos from your device, or choose 'Upload Images Folder' to pick an entire album folder directly."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow-md shadow-blue-900/30"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full-Screen Photo Viewing */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-0 right-0 -mt-10 sm:-mt-12 text-white/80 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={lightbox.images[lightbox.index]}
                alt={`Photo ${lightbox.index + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />

              {/* Prev Button */}
              {lightbox.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index - 1 + prev.images.length) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {lightbox.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index + 1) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Footer Counter */}
            {lightbox.images.length > 1 && (
              <div className="mt-3 text-xs text-slate-300 font-medium">
                Photo {lightbox.index + 1} of {lightbox.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facebook Importer & Sync Modal */}
      <FacebookImporterModal
        isOpen={fbModalOpen}
        onClose={() => setFbModalOpen(false)}
        defaultDestination="post"
      />
    </div>
  );
};
