import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0A1D30] text-[#94A3B8] text-xs py-10 px-4 border-t border-[#1E3A8A]/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
            <img src="/cui-logo.png" alt="COMSATS Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <p className="font-bold text-white uppercase tracking-wider">
              COMSATS University Islamabad
            </p>
            <p className="text-[11px] text-[#64748B]">
              Career Development & Alumni Affairs Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/auth/login" className="hover:text-white transition-colors">
            Student Login
          </Link>
          <Link href="/auth/signup" className="hover:text-white transition-colors">
            Employer Registration
          </Link>
          <a
            href="https://www.comsats.edu.pk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            COMSATS Main Site
          </a>
        </div>

        <p className="text-[11px] text-[#64748B]">
          © {new Date().getFullYear()} COMSATS University Islamabad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
