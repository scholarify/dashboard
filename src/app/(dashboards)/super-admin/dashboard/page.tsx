"use client";

import { LayoutDashboard, } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";

const BASE_URL = "/super-admin";


const navigation = {
  icon: LayoutDashboard,
  baseHref: `${BASE_URL}/dashboard`,
  title: "Dashboard"
};

export default function Page() {
  return (
    <SuperLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div>HERE IS DASHBOARD PAGE</div>
    </SuperLayout>
  );
}
