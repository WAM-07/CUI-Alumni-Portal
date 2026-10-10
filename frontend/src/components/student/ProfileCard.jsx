"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  GraduationCap,
  Mail,
  Hash,
  Linkedin,
  Instagram,
  FileCheck,
  FileX,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function ProfileCard({ student }) {
  if (!student) return null;

  return (
    <Card className="p-6 space-y-6">
      {/* Top Banner / Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#0F2942] text-[#F59E0B] flex items-center justify-center font-bold text-2xl shadow-md border-2 border-[#1E3A8A]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                {student.name}
              </h2>
              <ShieldCheck className="w-4 h-4 text-[#059669]" title="Verified COMSATS Student" />
            </div>
            <p className="text-xs font-mono font-medium text-[#1E3A8A] mt-0.5">
              Registration No: {student.registration_no}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1">
            Enrolled Student
          </Badge>
        </div>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
            <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Institutional Email</span>
          </div>
          <p className="font-medium text-[#0F172A] truncate">{student.email}</p>
        </div>

        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
            <Hash className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Academic ID</span>
          </div>
          <p className="font-mono font-medium text-[#0F172A]">
            {student.registration_no}
          </p>
        </div>
      </div>

      {/* Professional Presence */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
          Professional Presence & Profiles
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {student.linkedin_url ? (
            <a
              href={student.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 text-xs font-semibold transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-xs text-[#94A3B8] italic">
              LinkedIn profile not connected yet.
            </span>
          )}

          {student.instagram_url && (
            <a
              href={student.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#E4405F]/10 text-[#E4405F] border border-[#E4405F]/30 hover:bg-[#E4405F]/20 text-xs font-semibold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>Portfolio / Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* CV Status */}
      <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {student.cv ? (
            <div className="w-10 h-10 rounded-md bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
              <FileX className="w-5 h-5" />
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              {student.cv ? "Curriculum Vitae on File" : "No Resume / CV Uploaded"}
            </h4>
            <p className="text-[11px] text-[#64748B]">
              {student.cv
                ? `${student.cv.file_name} • Uploaded ${new Date(
                    student.cv.uploaded_at
                  ).toLocaleDateString()}`
                : "Upload a PDF or Word CV to apply directly to verified partner job postings."}
            </p>
          </div>
        </div>

        {student.cv?.file_url && (
          <a
            href={student.cv.file_url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-white border border-[#CBD5E1] rounded-md hover:bg-[#F1F5F9] transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>View CV</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </Card>
  );
}

export default ProfileCard;
