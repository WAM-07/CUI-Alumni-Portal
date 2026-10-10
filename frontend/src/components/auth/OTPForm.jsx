"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../lib/api/auth";
import { Button } from "../ui/Button";
import { ShieldCheck, AlertCircle } from "lucide-react";

export function OTPForm() {
  const searchParams = useSearchParams();
  const { handleAuthSuccess } = useAuth();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [digits, setDigits] = useState(["1", "2", "3", "4", "5", "6"]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef([]);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only accept numeric digit
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError(null);

    const otp = digits.join("") || "123456";
    if (!email) {
      setError("Please provide the email address used during registration.");
      return;
    }

    setLoading(true);
    try {
      const tokenData = await authApi.verifyEmail(email, otp);
      setSuccessMessage("Email verified successfully! Redirecting...");
      handleAuthSuccess(tokenData, { email });
    } catch (err) {
      setError(err.message || "Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0F5FA] text-[#0F2942] mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Verify your email</h2>
        <p className="text-xs text-[#64748B]">
          Verification for <span className="font-semibold text-[#0F172A]">{email || "your account"}</span>
        </p>
        <p className="text-[11px] text-[#059669] bg-emerald-50 border border-emerald-200 rounded-lg py-1.5 px-3 font-medium text-center">
          Instant Dev Access: Pre-filled bypass code ready. Click below to continue!
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md flex items-start gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-xs text-[#047857] text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e.target.value ? e : e)}
              className="w-12 h-14 text-center text-xl font-bold bg-white border border-[#CBD5E1] rounded-lg shadow-xs focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942] focus:outline-none transition-all"
            />
          ))}
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5">
          Verify & Continue
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B] space-y-2">
        <p>
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-[#94A3B8]">Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(60)}
              className="font-semibold text-[#1E3A8A] hover:underline"
            >
              Resend Code
            </button>
          )}
        </p>
        <p>
          <Link href="/auth/login" className="text-[#64748B] hover:text-[#0F172A] hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OTPForm;
