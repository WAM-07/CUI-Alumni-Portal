"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { industryApi } from "../../lib/api/industry";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  Send,
} from "lucide-react";

export function JobDetailsModal({ isOpen, onClose, job, onApplied, isAlreadyApplied }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !job) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await industryApi.applyToJob(job.id, {
        cover_letter: coverLetter,
        resume_link: resumeLink || undefined,
      });
      setSuccess(true);
      onApplied?.(job.id);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setCoverLetter("");
    setResumeLink("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={job.title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Job Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0F172A]">{job.company_name || "Partner Employer"}</span>
              <Badge variant={job.job_type === "Internship" ? "gold" : "primary"}>
                {job.job_type || "Full-time"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                {job.location || "On-site / Hybrid"}
              </span>
              {job.salary_range && (
                <span className="flex items-center gap-1 text-[#059669] font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary_range}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                Posted {new Date(job.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Job Description & Overview
          </h4>
          <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Key Requirements & Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.requirements.map((req, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#EEF2F6] text-[#1E3A8A] border border-[#CBD5E1] rounded-lg text-xs font-semibold"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
          {success || isAlreadyApplied ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Application Submitted!</p>
                <p className="text-emerald-700 mt-0.5">
                  Your profile and application have been transmitted directly to the hiring team.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#00A8B5]" />
                Apply for this Position
              </h4>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Resume / Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-cv or LinkedIn profile"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg shadow-2xs focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  If left blank, your portal profile and registered CV will be automatically attached.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly state why you're a great fit for this opportunity..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg shadow-2xs focus:ring-2 focus:ring-[#0F2942] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  className="px-5"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default JobDetailsModal;
