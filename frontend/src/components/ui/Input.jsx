import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = forwardRef(function Input(
  { label, error, helperText, className = "", id, type = "text", ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#334155] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`w-full px-3.5 py-3 text-sm bg-white border rounded-xl shadow-sm placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#00A8B5] focus:border-transparent ${
            error ? "border-[#DC2626] focus:ring-[#DC2626]" : "border-[#CBD5E1]"
          } ${isPassword ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#041C2C] focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#64748B]">{helperText}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = "", id, rows = 3, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#334155] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`w-full px-3.5 py-3 text-sm bg-white border rounded-xl shadow-sm placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#00A8B5] focus:border-transparent ${
          error ? "border-[#DC2626] focus:ring-[#DC2626]" : "border-[#CBD5E1]"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#64748B]">{helperText}</p>}
    </div>
  );
});

export default Input;
