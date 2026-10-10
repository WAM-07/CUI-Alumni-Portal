import apiClient from "./client";

export const studentApi = {
  getMyProfile: () => {
    return apiClient.get("/student/me");
  },

  updateAdditionalInfo: (formData) => {
    return apiClient.patch("/student/additional-info", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/student/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadCover: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/student/cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default studentApi;
