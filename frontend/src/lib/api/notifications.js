import apiClient from "./client";

export const notificationsApi = {
  getNotifications: (params = {}) => {
    return apiClient.get("/industry/notifications/", { params });
  },

  getUnreadCount: () => {
    return apiClient.get("/industry/notifications/unread-count");
  },

  markAsRead: (notificationId) => {
    return apiClient.put(`/industry/notifications/${notificationId}/read`);
  },

  markAllAsRead: () => {
    return apiClient.put("/industry/notifications/read-all");
  },

  deleteNotification: (notificationId) => {
    return apiClient.delete(`/industry/notifications/${notificationId}`);
  },
};

export default notificationsApi;
