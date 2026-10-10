import apiClient from "./client";
import { tokenStorage } from "../auth/token";

export const postsApi = {
  // Get posts (public for guests, all for authenticated)
  getFeed: () => {
    const hasToken = !!tokenStorage.getAccessToken();
    return apiClient.get(hasToken ? "/feed/" : "/feed/public");
  },

  // Create a new post (alumni, industry, admin only)
  createPost: (postData) => {
    // postData should be { title, content, visibility }
    const role = tokenStorage.getUserRole();
    if (!role) throw new Error("Must be logged in to create a post.");
    return apiClient.post(`/${role}/posts/`, postData);
  },

  // Upload media for a post
  uploadMedia: (file) => {
    const role = tokenStorage.getUserRole() || "alumni";
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post(`/${role}/posts/upload-media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Save/Unsave post for authenticated user
  savePost: (postId) => apiClient.post(`/feed/${postId}/save`),
  unsavePost: (postId) => apiClient.delete(`/feed/${postId}/save`),
  getSavedPosts: () => apiClient.get("/feed/saved"),
};

export default postsApi;
