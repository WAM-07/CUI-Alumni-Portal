"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { industryApi } from "../../lib/api/industry";
import NetworkFeed from "../feed/NetworkFeed";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Plus,
  Briefcase
} from "lucide-react";

export default function IndustryDashboardView({ user }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      industryApi.getProfile().catch(() => null),
      industryApi.getDashboardStats().catch(() => null),
    ]).then(([profileRes, statsRes]) => {
      if (profileRes) setProfile(profileRes);
      if (statsRes) setStats(statsRes);
    });
  }, []);

  const companyName = profile?.company_name || user?.name || "Corporate Partner";
  const industryType = profile?.industry_type || "Technology & Software Partner";
  const location = profile?.location || "Islamabad, Pakistan";
  const activeJobs = stats?.active_jobs ?? stats?.total_jobs ?? 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Corporate Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041C2C] via-[#0F2942] to-[#1E3A8A] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <img
          src="/comsats-hero.jpg"
          alt="COMSATS Campus"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20 pointer-events-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041C2C]/90 via-[#0F2942]/85 to-[#1E3A8A]/80 pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38E1ED_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#00A8B5]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0 border border-white/20">
              {profile?.logo_url ? (
                <img src={profile.logo_url} alt={companyName} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <Building2 className="w-9 h-9 text-[#041C2C]" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00A8B5]/25 text-[#38E1ED] border border-[#00A8B5]/40 backdrop-blur-md uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Corporate Partner
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/80">
                  <MapPin className="w-3 h-3 text-[#38E1ED]" /> {location}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {companyName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 flex items-center gap-2">
                <span>{industryType}</span>
                <span className="text-slate-400">•</span>
                <span>University Liaison & Talent Acquisition</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/dashboard/industry/posts"
              className="inline-flex items-center justify-center gap-2 bg-[#00A8B5] hover:bg-[#00929D] text-white px-5 py-3 rounded-2xl shadow-lg shadow-cyan-950/20 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
            <Link
              href="/dashboard/industry/profile"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
            >
              <Building2 className="w-4 h-4 text-[#38E1ED]" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Wide Community Network Feed */}
      <NetworkFeed user={user} role="industry" />
    </div>
  );
}
