"use client";

import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";

export function EditProfileModal({ isOpen, onClose, initialData, onSave, userRole }) {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      if (onSave) onSave(formData);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#0F172A]">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#059669]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Profile Updated</h3>
                <p className="text-sm text-[#64748B]">Your changes have been saved successfully.</p>
              </div>
            </div>
          ) : (
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
                
                {userRole === "industry" ? (
                  <Input
                    label="Company Name"
                    value={formData.company_name || ""}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    required
                  />
                ) : (
                  <Input
                    label="Graduation Year"
                    value={formData.graduation_year || ""}
                    onChange={(e) => handleChange("graduation_year", e.target.value)}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={userRole === "industry" ? "Industry Sector" : "Academic Department"}
                  value={formData.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                />

                <Input
                  label="Location"
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>

              {userRole !== "industry" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Current Organization"
                    value={formData.current_company || ""}
                    onChange={(e) => handleChange("current_company", e.target.value)}
                  />

                  <Input
                    label="Professional Title"
                    value={formData.current_title || ""}
                    onChange={(e) => handleChange("current_title", e.target.value)}
                  />
                </div>
              )}

              <Input
                label="LinkedIn Profile URL"
                type="url"
                value={formData.linkedin_url || ""}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />

              <Textarea
                label="Professional Statement / Bio"
                rows={4}
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Share your background and domain expertise..."
              />
            </form>
          )}
        </div>

        {!success && (
          <div className="p-5 border-t border-[#E2E8F0] flex justify-end gap-3 bg-gray-50">
            <Button variant="outline" type="button" onClick={onClose} className="border-[#CBD5E1] text-[#0F172A]">
              Cancel
            </Button>
            <Button type="submit" form="edit-profile-form" loading={saving}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfileModal;
