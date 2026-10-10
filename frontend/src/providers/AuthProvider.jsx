"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "../lib/auth/token";
import { authApi } from "../lib/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate auth state from localStorage on load
  useEffect(() => {
    const savedToken = tokenStorage.getAccessToken();
    const savedRole = tokenStorage.getUserRole();
    const savedUser = tokenStorage.getUserData();

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (tokenData, userData = {}) => {
    tokenStorage.setAccessToken(tokenData.access_token);
    tokenStorage.setRefreshToken(tokenData.refresh_token);
    tokenStorage.setUserRole(tokenData.role);
    tokenStorage.setUserData(userData);

    setToken(tokenData.access_token);
    setRole(tokenData.role);
    setUser(userData);

    // Redirect based on role
    if (tokenData.role === "industry") {
      router.push("/dashboard/industry");
    } else if (tokenData.role === "student") {
      router.push("/dashboard/student");
    } else if (tokenData.role === "alumni") {
      router.push("/dashboard/alumni");
    } else {
      router.push("/");
    }
  };

  const loginStudent = async (registration_no, password) => {
    const data = await authApi.studentLogin(registration_no, password);
    handleAuthSuccess(data, { registration_no });
    return data;
  };

  const loginUser = async (email, password) => {
    const data = await authApi.userLogin(email, password);
    handleAuthSuccess(data, { email });
    return data;
  };

  const logout = () => {
    tokenStorage.clearAll();
    setToken(null);
    setRole(null);
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isAuthenticated: !!token,
        loginStudent,
        loginUser,
        logout,
        handleAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
