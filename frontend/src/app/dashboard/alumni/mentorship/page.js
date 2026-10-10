"use client";

import React, { useState, useEffect } from "react";
import mentorshipApi from "../../../../lib/api/mentorship";
import { useAuth } from "../../../../hooks/useAuth";
import { Check, X, Shield, MessageSquare } from "lucide-react";

export default function AlumniMentorshipPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchOptInStatus();
  }, []);

  const fetchOptInStatus = async () => {
    try {
      const status = await mentorshipApi.getOptInStatus();
      setIsOptedIn(status.is_mentor);
    } catch (err) {
      console.error("Failed to fetch opt-in status:", err);
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

  const handleToggleOptIn = async () => {
    try {
      const newState = !isOptedIn;
      await mentorshipApi.toggleOptIn(newState);
      setIsOptedIn(newState);
      alert(newState ? "You are now visible as a Mentor!" : "You have opted out of the Mentorship network.");
    } catch (err) {
      alert("Failed to update opt-in status.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await mentorshipApi.updateRequestStatus(id, status);
      fetchRequests();
    } catch (err) {
      alert("Failed to update request.");
    }
  };

  const openChat = (studentId) => {
    setActiveChat(studentId);
    setActiveTab("chat");
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Mentorship Requests</h1>
          <p className="text-sm text-[#64748B]">Manage incoming requests from junior cohorts.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] px-4 py-3 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Mentor Status</p>
            <label className="flex items-center cursor-pointer mt-1">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isOptedIn} onChange={handleToggleOptIn} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isOptedIn ? 'bg-[#041C2C]' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isOptedIn ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-xs text-[#64748B]">{isOptedIn ? 'Active' : 'Inactive'}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'requests' ? 'border-[#041C2C] text-[#041C2C]' : 'border-transparent text-[#64748B] hover:text-[#041C2C]'}`}
        >
          Incoming Requests
        </button>
        {activeTab === 'chat' && (
          <button className="px-4 py-3 text-sm font-semibold border-b-2 border-[#041C2C] text-[#041C2C]">
            Chat Session
          </button>
        )}
      </div>

      {activeTab === "requests" && (
        <div className="space-y-4">
          {!isOptedIn && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm mb-4">
              You are currently opted out. Students cannot see your profile in the mentorship directory.
            </div>
          )}
          
          {requests.length === 0 ? (
            <p className="text-sm text-[#64748B]">You have no active mentorship requests.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-[#0F172A]">Request from {req.student_name || "Student"}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">ID: {req.student_id}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Status: <span className="font-semibold capitalize">{req.status}</span></p>
                </div>
                
                <div className="flex gap-2">
                  {req.status === "pending" ? (
                    <>
                      <button onClick={() => handleUpdateStatus(req.id, "accepted")} className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100">
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button onClick={() => handleUpdateStatus(req.id, "rejected")} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : req.status === "accepted" ? (
                    <button onClick={() => openChat(req.student_id)} className="flex items-center gap-2 px-4 py-2 bg-[#041C2C] text-white text-xs font-semibold rounded-lg hover:bg-[#00A8B5] transition-colors">
                      <MessageSquare className="w-4 h-4" /> Message Student
                    </button>
                  ) : (
                    <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full font-semibold">Rejected</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-bold text-gray-500">S</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A]">Student Conversation</h3>
              <p className="text-[10px] text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-4 overflow-y-auto">
             <div className="bg-[#041C2C] p-3 rounded-xl rounded-tr-none self-end text-white max-w-[80%] shadow-sm">
               <p className="text-sm">Hello! I accepted your mentorship request. How can I help you today?</p>
             </div>
             <div className="bg-white p-3 rounded-xl rounded-tl-none self-start border border-[#E2E8F0] max-w-[80%] shadow-sm">
               <p className="text-sm text-[#0F172A]">Hi! Thank you so much. I'd love to ask about how you prepared for technical interviews at top firms.</p>
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
            <button disabled className="px-4 py-2 bg-[#041C2C] text-white text-sm font-semibold rounded-lg opacity-50">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
