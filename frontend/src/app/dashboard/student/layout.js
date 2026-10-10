"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { PortalNavbar } from "../../../components/layout/PortalNavbar";
import { Spinner } from "../../../components/ui/Spinner";

export default function StudentLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B] font-medium">
            Verifying COMSATS student session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-portal-pattern relative selection:bg-[#00A8B5]/20 selection:text-[#041C2C]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-50/80 via-slate-50/30 to-transparent blur-3xl opacity-80" />
      </div>
      <PortalNavbar />
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-12 pt-28 md:pt-32 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
