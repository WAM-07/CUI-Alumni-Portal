"use client";

import React from "react";
import {
  Sparkles,
  Rocket,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  Cpu,
  Layers,
  MapPin,
  Flame,
  ArrowRight
} from "lucide-react";

/**
 * CareerPathwayArt
 * Visual milestone roadmap for students illustrating their path from student to hired professional
 */
export function CareerPathwayArt({ activeStep = 2 }) {
  const steps = [
    {
      num: 1,
      title: "Enrollment & SSO",
      desc: "Verified CUI Scholar",
      status: "completed",
    },
    {
      num: 2,
      title: "CV & Portfolio Clinic",
      desc: "ATS-Optimized Resume",
      status: activeStep >= 2 ? (activeStep === 2 ? "active" : "completed") : "upcoming",
    },
    {
      num: 3,
      title: "Alumni Mentorship",
      desc: "1-on-1 Mock Interview",
      status: activeStep >= 3 ? (activeStep === 3 ? "active" : "completed") : "upcoming",
    },
    {
      num: 4,
      title: "Placement & Offer",
      desc: "Top Corporate Hiring",
      status: activeStep >= 4 ? "completed" : "upcoming",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#041C2C] via-[#0A273D] to-[#0F3554] p-6 text-white shadow-xl border border-white/10">
      {/* Background ambient blueprint lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38E1ED_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#00A8B5]/20 text-[#38E1ED] border border-[#00A8B5]/40 uppercase tracking-widest">
            <Rocket className="w-3.5 h-3.5" /> Career Launch Roadmap
          </span>
          <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
            Your Placement Trajectory
          </h3>
          <p className="text-xs text-slate-300">
            Progress through curated milestones to unlock fast-track recruitment interviews.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-[#38E1ED] shrink-0">
          Level 2 Scholar • 75% Ready
        </div>
      </div>

      {/* Visual Roadmap Cable */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div
              key={step.num}
              className={`relative rounded-2xl p-4 transition-all duration-300 border ${
                isActive
                  ? "bg-gradient-to-b from-[#00A8B5]/20 to-white/5 border-[#00A8B5] shadow-lg shadow-cyan-500/10"
                  : isCompleted
                  ? "bg-white/5 border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-[#00A8B5] text-white ring-4 ring-[#00A8B5]/30 animate-pulse"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted
                      ? "text-emerald-400"
                      : isActive
                      ? "text-[#38E1ED]"
                      : "text-slate-400"
                  }`}
                >
                  {isCompleted ? "Verified" : isActive ? "Current Focus" : "Milestone 4"}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white">{step.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TalentHeatmapArt
 * Visual infographic breakdown for Industry Partners showing student talent skill distribution
 */
export function TalentHeatmapArt() {
  const skills = [
    { name: "Full-Stack Web (React, Node, Next.js)", students: "580+ Candidates", pct: 94, color: "from-blue-500 to-cyan-400" },
    { name: "Python, AI & Machine Learning", students: "460+ Candidates", pct: 88, color: "from-purple-500 to-indigo-400" },
    { name: "Cloud Architecture & DevOps (Docker, AWS)", students: "310+ Candidates", pct: 82, color: "from-emerald-500 to-teal-400" },
    { name: "Mobile Development (Flutter, React Native)", students: "240+ Candidates", pct: 75, color: "from-amber-500 to-orange-400" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#00A8B5]" /> COMSATS Tech Skill Heatmap
          </span>
          <h3 className="text-base font-extrabold text-[#0F172A] mt-1">
            Graduating Cohort Competency Distribution
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Fall 2026 Batch
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F172A]">{skill.name}</span>
              <span className="text-[#64748B] font-semibold text-[11px]">{skill.students}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                style={{ width: `${skill.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between text-xs text-[#64748B]">
        <span>Based on departmental semester FYP records & code repository audits</span>
        <span className="text-[#00A8B5] font-bold">1,800+ Total Available Talent</span>
      </div>
    </div>
  );
}

/**
 * GlobalChaptersArt
 * Visual global chapters graphic for the Alumni Portal
 */
export function GlobalChaptersArt() {
  const chapters = [
    { region: "Pakistan (Islamabad, Lahore, Abbottabad)", count: "8,500+ Alumni", lead: "Central Chapter HQ" },
    { region: "North America (San Francisco, NY, Seattle)", count: "2,200+ Alumni", lead: "Silicon Valley Tech Chapter" },
    { region: "Europe & UK (London, Berlin, Munich)", count: "1,600+ Alumni", lead: "European Alumni Network" },
    { region: "Middle East (Dubai, Riyadh, Doha)", count: "3,100+ Alumni", lead: "Gulf Corporate Leaders Chapter" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#041C2C] via-[#0D283E] to-[#123652] p-6 text-white shadow-xl border border-white/10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" /> Worldwide Presence
          </span>
          <h3 className="text-lg font-extrabold text-white mt-1.5">
            COMSATS Global Alumni Chapters
          </h3>
          <p className="text-xs text-slate-300">
            A network of over 15,000 graduates across top international technology firms and research labs.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-2xl font-black text-amber-400">40+</span>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Countries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {chapters.map((chap) => (
          <div
            key={chap.region}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38E1ED]" />
                {chap.region}
              </span>
              <span className="text-amber-300 font-extrabold text-xs">{chap.count}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 pl-5">{chap.lead}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * HackathonPromoArt
 * Vibrant promotional banner for campus events & coding competitions
 */
export function HackathonPromoArt() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-[#041C2C] p-6 text-white shadow-xl border border-white/10">
      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-indigo-950 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-current" /> Live Campus Event
            </span>
            <span className="text-xs text-purple-200 font-semibold">CUI TechFest 2026</span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-white">
            Annual 48-Hour AI & Full-Stack Hackathon
          </h3>
          <p className="text-xs text-slate-300 max-w-lg">
            Compete in teams to solve real industrial challenges sponsored by Systems Ltd and partner companies. Cash prizes & direct job offers!
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:items-end gap-1">
          <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-xl border border-white/20">
            Registration Closes In 4 Days
          </span>
          <span className="text-[11px] text-slate-400">Open to Students & Alumni</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Rich Empty State Illustrator
 * Beautiful SVG-enhanced empty states replacing plain dashed grey boxes
 */
export function ArtisticEmptyState({
  title = "No Items Found",
  subtitle = "Nothing here right now. Check back soon for updates!",
  actionLabel,
  onAction,
  icon = "general",
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-[#E2E8F0] p-10 sm:p-12 text-center shadow-xs">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#041C2C] via-[#0F3554] to-[#00A8B5] p-0.5 mx-auto mb-4 shadow-xl shadow-cyan-900/10">
        <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center text-[#041C2C]">
          {icon === "jobs" ? (
            <Briefcase className="w-9 h-9 text-[#00A8B5]" />
          ) : icon === "mentors" ? (
            <GraduationCap className="w-9 h-9 text-[#1E3A8A]" />
          ) : icon === "global" ? (
            <Globe className="w-9 h-9 text-[#D97706]" />
          ) : (
            <Sparkles className="w-9 h-9 text-[#00A8B5]" />
          )}
        </div>
      </div>

      <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1.5 leading-relaxed">
        {subtitle}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#041C2C] hover:bg-[#00A8B5] text-white text-xs font-bold transition-all shadow-md"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
