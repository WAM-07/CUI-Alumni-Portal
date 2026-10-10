"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfileHeader from "../profile/ProfileHeader";
import EditProfileModal from "../profile/EditProfileModal";
import SavedPostsList from "../profile/SavedPostsList";
import { Card } from "../ui/Card";
import alumniApi from "../../lib/api/alumni";

export function AlumniProfile() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");

  const [profileData, setProfileData] = useState({
    name: user?.name || "COMSATS Graduate",
    graduation_year: "2022",
    department: "Computer Science & Software Engineering",
    current_company: "Global Tech Solutions",
    current_title: "Senior Systems Engineer",
    location: "Islamabad, Pakistan",
    linkedin_url: "https://linkedin.com",
    bio: "Proud COMSATS alumnus passionate about distributed systems, backend engineering, and mentoring undergraduate cohorts.",
    avatar_url: null,
    cover_url: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await alumniApi.getMyProfile();
        if (data) {
          setProfileData((prev) => ({
            ...prev,
            ...data,
            name: data.name || user?.name || user?.email?.split('@')[0] || prev.name,
            current_title: data.current_position || prev.current_title,
            current_company: data.current_company || prev.current_company,
            avatar_url: data.avatar_url || prev.avatar_url,
            cover_url: data.cover_url || prev.cover_url,
          }));
        }
      } catch (err) {
        console.error("Failed to load alumni profile:", err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async (newData) => {
    setProfileData((prev) => ({ ...prev, ...newData }));
    try {
      await alumniApi.updateProfile({
        name: newData.name,
        graduation_year: Number(newData.graduation_year) || 2022,
        department: newData.department,
        current_company: newData.current_company,
        current_position: newData.current_title,
        location: newData.location,
        linkedin_url: newData.linkedin_url,
        bio: newData.bio,
      });
    } catch (err) {
      console.error("Failed to persist profile edits:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <ProfileHeader
        userRole="alumni"
        name={profileData.name}
        subtitle={`${profileData.current_title || "Alumni"} at ${profileData.current_company || "COMSATS"}`}
        department={profileData.department}
        location={profileData.location}
        bio={profileData.bio}
        linkedinUrl={profileData.linkedin_url}
        avatarUrl={profileData.avatar_url}
        coverUrl={profileData.cover_url}
        onAvatarUpdated={(url) => setProfileData((p) => ({ ...p, avatar_url: url }))}
        onCoverUpdated={(url) => setProfileData((p) => ({ ...p, cover_url: url }))}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <div className="flex border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'activity' ? 'border-[#041C2C] text-[#041C2C]' : 'border-transparent text-[#64748B] hover:text-[#041C2C]'
          }`}
        >
          My Posts
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
        {activeTab === 'activity' && (
          <Card className="p-8 text-center border-dashed border-[#CBD5E1] bg-gray-50/50">
            <p className="text-sm font-medium text-[#64748B]">Activity feed coming soon...</p>
          </Card>
        )}
        
        {activeTab === 'saved' && (
          <SavedPostsList />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleSaveProfile}
        userRole="alumni"
      />
    </div>
  );
}

export default AlumniProfile;
