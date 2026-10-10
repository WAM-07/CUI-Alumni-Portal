const ACCESS_TOKEN_KEY = "alumni_access_token";
const REFRESH_TOKEN_KEY = "alumni_refresh_token";
const USER_ROLE_KEY = "alumni_user_role";
const USER_DATA_KEY = "alumni_user_data";

export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUserRole: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },

  setUserRole: (role) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  getUserData: () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_DATA_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUserData: (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },
};
