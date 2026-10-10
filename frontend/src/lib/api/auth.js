import apiClient from "./client";

export const authApi = {
  // Student SSO login with registration number
  studentLogin: (registration_no, password) => {
    return apiClient.post("/auth/login", { registration_no, password });
  },

  // Industry, Alumni, Admin login with email
  userLogin: (email, password) => {
    return apiClient.post("/auth/user/login", { email, password });
  },

  // Register new user (industry, alumni, admin)
  signup: (email, password, confirm_password, role) => {
    return apiClient.post("/auth/signup", { email, password, confirm_password, role });
  },

  // Verify email using 6-digit OTP
  verifyEmail: (email, otp) => {
    return apiClient.post("/auth/verify-email", { email, otp });
  },

  // Refresh access token
  refreshToken: (refresh_token) => {
    return apiClient.post("/auth/refresh", { refresh_token });
  },
};

export default authApi;
