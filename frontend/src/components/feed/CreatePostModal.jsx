import React, { useState, useRef } from 'react';
import { X, Globe, Lock, Image as ImageIcon, Trash2 } from 'lucide-react';
import postsApi from '../../lib/api/posts';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    
    setIsLoading(true);
    try {
      const is_public = visibility === 'public';
      let media_urls = [];

      if (selectedFile) {
        try {
          const uploadRes = await postsApi.uploadMedia(selectedFile);
          if (uploadRes && uploadRes.file_url) {
            media_urls.push(uploadRes.file_url);
          }
        } catch (uploadErr) {
          console.warn("Failed to upload image:", uploadErr);
        }
      }

      const response = await postsApi.createPost({
        title,
        content,
        is_public,
        media_urls,
      });
      onPostCreated(response);
      setTitle('');
      setContent('');
      setVisibility('public');
      removeFile();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Hiring Software Engineers, Alumni Meetup 2026..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none"
              maxLength={200}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share with the community?"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none resize-none"
            />
          </div>

          {/* Photo Attachment Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Attach Photo (Optional)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-56 flex items-center justify-center group">
                <img src={previewUrl} alt="Preview" className="max-h-56 w-auto object-contain" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 font-medium"
              >
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <span>Upload a picture with your post</span>
              </button>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Visibility Prompt</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`p-4 border rounded-xl flex flex-col items-center text-center transition-all ${
                  visibility === 'public'
                    ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                    : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                }`}
              >
                <Globe className={`h-8 w-8 mb-2 ${visibility === 'public' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${visibility === 'public' ? 'text-green-900' : 'text-gray-700'}`}>Public Post</span>
                <span className="text-xs text-gray-500 mt-1">Visible to everyone on the internet</span>
              </button>
              
              <button
                type="button"
                onClick={() => setVisibility('network')}
                className={`p-4 border rounded-xl flex flex-col items-center text-center transition-all ${
                  visibility === 'network'
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                    : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <Lock className={`h-8 w-8 mb-2 ${visibility === 'network' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${visibility === 'network' ? 'text-indigo-900' : 'text-gray-700'}`}>Network Post</span>
                <span className="text-xs text-gray-500 mt-1">Exclusive to university portal community</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center"
            >
              {isLoading ? 'Posting...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
