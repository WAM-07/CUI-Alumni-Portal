"use client";

import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import AlumniDashboardView from "../../../components/alumni/AlumniDashboardView";

export default function AlumniDashboardPage() {
  const { user } = useAuth();
  
  return (
    <AlumniDashboardView user={user} />
  );
}
