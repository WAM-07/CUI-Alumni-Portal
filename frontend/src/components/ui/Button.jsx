import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#041C2C] text-white hover:bg-[#002147] focus:ring-[#041C2C] shadow-sm",
    secondary:
      "bg-white text-[#041C2C] border border-[#CBD5E1] hover:bg-[#F8FAFC] focus:ring-[#041C2C] shadow-sm",
    gold:
      "bg-[#F59E0B] text-[#041C2C] hover:bg-[#D97706] focus:ring-[#F59E0B] shadow-md font-bold",
    outline:
      "border border-[#041C2C] text-[#041C2C] hover:bg-[#F0F5FA] focus:ring-[#041C2C]",
    danger:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626] shadow-sm",
    ghost:
      "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:ring-[#94A3B8]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
