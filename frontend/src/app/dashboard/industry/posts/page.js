"use client";

import React, { useState, useEffect, useCallback } from "react";
import { industryApi } from "../../../../lib/api/industry";
import { IndustryPostCard } from "../../../../components/industry/IndustryPostCard";
import { IndustryPostForm } from "../../../../components/industry/IndustryPostForm";
import { ApplicantReviewModal } from "../../../../components/industry/ApplicantReviewModal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Spinner } from "../../../../components/ui/Spinner";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  AlertCircle,
  FileQuestion,
} from "lucide-react";

export default function IndustryPostsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [reviewingJob, setReviewingJob] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await industryApi.getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to permanently delete this job listing?")) return;
    try {
      await industryApi.deleteJob(jobId);
      fetchJobs();
    } catch (err) {
      alert(err.message || "Failed to delete job listing.");
    }
  };

  const handleViewApplicants = (job) => {
    setReviewingJob(job);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "ALL" ||
      job.job_type?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
            Career Opportunities Management
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Job & Internship Postings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Publish, edit, and monitor active positions open to COMSATS students and alumni.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleCreateJob}
          className="flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-center gap-3 text-xs text-[#B91C1C]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-[#E2E8F0]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings by title, keywords, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-transparent border-none focus:outline-none placeholder:text-[#94A3B8] text-[#0F172A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F1F5F9]">
          <Filter className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2.5 py-1 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2942]"
          >
            <option value="ALL">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B]">Loading opportunities...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-dashed border-[#CBD5E1] rounded-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#64748B]">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0F172A]">No Listings Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              {searchQuery || selectedType !== "ALL"
                ? "No opportunities matched your search criteria. Try adjusting filters or search term."
                : "You have not published any job opportunities yet. Start reaching university talent today."}
            </p>
          </div>
          {searchQuery || selectedType !== "ALL" ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("ALL");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleCreateJob}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Publish First Listing</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <IndustryPostCard
              key={job.id}
              job={job}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onViewApplicants={handleViewApplicants}
            />
          ))}
        </div>
      )}

      {/* Job Create/Edit Modal */}
      <IndustryPostForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onJobSaved={fetchJobs}
        editingJob={editingJob}
      />

      {/* Applicant Review Modal */}
      <ApplicantReviewModal
        isOpen={Boolean(reviewingJob)}
        onClose={() => setReviewingJob(null)}
        job={reviewingJob}
      />
    </div>
  );
}
