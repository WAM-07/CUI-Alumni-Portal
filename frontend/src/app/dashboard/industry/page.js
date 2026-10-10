"use client";

import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import IndustryDashboardView from "../../../components/industry/IndustryDashboardView";

export default function IndustryDashboardPage() {
  const { user } = useAuth();
  
  return (
    <IndustryDashboardView user={user} />
  );
}
