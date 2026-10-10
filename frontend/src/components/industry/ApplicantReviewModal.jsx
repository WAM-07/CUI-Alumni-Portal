"use client";

import React, { useState, useEffect, useCallback } from "react";
import { industryApi } from "../../lib/api/industry";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Spinner } from "../ui/Spinner";
import { FileText, ExternalLink, UserCheck, AlertCircle } from "lucide-react";

export function ApplicantReviewModal({ isOpen, onClose, job }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(async () => {
    if (!job?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await industryApi.getJobApplicants(job.id);
      setApplicants(data || []);
    } catch (err) {
      setError(err.message || "Failed to load candidate applications.");
    } finally {
      setLoading(false);
    }
  }, [job]);

  useEffect(() => {
    if (isOpen && job?.id) {
      fetchApplicants();
    } else {
      setApplicants([]);
    }
  }, [isOpen, job, fetchApplicants]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await industryApi.updateApplicantStatus(job.id, appId, newStatus);
      // Update local state smoothly
      setApplicants((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert(err.message || "Failed to update applicant status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Candidate Applications — ${job?.title || "Job"}`}
      maxWidth="max-w-4xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B]">Loading submitted applications...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-center gap-3 text-xs text-[#B91C1C]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1]">
          <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center mx-auto text-[#64748B]">
            <UserCheck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-[#0F172A]">No applications received yet</h4>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Candidates who apply for this opportunity will appear here with their resumes and qualifications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] pb-2 border-b border-[#F1F5F9]">
            <span>Total Candidates: <strong className="text-[#0F172A]">{applicants.length}</strong></span>
            <span>Position: <strong className="text-[#0F172A]">{job.title}</strong></span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {applicants.map((app) => (
              <div key={app.id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {app.applicant_name || `Candidate (${app.applicant_user_id?.slice(-8) || "N/A"})`}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {app.applicant_role || "Applicant"}
                      </span>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {app.applicant_email && (
                        <span className="text-[11px] font-medium text-[#1E3A8A]">
                          {app.applicant_email} •
                        </span>
                      )}
                      <span className="text-[11px] text-[#64748B]">
                        Applied: {new Date(app.applied_at || app.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status Change Selector & Resume Link */}
                  <div className="flex items-center gap-3">
                    {app.resume_link && (
                      <a
                        href={app.resume_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1E3A8A] bg-[#EFF6FF] border border-[#BFDBFE] rounded-md hover:bg-[#DBEAFE] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View CV</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-[#64748B] whitespace-nowrap">Status:</label>
                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-2.5 py-1 text-xs bg-white border border-[#CBD5E1] rounded-md shadow-2xs font-medium text-[#0F172A] focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {app.cover_letter && (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#334155] leading-relaxed">
                    <span className="font-semibold text-[#0F172A] block mb-1">Candidate Statement / Cover Note:</span>
                    {app.cover_letter}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ApplicantReviewModal;
