import React from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
      <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-xl shadow-blue-900/5 rounded-full px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo / Crest */}
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/cui-logo.png" alt="COMSATS Logo" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-wider uppercase font-serif text-[#041C2C] leading-tight">
              COMSATS University
            </span>
            <span className="text-[10px] sm:text-xs text-[#00A8B5] font-semibold tracking-wide">
              Alumni & Career Placement
            </span>
          </div>
        </Link>

        {/* Nav Links & CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/feed"
            className="text-xs sm:text-sm font-bold text-[#041C2C] hover:text-[#00A8B5] transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            Public Feed
          </Link>
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm font-bold text-[#041C2C] hover:text-[#00A8B5] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-xs sm:text-sm font-bold bg-[#041C2C] hover:bg-[#002147] text-white px-5 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Partner Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
