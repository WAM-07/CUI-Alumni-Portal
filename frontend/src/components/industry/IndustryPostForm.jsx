"use client";

import React, { useState, useEffect } from "react";
import { industryApi } from "../../lib/api/industry";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { AlertCircle } from "lucide-react";

export function IndustryPostForm({ isOpen, onClose, onJobSaved, editingJob = null }) {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [requirements, setRequirements] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title || "");
      setJobType(editingJob.job_type || "Full-time");
      setLocation(editingJob.location || "");
      setSalaryRange(editingJob.salary_range || "");
      setRequirements(Array.isArray(editingJob.requirements) ? editingJob.requirements.join("\n") : "");
      setDescription(editingJob.description || "");
    } else {
      setTitle("");
      setJobType("Full-time");
      setLocation("");
      setSalaryRange("");
      setRequirements("");
      setDescription("");
    }
    setError(null);
  }, [editingJob, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const reqArray = requirements
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      title,
      job_type: jobType,
      location,
      salary_range: salaryRange || undefined,
      requirements: reqArray,
      description,
    };

    try {
      if (editingJob?.id) {
        await industryApi.updateJob(editingJob.id, payload);
      } else {
        await industryApi.createJob(payload);
      }
      onJobSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save job posting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingJob ? "Edit Job Opportunity" : "Create New Job Opportunity"}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md flex items-start gap-2 text-xs text-[#B91C1C]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            placeholder="e.g. Associate Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider">
              Employment Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-md shadow-xs focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            placeholder="e.g. Islamabad, Pakistan (On-site / Hybrid)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <Input
            label="Salary Range (Optional)"
            placeholder="e.g. PKR 80,000 - 120,000"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
          />
        </div>

        <Textarea
          label="Job Description"
          placeholder="Provide a detailed description of the role, team, and day-to-day responsibilities..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Textarea
          label="Requirements (One per line)"
          placeholder="e.g. Bachelor's in CS or SE&#10;Proficiency in Python or JavaScript&#10;Strong understanding of REST APIs"
          rows={3}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editingJob ? "Update Opportunity" : "Publish Job Opportunity"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default IndustryPostForm;
