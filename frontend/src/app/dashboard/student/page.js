"use client";

import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import StudentDashboardView from "../../../components/student/StudentDashboardView";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  
  return (
    <StudentDashboardView user={user} />
  );
}
