"use client";

import React, { useState, useEffect } from "react";
import alumniApi from "../../lib/api/alumni";
import mentorshipApi from "../../lib/api/mentorship";
import NetworkFeed from "../feed/NetworkFeed";
import CreatePostModal from "../feed/CreatePostModal";
import {
  GraduationCap,
  Award,
  Plus
} from "lucide-react";

export default function AlumniDashboardView({ user }) {
  const [profile, setProfile] = useState(null);
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [togglingOptIn, setTogglingOptIn] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      alumniApi.getMyProfile().catch(() => null),
      mentorshipApi.getOptInStatus().catch(() => ({ is_mentor: false })),
    ]).then(([profileRes, optInRes]) => {
      if (profileRes) setProfile(profileRes);
      if (optInRes) setIsOptedIn(Boolean(optInRes.is_mentor));
    });
  }, []);

  const handleToggleOptIn = async () => {
    setTogglingOptIn(true);
    try {
      const nextState = !isOptedIn;
      await mentorshipApi.toggleOptIn(nextState);
      setIsOptedIn(nextState);
    } catch (err) {
      alert("Failed to update mentorship availability.");
    } finally {
      setTogglingOptIn(false);
    }
  };

  const alumniName = profile?.name || user?.name || user?.email?.split("@")[0] || "COMSATS Graduate";
  const currentTitle = profile?.current_position || profile?.current_title || "Software Professional";
  const currentCompany = profile?.current_company || "Technology Industry";
  const gradYear = profile?.graduation_year || "2022";
  const department = profile?.department || "Computer Science";

  return (
    <div className="space-y-8 pb-12">
      {/* Prestigious Alumni Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041C2C] via-[#0F2942] to-[#1E3A8A] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <img
          src="/comsats-hero.jpg"
          alt="COMSATS Campus"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20 pointer-events-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041C2C]/90 via-[#0F2942]/85 to-[#1E3A8A]/80 pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center shrink-0 border border-white/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={alumniName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full bg-[#041C2C] text-[#D97706] flex items-center justify-center font-extrabold text-2xl rounded-xl">
                  {alumniName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/40 backdrop-blur-md uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Esteemed Alumnus • Class of {gradYear}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/90">
                  <GraduationCap className="w-3.5 h-3.5 text-[#38E1ED]" /> {department}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {alumniName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-white">{currentTitle}</span>
                <span className="text-slate-400">at</span>
                <span className="text-[#38E1ED] font-semibold">{currentCompany}</span>
              </p>
            </div>
          </div>

          {/* Mentorship Availability Switch & Post CTA */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            {/* Live Mentor Toggle */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Mentor Network</p>
                <p className="text-[10px] text-slate-300">
                  {isOptedIn ? "Visible to Students" : "Opted Out"}
                </p>
              </div>
              <button
                onClick={handleToggleOptIn}
                disabled={togglingOptIn}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOptedIn ? "bg-[#00A8B5]" : "bg-white/30"
                }`}
                title={isOptedIn ? "Click to pause student mentorship requests" : "Click to become available as a mentor"}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isOptedIn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/20 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Share Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Wide Community Network Feed */}
      <NetworkFeed user={user} role="alumni" />

      {/* Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={() => {
          // Window reload or handled by child
        }}
      />
    </div>
  );
}
