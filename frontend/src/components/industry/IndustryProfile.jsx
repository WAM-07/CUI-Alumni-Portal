"use client";

import React, { useState, useEffect } from "react";
import { industryApi } from "../../lib/api/industry";
import ProfileHeader from "../profile/ProfileHeader";
import EditProfileModal from "../profile/EditProfileModal";
import SavedPostsList from "../profile/SavedPostsList";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";

export function IndustryProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [data, stats] = await Promise.all([
          industryApi.getProfile(),
          industryApi.getDashboardStats().catch(() => null)
        ]);
        
        if (data) {
          setProfile({
            name: data.company_name || "Company Name",
            company_name: data.company_name || "",
            industry_type: data.industry_type || "Technology & Software",
            website: data.website || "",
            location: data.location || "",
            employee_count: data.employee_count || "50-200 employees",
            logo_url: data.logo_url || "",
            bio: data.description || "",
            department: data.industry_type || "Technology & Software", // map to generic field
            stats: stats || null
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (newData) => {
    try {
      const payload = {
        company_name: newData.name || newData.company_name,
        industry_type: newData.department || newData.industry_type,
        website: newData.linkedin_url || newData.website,
        location: newData.location,
        employee_count: profile?.employee_count || "50-200 employees",
        logo_url: newData.avatarUrl || profile?.logo_url,
        description: newData.bio,
      };
      
      const updated = await industryApi.updateProfile(payload);
      
      setProfile({
        ...profile,
        name: updated.company_name,
        bio: updated.description,
        location: updated.location,
        department: updated.industry_type,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-[#64748B]">Loading corporate profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <ProfileHeader
        userRole="industry"
        name={profile?.name}
        subtitle={`${profile?.employee_count} • Verified Partner`}
        department={profile?.department}
        location={profile?.location}
        bio={profile?.bio}
        avatarUrl={profile?.logo_url}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <div className="flex border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'jobs' ? 'border-[#041C2C] text-[#041C2C]' : 'border-transparent text-[#64748B] hover:text-[#041C2C]'
          }`}
        >
          Company Jobs
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'analytics' ? 'border-[#041C2C] text-[#041C2C]' : 'border-transparent text-[#64748B] hover:text-[#041C2C]'
          }`}
        >
          Analytics & Insights
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'saved' ? 'border-[#041C2C] text-[#041C2C]' : 'border-transparent text-[#64748B] hover:text-[#041C2C]'
          }`}
        >
          Saved References
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'jobs' && (
          <Card className="p-8 text-center border-dashed border-[#CBD5E1] bg-gray-50/50">
            <p className="text-sm font-medium text-[#64748B]">Active job postings will appear here.</p>
          </Card>
        )}
        
        {activeTab === 'analytics' && (
          <Card className="p-8 space-y-6">
            <h3 className="text-base font-bold text-[#0F172A]">Hiring Analytics Overview</h3>
            {profile?.stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-[#E2E8F0] rounded-xl bg-gray-50">
                  <div className="text-2xl font-black text-[#041C2C]">{profile.stats.total_jobs || 0}</div>
                  <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Total Postings</div>
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-xl bg-gray-50">
                  <div className="text-2xl font-black text-[#041C2C]">{profile.stats.active_jobs || 0}</div>
                  <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Active Listings</div>
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-xl bg-gray-50">
                  <div className="text-2xl font-black text-[#041C2C]">{profile.stats.total_applicants || 0}</div>
                  <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Total Applicants</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border-dashed border border-[#CBD5E1] bg-gray-50/50 rounded-xl">
                <p className="text-sm font-medium text-[#64748B]">Analytics data is currently unavailable.</p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'saved' && (
          <SavedPostsList />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profile}
        onSave={handleSaveProfile}
        userRole="industry"
      />
    </div>
  );
}

export default IndustryProfile;
