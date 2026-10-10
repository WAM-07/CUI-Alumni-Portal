"use client";

import React, { useState, useEffect, useCallback } from "react";
import { notificationsApi } from "../../../../lib/api/notifications";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { Spinner } from "../../../../components/ui/Spinner";
import {
  Bell,
  CheckCheck,
  Trash2,
  Inbox,
  AlertCircle,
  Briefcase,
  UserCheck,
  Info,
} from "lucide-react";

export default function IndustryNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsApi.getNotifications({ limit: 50 });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to retrieve notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      alert(err.message || "Failed to update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      alert(err.message || "Failed to mark all notifications as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message || "Failed to remove notification.");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type) => {
    switch (type) {
      case "application":
      case "applicant":
        return <UserCheck className="w-4 h-4 text-[#1E3A8A]" />;
      case "job":
        return <Briefcase className="w-4 h-4 text-[#059669]" />;
      default:
        return <Info className="w-4 h-4 text-[#64748B]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
            Communication Center
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-1 flex items-center gap-2.5">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E3A8A] text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time updates regarding applicant submissions, status changes, and administrative notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-[#059669]" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-center gap-3 text-xs text-[#B91C1C]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filter === "all"
              ? "bg-[#0F2942] text-white"
              : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filter === "unread"
              ? "bg-[#0F2942] text-white"
              : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-[#64748B]">Loading notifications feed...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-dashed border-[#CBD5E1] rounded-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#64748B]">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">No Notifications</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            {filter === "unread"
              ? "All caught up! You have no unread notifications at this time."
              : "You do not have any notices or candidate activity in your inbox yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 transition-all flex items-start justify-between gap-4 ${
                !notif.is_read
                  ? "border-l-4 border-l-[#1E3A8A] bg-[#F8FAFC]"
                  : "hover:border-[#CBD5E1]"
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm tracking-tight ${
                        !notif.is_read
                          ? "font-bold text-[#0F172A]"
                          : "font-medium text-[#334155]"
                      }`}
                    >
                      {notif.title || "Notification"}
                    </h4>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                    )}
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed">
                    {notif.message}
                  </p>

                  <span className="text-[11px] text-[#94A3B8] block pt-1">
                    {new Date(notif.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                    title="Mark as read"
                    className="text-xs text-[#1E3A8A] hover:bg-[#EFF6FF] px-2 py-1"
                  >
                    Mark Read
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(notif.id)}
                  title="Delete"
                  className="p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
