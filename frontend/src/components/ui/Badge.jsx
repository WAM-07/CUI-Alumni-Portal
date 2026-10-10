import React from "react";

export function Badge({ children, variant = "applied", className = "", ...props }) {
  const normalized = (variant || "").toLowerCase();

  const styles = {
    applied: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]",
    pending: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]",
    reviewing: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
    shortlisted: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
    hired: "bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]",
    accepted: "bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]",
    rejected: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    open: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
    closed: "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]",
    navy: "bg-[#0F2942] text-white border-transparent",
    gold: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  };

  const badgeStyle = styles[normalized] || styles.applied;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${badgeStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
