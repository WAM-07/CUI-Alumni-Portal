import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-lg shadow-sm hover:shadow transition-shadow duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`p-5 border-b border-[#F1F5F9] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-base font-semibold text-[#0F172A] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-xs text-[#64748B] mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`p-4 bg-[#F8FAFC] border-t border-[#F1F5F9] rounded-b-lg flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
