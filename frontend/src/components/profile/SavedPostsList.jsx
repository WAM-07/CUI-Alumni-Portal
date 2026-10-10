"use client";

import React, { useState, useEffect } from "react";
import { postsApi } from "../../lib/api/posts";
import PostCard from "../feed/PostCard";
import { Spinner } from "../ui/Spinner";
import { Bookmark, FileText } from "lucide-react";

export function SavedPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const data = await postsApi.getSavedPosts();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-[#64748B]">Loading saved posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-[#E2E8F0]">
          <Bookmark className="w-5 h-5 text-[#94A3B8]" />
        </div>
        <h3 className="text-base font-bold text-[#0F172A] mb-1">No Saved Posts</h3>
        <p className="text-sm text-[#64748B] max-w-sm">
          Posts you save from the community feed will appear here for easy reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={{ ...post, is_saved_by_me: true }} />
      ))}
    </div>
  );
}

export default SavedPostsList;
