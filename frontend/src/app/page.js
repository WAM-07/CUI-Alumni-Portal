import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LandingFeed from "../components/landing/LandingFeed";

export const metadata = {
  title: "COMSATS University Alumni & Career Portal",
  description:
    "The official institutional portal connecting COMSATS alumni, current scholars, and industry employers.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#00A8B5] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
        {/* Full Viewport Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/comsats-hero.jpg')" }}
        />
        {/* Deep Navy Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#041C2C]/95 via-[#041C2C]/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-widest shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>Chartered by Government of Pakistan</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif text-white max-w-5xl mx-auto leading-[1.1]">
            Forging <span className="text-[#00A8B5]">Excellence</span>.<br/>Inspiring <span className="text-[#00A8B5]">Innovation</span>.
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
            The dedicated institutional ecosystem connecting over <span className="text-white font-bold">85,000+ COMSATS alumni</span>, current scholars, and leading corporate employers worldwide.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-[#041C2C] font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-extrabold text-sm uppercase tracking-wider transition-all border border-white/30 flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              <span>Partner Onboarding</span>
            </Link>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="absolute bottom-0 right-0 hidden lg:flex bg-[#041C2C]/90 backdrop-blur-md border-t border-l border-white/10 rounded-tl-3xl p-8 gap-12 shadow-2xl">
           <div>
             <p className="text-4xl font-extrabold text-[#00A8B5]">85k+</p>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Global Alumni</p>
           </div>
           <div>
             <p className="text-4xl font-extrabold text-[#F59E0B]">#3</p>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">HEC IT Ranking</p>
           </div>
        </div>
      </section>

      {/* Institutional Pillars / Portals */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-[#F59E0B] flex items-center justify-center gap-2">
            <span className="w-8 h-0.5 bg-[#F59E0B]"></span>
            PORTAL GATEWAYS
            <span className="w-8 h-0.5 bg-[#F59E0B]"></span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#041C2C] tracking-tight font-serif">
            Integrated University Network
          </h2>
          <p className="text-sm text-[#64748B] max-w-2xl mx-auto">
            Tailored digital services serving students, verified alumni, and recruitment partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Students */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#041C2C] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#041C2C] font-serif">
                Current Students
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Single Sign-On using your official university registration number. Maintain your CV, apply for accredited internships, and engage with mentors.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="pt-6 border-t border-[#F1F5F9] text-sm font-bold text-[#00A8B5] flex items-center gap-2 group-hover:text-[#041C2C] transition-colors"
            >
              <span>Student SSO Login</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Industry Partners */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00A8B5] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#041C2C] font-serif">
                Corporate Employers
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Connect directly with qualified graduates and experienced alumni. Post career openings, review resumes, and manage your recruitment pipeline.
              </p>
            </div>

            <Link
              href="/auth/signup"
              className="pt-6 border-t border-[#F1F5F9] text-sm font-bold text-[#00A8B5] flex items-center gap-2 group-hover:text-[#041C2C] transition-colors"
            >
              <span>Employer Onboarding</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Alumni */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#041C2C] font-serif">
                Alumni Association
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Join a prestigious network of professionals across 50+ countries. Reconnect with classmates, offer guidance to juniors, and discover executive roles.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="pt-6 border-t border-[#F1F5F9] text-sm font-bold text-[#00A8B5] flex items-center gap-2 group-hover:text-[#041C2C] transition-colors"
            >
              <span>Alumni Sign In</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFeed />
      <Footer />
    </div>
  );
}
