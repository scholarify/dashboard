"use client";

import { 
  Wallet, 
  School, 
  Users, 
  LayoutDashboard, 
  Presentation, 
  GraduationCap, 
  Settings 
} from "lucide-react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

const BASE_URL = "/super-admin";

const sidebarNav = [
  { icon: LayoutDashboard, name: "Dashboard", href: `${BASE_URL}/dashboard` },
  { icon: School, name: "Schools", href: `${BASE_URL}/schools` },
  { icon: Users, name: "Users", href: `${BASE_URL}/users` },
  { icon: Wallet, name: "Subscription", href: `${BASE_URL}/subscription` },
  { icon: Presentation, name: "Classes", href: `${BASE_URL}/classes` },
  { icon: GraduationCap, name: "Students", href: `${BASE_URL}/students` },
];

const settingsLink = { 
  icon: Settings, 
  name: "Settings", 
  href: `${BASE_URL}/settings` 
};

const navigation = {
  icon: LayoutDashboard,
  baseHref: `${BASE_URL}/dashboard`,
  title: "Dashboard"
};

export default function Page() {
  return (
    <DashboardLayout
      sidebarNav={sidebarNav}
      settingsLink={settingsLink}
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div>HERE IS DASHBOARD PAGE</div>
    </DashboardLayout>
  );
}
