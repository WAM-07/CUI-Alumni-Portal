"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  FileText,
  Briefcase,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export function StudentSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "My Profile & CV",
      href: "/dashboard/student/profile",
      icon: User,
      exact: true,
    },
    {
      label: "Network Feed",
      href: "/dashboard/student",
      icon: ExternalLink,
      exact: true,
    },
    {
      label: "Mentorship Network",
      href: "/dashboard/student/mentorship",
      icon: HelpCircle,
      exact: false,
    },
  ];

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3">
            Academic Navigation
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#041C2C] text-white shadow-md"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#041C2C]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#00A8B5]" : "text-[#64748B]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Institutional Resources Box */}
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
          <span className="text-[11px] font-bold text-[#0F172A] block">
            Career Placement Cell
          </span>
          <p className="text-[11px] text-[#64748B] leading-normal">
            Keep your resume updated. Employers recruit directly from verified COMSATS student rosters.
          </p>
          <a
            href="https://www.comsats.edu.pk"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
          >
            <span>University Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8] text-center">
        COMSATS Alumni & Student Portal
      </div>
    </aside>
  );
}

export default StudentSidebar;
