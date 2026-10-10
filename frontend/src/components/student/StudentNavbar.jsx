"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { GraduationCap, LogOut, User, ShieldCheck } from "lucide-react";

export function StudentNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#041C2C] border-b border-[#00A8B5]/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard/student" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
                <img src="/cui-logo.png" alt="COMSATS Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white uppercase font-serif">
                  COMSATS University
                </span>
                <span className="text-[11px] text-[#00A8B5] font-semibold tracking-wide uppercase">
                  Student & Career Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Student Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-right">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white flex items-center justify-end gap-1">
                  {user?.registration_no || user?.name || user?.email || "Student"}
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                </span>
                <span className="text-[10px] text-[#00A8B5] font-mono">
                  {user?.registration_no ? `Reg: ${user.registration_no}` : "Student Scholar"}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#00A8B5]/20 border border-[#00A8B5]/50 flex items-center justify-center text-[#00A8B5] text-xs font-bold shadow-inner">
                {user?.name
                  ? user.name.slice(0, 2).toUpperCase()
                  : user?.registration_no?.slice(0, 2).toUpperCase() || <User className="w-4 h-4" />}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentNavbar;
