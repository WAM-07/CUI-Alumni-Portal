"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../lib/api/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Building2, Award, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const { handleAuthSuccess } = useAuth();
  const [role, setRole] = useState("industry"); // "industry" or "alumni"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Compute password criteria
  const passwordRules = useMemo(() => {
    return [
      { id: "length", label: "At least 8 characters", met: password.length >= 8 },
      { id: "uppercase", label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
      { id: "lowercase", label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
      { id: "number", label: "One number (0-9)", met: /[0-9]/.test(password) },
      { id: "symbol", label: "One symbol (e.g. !@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  // Missing requirements (filtered so only unmet ones are displayed)
  const missingRules = useMemo(() => {
    return passwordRules.filter((rule) => !rule.met);
  }, [passwordRules]);

  // Password strength calculation
  const metCount = passwordRules.length - missingRules.length;
  const strength = useMemo(() => {
    if (password.length === 0) return { label: "", color: "bg-slate-200", width: "0%" };
    if (metCount <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (metCount <= 4) return { label: "Medium", color: "bg-amber-500", width: "66%" };
    return { label: "Strong", color: "bg-emerald-600", width: "100%" };
  }, [password.length, metCount]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (missingRules.length > 0) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Pass confirm_password so the backend schema validation succeeds
      await authApi.signup(email, password, confirmPassword, role);
      try {
        // Attempt immediate login since OTP is bypassed in development
        const tokenData = await authApi.userLogin(email, password);
        handleAuthSuccess(tokenData, { email });
        return;
      } catch {
        // Redirect to OTP verification with email query param
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Create an account</h2>
        <p className="text-xs text-[#64748B]">
          Join the COMSATS University network as an Employer or Alumni partner
        </p>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("industry")}
          className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-center ${
            role === "industry"
              ? "border-[#00A8B5] bg-[#E6F7F8] text-[#041C2C] ring-2 ring-[#00A8B5]"
              : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-xs font-semibold">Industry Partner</span>
          <span className="text-[10px] text-[#64748B]">Post jobs & recruit</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("alumni")}
          className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-center ${
            role === "alumni"
              ? "border-[#00A8B5] bg-[#E6F7F8] text-[#041C2C] ring-2 ring-[#00A8B5]"
              : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-xs font-semibold">Alumni</span>
          <span className="text-[10px] text-[#64748B]">Network & mentor</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md flex items-start gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Official Email"
          type="email"
          placeholder="name@organization.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Field with Strength Indicator */}
        <div className="space-y-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">Password Strength:</span>
                <span className="font-semibold text-[#0F172A]">{strength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}

          {/* Missing Requirements List (Disappears as each is satisfied) */}
          {password.length > 0 && (
            <div className="pt-1.5">
              {missingRules.length > 0 ? (
                <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-md space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#B45309]">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Missing requirements:</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-[11px] text-[#92400E]">
                    {missingRules.map((rule) => (
                      <li key={rule.id} className="transition-all duration-200">
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#059669] pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>All password requirements satisfied!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {showPasswordMismatch && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Passwords do not match yet</span>
            </div>
          )}

          {passwordsMatch && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#059669] pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Passwords match</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          variant="gold"
          disabled={missingRules.length > 0 || !passwordsMatch}
          className="w-full py-3"
        >
          Create Account & Send OTP
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-[#64748B]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[#1E3A8A] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
