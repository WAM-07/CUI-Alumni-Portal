"use client";

import React, { useState, useEffect, useCallback } from "react";
import { studentApi } from "../../../../lib/api/student";
import ProfileHeader from "../../../../components/profile/ProfileHeader";
import { AdditionalInfoForm } from "../../../../components/student/AdditionalInfoForm";
import SavedPostsList from "../../../../components/profile/SavedPostsList";
import { Spinner } from "../../../../components/ui/Spinner";
import { AlertCircle, GraduationCap } from "lucide-react";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getMyProfile();
      setStudent(data);
    } catch (err) {
      setError(err.message || "Failed to load student profile details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
          <span>Student Academic & Career Hub</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
          Candidate Profile & Credentials
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Verify your university enrollment details, manage your CV, and expand your professional presence.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-center gap-3 text-xs text-[#B91C1C]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B]">Loading student records...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <ProfileHeader
            userRole="student"
            name={student?.name}
            subtitle={`Enrolled Student • ${student?.registration_no}`}
            department="Computer Science" // default or from student object
            location="Islamabad, Pakistan"
            linkedinUrl={student?.linkedin_url}
            bio={student?.cv ? `CV Uploaded: ${student.cv.file_name}` : "No Resume / CV Uploaded yet."}
            avatarUrl={student?.avatar_url}
            coverUrl={student?.cover_url}
            onAvatarUpdated={(url) => setStudent((s) => ({ ...s, avatar_url: url }))}
            onCoverUpdated={(url) => setStudent((s) => ({ ...s, cover_url: url }))}
            onEditClick={() => setShowUploadForm(!showUploadForm)}
            onUploadCVClick={() => setShowUploadForm(!showUploadForm)}
          />

          {(showUploadForm || !student?.cv) && (
            <AdditionalInfoForm
              student={student}
              onProfileUpdated={(updated) => {
                setStudent(updated);
                setShowUploadForm(false);
              }}
            />
          )}

          <div className="pt-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Saved Resources</h2>
            <SavedPostsList />
          </div>
        </div>
      )}
    </div>
  );
}
