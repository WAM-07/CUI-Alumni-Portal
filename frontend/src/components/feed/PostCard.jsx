"use client";

import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Bookmark,
  Heart,
  MessageSquare,
  Share2,
  Check,
  User,
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { postsApi } from '../../lib/api/posts';

const PostCard = ({ post }) => {
  const {
    id,
    title,
    content,
    is_public,
    author_name,
    author_role,
    author_subtitle,
    author_avatar,
    created_at,
    is_saved_by_me,
    media_urls,
    likes_count = 0,
    comments_count = 0,
    company_name,
    job_title,
  } = post;

  const [auth] = useState(() => {
    try {
      return {
        isAuthenticated: !!(typeof window !== "undefined" && localStorage.getItem("access_token")),
      };
    } catch {
      return { isAuthenticated: false };
    }
  });

  const [isSaved, setIsSaved] = useState(Boolean(is_saved_by_me));
  const [saving, setSaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes_count || 0);
  const [copied, setCopied] = useState(false);

  // Formatted role badges with distinct styling
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'alumni':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          label: 'Alumnus',
          icon: GraduationCap,
        };
      case 'industry':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
          label: 'Corporate Partner',
          icon: Building2,
        };
      case 'admin':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200/80',
          label: 'Faculty / Admin',
          icon: ShieldCheck,
        };
      case 'student':
      default:
        return {
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
          label: 'Student',
          icon: User,
        };
    }
  };

  const roleMeta = getRoleBadge(author_role);
  const RoleIcon = roleMeta.icon;

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';

    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? 'y ago' : 'y ago');
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? 'mo ago' : 'mo ago');
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? 'd ago' : 'd ago');
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? 'h ago' : 'h ago');
    interval = seconds / 60;
    return Math.floor(interval) + (Math.floor(interval) === 1 ? 'm ago' : 'm ago');
  };

  const handleSaveToggle = async () => {
    if (!auth.isAuthenticated) return;
    setSaving(true);
    try {
      if (isSaved) {
        await postsApi.unsavePost(id);
        setIsSaved(false);
      } else {
        await postsApi.savePost(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save post', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${title} - Shared from COMSATS Alumni Portal\n${window.location.origin}/dashboard`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Share copy error:', err);
    }
  };

  const subtitle =
    author_subtitle ||
    (job_title && company_name ? `${job_title} at ${company_name}` : null) ||
    'COMSATS University Islamabad';

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-300 p-6 flex flex-col space-y-4">
      {/* Header: Author & Audience */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-[#041C2C] via-[#0B3B60] to-[#00A8B5] shadow-xs shrink-0">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
              {author_avatar ? (
                <img
                  src={author_avatar}
                  alt={author_name || 'Author'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-extrabold text-[#041C2C]">
                  {(author_name || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                {author_name || 'Community Member'}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${roleMeta.bg}`}
              >
                <RoleIcon className="w-3 h-3" />
                {roleMeta.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
              <span className="truncate max-w-[220px] sm:max-w-xs">{subtitle}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-medium whitespace-nowrap">
                {formatTimeAgo(created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Pill */}
        <div className="shrink-0">
          {is_public ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70"
              title="Visible to public and all members"
            >
              <Globe className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Public</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200/70"
              title="Visible to authenticated COMSATS members"
            >
              <Lock className="w-3 h-3 text-[#1E3A8A]" />
              <span className="hidden sm:inline">Campus Only</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-2.5">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
          {title}
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
          {content}
        </p>

        {/* Media Gallery / Attachments */}
        {media_urls && media_urls.length > 0 && (
          <div className="mt-3.5 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 max-h-96 flex items-center justify-center">
            <img
              src={media_urls[0]}
              alt={title}
              className="max-h-96 w-full object-cover rounded-xl transition-transform duration-300 hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all duration-150 ${
              isLiked
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
            <span>{likeCount}</span>
            <span className="hidden sm:inline font-normal">{likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {/* Comment Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{comments_count}</span>
            <span className="hidden sm:inline font-normal">Comments</span>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:text-[#00A8B5] hover:bg-slate-100 transition-colors"
            title="Copy share link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline font-normal">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Bookmark / Save */}
        {auth.isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              isSaved
                ? 'text-[#00A8B5] bg-[#00A8B5]/10 hover:bg-[#00A8B5]/20 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save post for later'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        )}
      </div>
    </article>
  );
};

export default PostCard;
