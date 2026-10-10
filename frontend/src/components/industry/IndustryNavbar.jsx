"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { notificationsApi } from "../../lib/api/notifications";
import { GraduationCap, Bell, LogOut, Building2 } from "lucide-react";

export function IndustryNavbar() {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationsApi.getUnreadCount();
        setUnreadCount(res.unread_count || 0);
      } catch {
        // Silently handle if unauthenticated or network error
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#041C2C] border-b border-[#00A8B5]/30 text-white shadow-xl">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/industry" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
              <img src="/cui-logo.png" alt="COMSATS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-tight">
                COMSATS University
              </span>
              <span className="text-[10px] font-semibold text-[#00A8B5] tracking-wider uppercase">
                Corporate & Industry Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell with Badge */}
          <Link
            href="/dashboard/industry/notifications"
            className="relative p-2 text-[#94A3B8] hover:text-[#00A8B5] hover:bg-white/10 rounded-full transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#DC2626] rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#1E3A8A]">
            <div className="w-8 h-8 rounded-full bg-[#00A8B5]/20 border border-[#00A8B5]/50 flex items-center justify-center text-[#00A8B5]">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[150px]">
                {user?.email || "Employer"}
              </span>
              <span className="text-[10px] text-[#00A8B5] block">Industry Partner</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-white/10 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default IndustryNavbar;
