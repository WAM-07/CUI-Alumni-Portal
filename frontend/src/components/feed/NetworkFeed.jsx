"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import {
  PenSquare,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Building2,
  Mail,
  Compass,
  Image as ImageIcon,
  Megaphone,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import postsApi from '../../lib/api/posts';
import alumniApi from '../../lib/api/alumni';
import mentorshipApi from '../../lib/api/mentorship';

export default function NetworkFeed({ user, role }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedAlumni, setRecommendedAlumni] = useState([]);
  const [connectedIds, setConnectedIds] = useState(new Set());
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchAlumni();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsApi.getFeed();
      setPosts(response.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    try {
      const data = await alumniApi.getDirectory(5);
      const currentId = user?.id || user?._id;
      const filtered = Array.isArray(data)
        ? data.filter((a) => (a.user_id || a.id) !== currentId)
        : [];
      setRecommendedAlumni(filtered.slice(0, 4));
    } catch (err) {
      console.error("Failed to load recommended alumni:", err);
    }
  };

  const handleConnect = async (targetAlumni) => {
    const targetId = targetAlumni.user_id || targetAlumni.id;
    setConnectingId(targetId);
    try {
      if (role === 'student' && targetAlumni.is_mentor) {
        await mentorshipApi.createRequest(targetId);
      }
      setConnectedIds((prev) => new Set(prev).add(targetId));
    } catch {
      // Graceful local feedback
      setConnectedIds((prev) => new Set(prev).add(targetId));
    } finally {
      setConnectingId(null);
    }
  };

  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const canCreatePost = ['alumni', 'industry', 'admin'].includes(role);

  // Role shortcuts config
  const getShortcuts = () => {
    switch (role) {
      case 'student':
        return [
          { label: 'Job & Internship Board', href: '/dashboard/student/posts', icon: Briefcase, badge: 'Active' },
          { label: 'Browse Alumni Mentors', href: '/dashboard/student/mentorship', icon: GraduationCap, badge: 'Connect' },
          { label: 'Manage Resume & Profile', href: '/dashboard/student/profile', icon: Users, badge: 'CV' },
        ];
      case 'industry':
        return [
          { label: 'Published Job Postings', href: '/dashboard/industry/posts', icon: Briefcase, badge: 'Manage' },
          { label: 'Corporate Profile Settings', href: '/dashboard/industry/profile', icon: Building2, badge: 'Verified' },
        ];
      case 'alumni':
      default:
        return [
          { label: 'Mentorship Inquiries', href: '/dashboard/alumni/mentorship', icon: GraduationCap, badge: 'Guidance' },
          { label: 'Referral & Job Board', href: '/dashboard/alumni/posts', icon: Briefcase, badge: 'Jobs' },
          { label: 'Public Alumni Profile', href: '/dashboard/alumni/profile', icon: Users, badge: 'Profile' },
        ];
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div className="w-full">
      {/* Spacious 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column (8 out of 12 columns = 66.7% width) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post Composer Card */}
          {canCreatePost ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] p-5 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-[#041C2C] to-[#00A8B5] shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#041C2C] text-white flex items-center justify-center font-extrabold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 text-left px-5 py-3 rounded-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-sm text-slate-500 hover:text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#00A8B5]/40"
                >
                  Start a post, share opportunities, or insights...
                </button>
              </div>

              {/* Action Pills */}
              <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 px-1 text-xs">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-slate-600 hover:text-[#00A8B5] hover:bg-cyan-50/50 font-semibold transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[#00A8B5]" />
                  <span>Media</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50/50 font-semibold transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Opportunity</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-slate-600 hover:text-[#D97706] hover:bg-amber-50/50 font-semibold transition-colors"
                >
                  <Megaphone className="w-4 h-4 text-[#D97706]" />
                  <span>Announcement</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#041C2C] hover:bg-[#0B3B60] text-white font-bold px-4 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  Post
                </button>
              </div>
            </div>
          ) : (
            /* Student Friendly Banner */
            <div className="bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 rounded-2xl border border-cyan-100 p-5 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#00A8B5]/10 text-[#00A8B5] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#041C2C]">COMSATS Community Feed</h3>
                  <p className="text-xs text-slate-600">
                    Stay connected with alumni insights, career opportunities, and campus announcements.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/student/mentorship"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00A8B5] hover:bg-[#00929D] shadow-xs transition-colors shrink-0"
              >
                <span>Find Mentor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Feed Stream Status Header */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A8B5] animate-pulse"></span>
              Live Community Stream
            </span>
            <span>{posts.length} {posts.length === 1 ? 'Post' : 'Posts'} Published</span>
          </div>

          {/* Feed Content */}
          {loading ? (
            /* Skeleton Loading */
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No posts in the stream yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to share career opportunities, graduation updates, or technical insights with the COMSATS community!
              </p>
              {canCreatePost && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A8B5] hover:bg-[#00929D] text-white text-xs font-bold shadow-md transition-all"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Publish First Post</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column (4 out of 12 columns = 33.3% width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Expand Network / Alumni Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.05)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#00A8B5]" />
                <span>Alumni & Mentors</span>
              </div>
              <Link
                href={role === 'student' ? '/dashboard/student/mentorship' : '/dashboard/alumni'}
                className="text-[11px] font-bold text-[#00A8B5] hover:underline"
              >
                Browse All
              </Link>
            </div>

            <div className="space-y-3.5 pt-1">
              {recommendedAlumni.length > 0 ? (
                recommendedAlumni.map((alum) => {
                  const targetId = alum.user_id || alum.id;
                  const isConnected = connectedIds.has(targetId);
                  const isConnecting = connectingId === targetId;

                  return (
                    <div key={targetId} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#041C2C] to-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs">
                          {alum.avatar_url ? (
                            <img src={alum.avatar_url} alt={alum.name} className="w-full h-full object-cover" />
                          ) : (
                            (alum.name || alum.email || 'A').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {alum.name || alum.email?.split('@')[0]}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {alum.current_position || alum.department || 'COMSATS Graduate'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConnect(alum)}
                        disabled={isConnected || isConnecting}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                          isConnected
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-default flex items-center gap-1'
                            : 'bg-white hover:bg-[#00A8B5] hover:text-white text-[#00A8B5] border border-[#00A8B5]/40 hover:border-[#00A8B5]'
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>Requested</span>
                          </>
                        ) : isConnecting ? (
                          '...'
                        ) : (
                          'Connect'
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-2">No recommendations available right now.</p>
              )}
            </div>
          </div>

          {/* Widget 2: Role-Tailored Portal Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.05)] p-6 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="space-y-2 pt-1">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-[#041C2C] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#041C2C] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#00A8B5]/10 group-hover:text-[#00A8B5] transition-colors">
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Widget 3: Placement & Career Liaison */}
          <div className="bg-gradient-to-br from-[#041C2C] to-[#0B3B60] text-white rounded-2xl p-6 shadow-md border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#38E1ED]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#38E1ED]">
                Career Development Cell
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official liaison for campus placements, internship recruitment, and alumni networking events.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#38E1ED]" />
                cdc@comsats.edu.pk
              </span>
              <span className="text-[11px] text-slate-400">CUI Islamabad</span>
            </div>
          </div>

        </div>

      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
