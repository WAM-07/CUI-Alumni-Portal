"use client";

import React, { useState } from "react";
import { studentApi } from "../../lib/api/student";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  UploadCloud,
  FileText,
  Linkedin,
  Instagram,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export function AdditionalInfoForm({ student, onProfileUpdated }) {
  const [linkedinUrl, setLinkedinUrl] = useState(student?.linkedin_url || "");
  const [instagramUrl, setInstagramUrl] = useState(student?.instagram_url || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit. Please upload a smaller document.");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);
    if (instagramUrl) formData.append("instagram_url", instagramUrl);
    if (selectedFile) formData.append("cv", selectedFile);

    try {
      const updated = await studentApi.updateAdditionalInfo(formData);
      setSuccess("Profile information and CV updated successfully!");
      setSelectedFile(null);
      if (onProfileUpdated) onProfileUpdated(updated);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to update profile info. Please verify your URLs and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
          Update Career Info & Upload Resume
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Attach your latest resume and social links to make your profile visible to corporate recruiters.
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex items-center gap-2 text-xs text-[#065F46]">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-center gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider">
            Resume / Curriculum Vitae (PDF, DOC, DOCX up to 10MB)
          </label>

          <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1E3A8A] rounded-lg p-6 text-center bg-[#F8FAFC] transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-[#1E3A8A]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-[#0F172A]">{selectedFile.name}</p>
                  <p className="text-[11px] text-[#64748B]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1 rounded-full hover:bg-[#E2E8F0] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mx-auto">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#1E3A8A]">Click to select file</span>
                  <span className="text-xs text-[#64748B]"> or drag and drop here</span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  {student?.cv ? `Current File: ${student.cv.file_name}` : "No file currently selected"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          <div className="relative">
            <Input
              label="Instagram / Portfolio URL"
              placeholder="https://instagram.com/username"
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F5F9] flex justify-end">
          <Button type="submit" loading={saving}>
            Save Career Details
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AdditionalInfoForm;
