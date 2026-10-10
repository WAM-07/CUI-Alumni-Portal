"use client";

import React from "react";
import { Card } from "../../../../components/ui/Card";
import { Bell, Inbox } from "lucide-react";

export default function StudentNotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-[#E2E8F0]">
        <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
          Student Communication
        </span>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#1E3A8A]" />
          <span>Academic & Career Notifications</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Direct updates regarding campus placement drives, CV reviews, and recruitment outreach.
        </p>
      </div>

      <div className="text-center py-16 px-4 bg-white border border-dashed border-[#CBD5E1] rounded-xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#64748B]">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#0F172A]">No New Notifications</h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          You are all caught up! Updates on applied positions and university job drives will be displayed here.
        </p>
      </div>
    </div>
  );
}
