"use client";

import { School, } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";

const BASE_URL = "/super-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/school`,
  title: "School"
};

export default function Page() {
  return (
    <SuperLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div>HERE SCHOOL PAGE</div>
    </SuperLayout>
  );
}
