"use client";

import React, { useState, useEffect } from "react";
import { industryApi } from "../../../../lib/api/industry";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Spinner } from "../../../../components/ui/Spinner";
import { JobDetailsModal } from "../../../../components/jobs/JobDetailsModal";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function StudentJobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const data = await industryApi.getAllJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        // If unauthenticated or forbidden for student, show friendly message
        console.warn("Could not load jobs for student:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleJobApplied = (jobId) => {
    setAppliedJobIds((prev) => new Set(prev).add(jobId));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-6 border-b border-[#E2E8F0]">
        <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
          University Placement Board
        </span>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
          Active Job & Internship Opportunities
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Verified corporate partner listings open for COMSATS graduating cohorts and scholars.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B]">Loading opportunities board...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-dashed border-[#CBD5E1] rounded-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto text-[#1E3A8A]">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">No Open Postings</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            New corporate postings will appear here when published by university hiring partners.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            return (
              <Card
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow cursor-pointer border border-[#E2E8F0]"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] hover:text-[#1E3A8A]">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                          {job.location || "Islamabad, PK"}
                        </span>
                        {job.salary_range && (
                          <span className="flex items-center gap-1 text-[#059669]">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salary_range}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={job.job_type === "Internship" ? "gold" : "primary"}>
                      {job.job_type || "Full-time"}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded text-[11px] font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8]">
                    Posted {new Date(job.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  {isApplied ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="text-xs py-1 px-3"
                    >
                      Apply with CV
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
          onApplied={handleJobApplied}
          isAlreadyApplied={appliedJobIds.has(selectedJob.id)}
        />
      )}
    </div>
  );
}
