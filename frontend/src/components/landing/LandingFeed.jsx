"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";
import { postsApi } from "../../lib/api/posts";
import PostCard from "../feed/PostCard";
import { Spinner } from "../ui/Spinner";

export function LandingFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await postsApi.getFeed();
        setPosts(data.posts?.slice(0, 3) || data.slice?.(0, 3) || []);
      } catch (err) {
        console.error("Failed to load public feed", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-[#64748B]">Loading latest community updates...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-[#F1F5F9] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-sm font-bold uppercase tracking-widest text-[#00A8B5] flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Network Feed
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#041C2C] tracking-tight font-serif">
              Latest from the Community
            </h2>
            <p className="text-sm text-[#64748B] max-w-2xl">
              Public achievements, announcements, and job opportunities shared by verified members.
            </p>
          </div>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#041C2C] hover:text-[#00A8B5] transition-colors whitespace-nowrap"
          >
            <span>View All Activity</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="h-full">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingFeed;
