'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PostCard from '../../components/feed/PostCard';
import CreatePostModal from '../../components/feed/CreatePostModal';
import { PenSquare, Info } from 'lucide-react';
import postsApi from '../../lib/api/posts';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
    
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsApi.getFeed();
      setPosts(response);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const canCreatePost = ['alumni', 'industry', 'admin'].includes(userRole);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Feed</h1>
            <p className="text-gray-600">
              Stay updated with the latest news, announcements, and opportunities from the COMSATS community.
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Sign in to access Portal Network updates</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You are currently viewing the public feed. Log in to your portal account to see exclusive network updates from alumni, industry partners, and the university.
                </p>
              </div>
            </div>
          )}

          {canCreatePost && (
            <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <span className="text-gray-500 font-medium">Have something to share with the community?</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                <PenSquare className="h-5 w-5" />
                <span>Create Post</span>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <Info className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="text-gray-500 mt-2">
                Check back later for updates from the community.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
      
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
