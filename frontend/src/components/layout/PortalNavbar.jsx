"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Users,
  Briefcase,
  Bell,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  GraduationCap
} from "lucide-react";

export function PortalNavbar() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();

  // Define nav items based on role
  const getNavItems = () => {
    switch (role) {
      case "student":
        return [
          { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard, exact: true },
          { label: "Job Board", href: "/dashboard/student/posts", icon: Briefcase },
          { label: "Mentorship", href: "/dashboard/student/mentorship", icon: GraduationCap },
          { label: "My Profile", href: "/dashboard/student/profile", icon: User },
        ];
      case "alumni":
        return [
          { label: "Dashboard", href: "/dashboard/alumni", icon: LayoutDashboard, exact: true },
          { label: "Mentorship", href: "/dashboard/alumni/mentorship", icon: GraduationCap },
          { label: "Job Board", href: "/dashboard/alumni/posts", icon: Briefcase },
          { label: "Notifications", href: "/dashboard/alumni/notifications", icon: Bell },
          { label: "Profile", href: "/dashboard/alumni/profile", icon: User },
        ];
      case "industry":
        return [
          { label: "Dashboard", href: "/dashboard/industry", icon: LayoutDashboard, exact: true },
          { label: "Jobs & Pipeline", href: "/dashboard/industry/posts", icon: Briefcase },
          { label: "Notifications", href: "/dashboard/industry/notifications", icon: Bell },
          { label: "Company Profile", href: "/dashboard/industry/profile", icon: Building2 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-xl shadow-blue-900/5 rounded-full px-4 lg:px-8 py-2.5 flex items-center justify-between">
        
        {/* Left: Responsive Branding */}
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/${role}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden p-1 border border-gray-100 group-hover:scale-105 transition-transform">
              <img src="/cui-logo.png" alt="COMSATS Logo" className="w-full h-full object-contain" />
            </div>
            {/* Hidden on very small screens, visible on md and up */}
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#041C2C] uppercase font-serif leading-tight">
                COMSATS
              </span>
              <span className="text-[10px] text-[#00A8B5] font-bold tracking-wider uppercase">
                {role === "industry" ? "Corporate Partner" : role === "student" ? "Student Hub" : "Alumni Network"}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Polished Navigation Items */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center rounded-full px-3 py-2 transition-all duration-200 ${
                  active
                    ? "bg-[#041C2C] text-white shadow-md shadow-[#041C2C]/20"
                    : "text-[#64748B] hover:text-[#041C2C] hover:bg-slate-100"
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-[#38E1ED]" : "group-hover:text-[#041C2C]"}`} />
                <span className={`ml-2 text-xs font-semibold whitespace-nowrap hidden md:inline-block ${active ? "text-white" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right mr-1">
            <span className="text-xs font-bold text-[#041C2C] flex items-center justify-end gap-1 leading-tight">
              {user?.name || user?.email || "User"}
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A8B5]" />
            </span>
            <span className="text-[10px] text-[#64748B] capitalize tracking-wide font-medium">
              {role || "Member"}
            </span>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-[#041C2C] border border-[#041C2C] flex items-center justify-center text-white text-xs font-bold shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4 text-[#00A8B5]" />}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 ml-1 text-[#64748B] hover:text-white hover:bg-[#EF4444] rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}

export default PortalNavbar;
