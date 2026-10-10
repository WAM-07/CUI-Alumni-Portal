import apiClient from "./client";

export const alumniApi = {
  getMyProfile: () => apiClient.get("/alumni/profile/"),
  updateProfile: (data) => apiClient.put("/alumni/profile/", data),
  
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/alumni/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadCover: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/alumni/profile/cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getDirectory: (limit = 5) => {
    return apiClient.get(`/alumni/profile/directory?limit=${limit}`);
  },
  getDashboardStats: () => {
    return apiClient.get("/alumni/dashboard/stats");
  },
};

export default alumniApi;
