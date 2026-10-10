"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { studentApi } from "../../lib/api/student";
import NetworkFeed from "../feed/NetworkFeed";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  ArrowRight,
  FileText
} from "lucide-react";

export default function StudentDashboardView({ user }) {
  const [student, setStudent] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    studentApi
      .getMyProfile()
      .then((data) => {
        if (data) setStudent(data);
      })
      .catch((err) => {
        console.warn("Could not load student profile:", err);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, []);

  const studentName = student?.name || user?.name || user?.email?.split("@")[0] || "COMSATS Student";
  const regNo = student?.registration_no || "FA21-BCS-042";
  const hasCv = Boolean(student?.cv);
  const department = student?.department || "Department of Computer Science";

  return (
    <div className="space-y-8 pb-12">
      {/* Sleek, Compact Student Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041C2C] via-[#0B3B60] to-[#00A8B5] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        {/* Real Campus Landmark Ambient Background */}
        <img
          src="/comsats-hero.jpg"
          alt="COMSATS Campus"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20 pointer-events-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041C2C]/90 via-[#0B3B60]/85 to-[#00A8B5]/80 pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38E1ED_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center shrink-0 border border-white/20 overflow-hidden">
              {student?.avatar_url ? (
                <img src={student.avatar_url} alt={studentName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full bg-[#041C2C] text-[#38E1ED] flex items-center justify-center font-extrabold text-2xl rounded-xl">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00A8B5]/25 text-[#38E1ED] border border-[#00A8B5]/40 backdrop-blur-md uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enrolled Scholar
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/90">
                  <GraduationCap className="w-3.5 h-3.5 text-[#38E1ED]" /> {regNo}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {studentName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 flex items-center gap-2">
                <span>COMSATS University Islamabad</span>
                <span className="text-slate-400">•</span>
                <span>{department}</span>
              </p>
            </div>
          </div>

          {/* Quick Profile Action Card */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 w-full md:w-auto">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#38E1ED] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs min-w-0 pr-2">
                <p className="font-bold text-white leading-tight">
                  {hasCv ? "CV Active" : "No CV Uploaded"}
                </p>
                <p className="text-[11px] text-slate-300">
                  {hasCv ? "Ready for recruiters" : "Upload resume"}
                </p>
              </div>
              <Link
                href="/dashboard/student/profile"
                className="ml-auto inline-flex items-center gap-1 bg-[#00A8B5] hover:bg-[#00929D] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wide Community Network Feed */}
      <NetworkFeed user={user} role="student" />
    </div>
  );
}
