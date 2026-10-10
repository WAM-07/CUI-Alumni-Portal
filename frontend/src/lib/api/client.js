import axios from "axios";
import { tokenStorage } from "../auth/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to inject Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to format errors and handle session expiry
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "An unexpected error occurred.";

    if (error.response) {
      const { status, data } = error.response;

      if (data?.detail) {
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI Pydantic validation error array
          message = data.detail.map((err) => `${err.loc?.slice(-1)[0]}: ${err.msg}`).join(", ");
        }
      } else if (data?.message) {
        message = data.message;
      } else if (status === 401) {
        message = "Session expired or invalid credentials. Please log in again.";
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
          tokenStorage.clearAll();
          window.location.href = "/auth/login";
        }
      } else if (status === 403) {
        message = "Access forbidden. You do not have permission for this action.";
      } else if (status === 404) {
        message = "Requested resource not found.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }
    } else if (error.request) {
      message = "Cannot connect to server. Please check your network or backend service.";
    }

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default apiClient;
