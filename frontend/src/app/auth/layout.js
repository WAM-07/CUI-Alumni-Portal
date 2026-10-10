import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Users, Briefcase } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041C2C] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00A8B5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        
        {/* University Crest Header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto overflow-hidden border-2 border-white/10">
              <img src="/cui-logo.png" alt="COMSATS Logo" className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif leading-tight">
            COMSATS University
          </h1>
          <p className="text-xs font-bold text-[#00A8B5] uppercase tracking-widest mt-1">
            Alumni & Career Portal
          </p>
        </div>

        {/* Floating Form Container */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/20 border border-white/20">
          {children}
        </div>
        
        {/* Footer */}
        <div className="text-center text-[11px] text-gray-400 font-medium">
          © {new Date().getFullYear()} COMSATS University Islamabad.<br/>All rights reserved.
        </div>
      </div>
    </div>
  );
}
