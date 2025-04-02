"use client";

import {School } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";

const BASE_URL = "/school-admin";


const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/school`,
  title: "School"
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
