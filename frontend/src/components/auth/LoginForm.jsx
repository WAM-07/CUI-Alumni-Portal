"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { GraduationCap, Building2, AlertCircle } from "lucide-react";

export function LoginForm() {
  const { loginStudent, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState("industry"); // "student" or "industry"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Student fields
  const [regNo, setRegNo] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // User fields (Industry/Alumni)
  const [email, setEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "student") {
        if (!regNo || !studentPassword) {
          throw new Error("Please enter your registration number and password.");
        }
        await loginStudent(regNo, studentPassword);
      } else {
        if (!email || !userPassword) {
          throw new Error("Please enter your email and password.");
        }
        await loginUser(email, userPassword);
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Sign in to your account</h2>
        <p className="text-xs text-[#64748B]">
          Enter your university credentials or company login details
        </p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="flex bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => {
            setActiveTab("industry");
            setError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === "industry"
              ? "bg-[#00A8B5] text-white shadow-md"
              : "text-[#64748B] hover:text-[#041C2C]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Employer / Alumni
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("student");
            setError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === "student"
              ? "bg-[#00A8B5] text-white shadow-md"
              : "text-[#64748B] hover:text-[#041C2C]"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Student SSO
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md flex items-start gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "student" ? (
          <>
            <Input
              label="Registration Number"
              placeholder="e.g. FA20-BCS-001"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Official Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </>
        )}

        <Button type="submit" loading={loading} variant="gold" className="w-full py-3">
          Sign In
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-[#64748B]">
        Don't have an employer or alumni account?{" "}
        <Link href="/auth/signup" className="font-semibold text-[#1E3A8A] hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
