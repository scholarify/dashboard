"use client";

import { LayoutDashboard } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";

const BASE_URL = "/school-admin";


const navigation = {
  icon: LayoutDashboard,
  baseHref: `${BASE_URL}/dashboard`,
  title: "Dashboard"
};

export default function Page() {
  return (
    <SchoolLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div>HERE IS SCHOOL ADMIN DASHBOARD PAGE</div>
    </SchoolLayout>
  );
}
