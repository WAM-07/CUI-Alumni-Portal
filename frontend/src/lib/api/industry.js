import apiClient from "./client";

export const industryApi = {
  // Company Profile
  getProfile: () => {
    return apiClient.get("/industry/profile/");
  },

  updateProfile: (data) => {
    return apiClient.put("/industry/profile/", data);
  },

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/industry/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadCover: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/industry/profile/cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Job Postings
  getJobs: () => {
    return apiClient.get("/industry/jobs/");
  },
  
  getAllJobs: () => {
    return apiClient.get("/industry/jobs/all");
  },

  applyToJob: (jobId, data = {}) => {
    return apiClient.post(`/industry/jobs/${jobId}/apply`, data);
  },

  createJob: (data) => {
    return apiClient.post("/industry/jobs/", data);
  },

  updateJob: (jobId, data) => {
    return apiClient.put(`/industry/jobs/${jobId}`, data);
  },

  deleteJob: (jobId) => {
    return apiClient.delete(`/industry/jobs/${jobId}`);
  },

  // Job Applicants
  getJobApplicants: (jobId) => {
    return apiClient.get(`/industry/jobs/${jobId}/applicants`);
  },

  updateApplicantStatus: (jobId, appId, status) => {
    return apiClient.put(`/industry/jobs/${jobId}/applicants/${appId}/status`, { status });
  },

  // Dashboard Stats
  getDashboardStats: () => {
    return apiClient.get("/industry/dashboard/stats");
  },
};

export default industryApi;
