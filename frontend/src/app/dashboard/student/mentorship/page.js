"use client";

import React, { useState, useEffect } from "react";
import mentorshipApi from "../../../../lib/api/mentorship";
import { Users, Search, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default function StudentMentorshipPage() {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' | 'requests' | 'chat'
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchMentors();
    fetchRequests();
  }, []);

  const fetchMentors = async () => {
    try {
      const data = await mentorshipApi.getMentors();
      setMentors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await mentorshipApi.getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (alumniId) => {
    try {
      await mentorshipApi.createRequest(alumniId);
      alert("Connection request sent!");
      fetchRequests();
    } catch (err) {
      alert("Failed to send request. You may have already requested this mentor.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const openChat = (mentorId) => {
    setActiveChat(mentorId);
    setActiveTab("chat");
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mentorship Network</h1>
        <p className="text-sm text-[#64748B]">Connect with alumni mentors for guidance and career support.</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 ${activeTab === 'browse' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-transparent text-[#64748B]'}`}
        >
          Browse Mentors
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 ${activeTab === 'requests' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-transparent text-[#64748B]'}`}
        >
          My Connections
        </button>
        {activeTab === 'chat' && (
          <button className="px-4 py-3 text-sm font-semibold border-b-2 border-[#1E3A8A] text-[#1E3A8A]">
            Chat Messages
          </button>
        )}
      </div>

      {activeTab === "browse" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.length === 0 ? (
            <p className="text-sm text-[#64748B] col-span-3">No alumni have opted in as mentors yet.</p>
          ) : (
            mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#041C2C] to-[#00A8B5] mx-auto p-0.5 mb-3 shadow-md">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {mentor.avatar_url ? (
                        <img src={mentor.avatar_url} alt={mentor.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-[#041C2C]">
                          {(mentor.name || mentor.email || "M").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">{mentor.name || mentor.email}</h3>
                  <p className="text-xs font-semibold text-[#00A8B5] mt-0.5">
                    {mentor.current_position ? `${mentor.current_position}` : "Alumni Mentor"}
                    {mentor.current_company ? ` at ${mentor.current_company}` : ""}
                  </p>
                  {mentor.department && (
                    <p className="text-[11px] text-[#64748B] mt-1">{mentor.department}</p>
                  )}
                  {mentor.bio && (
                    <p className="text-xs text-[#475569] mt-3 line-clamp-2 italic px-2">"{mentor.bio}"</p>
                  )}
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => handleConnect(mentor.id)}
                    className="w-full py-2.5 bg-[#041C2C] hover:bg-[#00A8B5] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Request Connection
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-sm text-[#64748B]">You have no active mentorship requests.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-[#0F172A]">Request to {req.alumni_name || "Alumni Mentor"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(req.status)}
                    <span className="text-xs text-[#64748B] capitalize">{req.status}</span>
                  </div>
                </div>
                {req.status === "accepted" && (
                  <button 
                    onClick={() => openChat(req.alumni_id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg hover:bg-blue-800"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-bold text-gray-500">M</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A]">Mentor Conversation</h3>
              <p className="text-[10px] text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-4 overflow-y-auto">
             <div className="bg-white p-3 rounded-xl rounded-tl-none self-start border border-[#E2E8F0] max-w-[80%]">
               <p className="text-sm text-[#0F172A]">Hello! I accepted your mentorship request. How can I help you today?</p>
             </div>
             <div className="bg-[#1E3A8A] p-3 rounded-xl rounded-tr-none self-end text-white max-w-[80%]">
               <p className="text-sm">Hi! Thank you so much. I'd love to ask about how you prepared for technical interviews at top firms.</p>
             </div>
             <p className="text-xs text-center text-gray-400 my-4">This is a placeholder chat UI for future messaging features.</p>
          </div>

          <div className="p-4 border-t border-[#E2E8F0] flex gap-2">
            <input 
              type="text" 
              disabled
              placeholder="Type your message... (Coming soon)"
              className="flex-1 bg-gray-50 border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm focus:outline-none"
            />
            <button disabled className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg opacity-50">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
