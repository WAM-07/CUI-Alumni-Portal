"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Edit2, MapPin, Briefcase, GraduationCap, Linkedin, Award, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import alumniApi from "../../lib/api/alumni";
import studentApi from "../../lib/api/student";
import industryApi from "../../lib/api/industry";

export function ProfileHeader({
  userRole = "alumni",
  name,
  subtitle,
  department,
  location,
  bio,
  linkedinUrl,
  avatarUrl,
  coverUrl,
  onEditClick,
  onUploadCVClick,
  onAvatarUpdated,
  onCoverUpdated,
}) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);
  const [currentCoverUrl, setCurrentCoverUrl] = useState(coverUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (avatarUrl) setCurrentAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    if (coverUrl) setCurrentCoverUrl(coverUrl);
  }, [coverUrl]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setCurrentAvatarUrl(previewUrl);

    setUploadingAvatar(true);
    try {
      let res;
      if (userRole === "student") {
        res = await studentApi.uploadAvatar(file);
      } else if (userRole === "industry") {
        res = await industryApi.uploadAvatar(file);
      } else {
        res = await alumniApi.uploadAvatar(file);
      }
      const newUrl = res?.avatar_url || res?.data?.avatar_url || previewUrl;
      setCurrentAvatarUrl(newUrl);
      onAvatarUpdated?.(newUrl);
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar image. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setCurrentCoverUrl(previewUrl);

    setUploadingCover(true);
    try {
      let res;
      if (userRole === "student") {
        res = await studentApi.uploadCover(file);
      } else if (userRole === "industry") {
        res = await industryApi.uploadCover(file);
      } else {
        res = await alumniApi.uploadCover(file);
      }
      const newUrl = res?.cover_url || res?.data?.cover_url || previewUrl;
      setCurrentCoverUrl(newUrl);
      onCoverUpdated?.(newUrl);
    } catch (err) {
      console.error("Cover upload error:", err);
      alert("Failed to upload cover banner. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  const roleColors = {
    alumni: "bg-blue-100 text-blue-800 border-blue-200",
    industry: "bg-purple-100 text-purple-800 border-purple-200",
    student: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-[#0F2942] group">
        {currentCoverUrl ? (
          <img src={currentCoverUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0F2942] to-[#041C2C]" />
        )}
        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
          className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
        >
          {uploadingCover ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          <span>{uploadingCover ? "Uploading..." : "Change Cover"}</span>
        </button>
      </div>

      {/* Profile Details Container */}
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
              {currentAvatarUrl ? (
                <img src={currentAvatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center">
                  <Award className="w-16 h-16" />
                </div>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-2 right-2 p-2.5 bg-white text-[#0F172A] rounded-full shadow-lg border border-[#E2E8F0] hover:bg-gray-50 transition-colors"
              title="Change Profile Picture"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#00A8B5]" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Button onClick={onEditClick} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2 border-[#CBD5E1] text-[#0F172A]">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
            {userRole === "student" && (
              <Button onClick={onUploadCVClick} className="flex-1 sm:flex-none">
                Upload CV
              </Button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleColors[userRole]}`}>
                {userRole.toUpperCase()}
              </span>
            </div>
            <p className="text-base text-[#475569] font-medium">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748B]">
            {department && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> {department}
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {location}
              </div>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#0A66C2] hover:underline font-medium">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#0F172A] mb-2">About</h3>
            <p className="text-sm text-[#475569] leading-relaxed max-w-4xl">
              {bio || "No professional summary provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
