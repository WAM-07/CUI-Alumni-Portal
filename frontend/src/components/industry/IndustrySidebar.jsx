"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Bell,
  LogOut,
  ExternalLink,
} from "lucide-react";

export function IndustrySidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    {
      label: "Network Feed",
      href: "/dashboard/industry",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Company Profile",
      href: "/dashboard/industry/profile",
      icon: Building2,
    },
    {
      label: "Jobs & Applications",
      href: "/dashboard/industry/posts",
      icon: Briefcase,
    },
    {
      label: "Notifications",
      href: "/dashboard/industry/notifications",
      icon: Bell,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-61px)] flex flex-col justify-between p-4">
      {/* Top Section */}
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
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

      {/* Bottom Section */}
      <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-md transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Portal Home
          </span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default IndustrySidebar;
