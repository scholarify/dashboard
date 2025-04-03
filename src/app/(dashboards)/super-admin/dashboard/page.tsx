"use client";

import { DollarSign, GraduationCap, LayoutDashboard,School,User, UserIcon } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import StatsOverview from "@/components/widgets/StatsOverview";
import AChart from "@/components/utils/AChart";
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
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsOverview value="12,058" changePercentage={5.78} title="Total Revenue (USD)" icon={<DollarSign/>}/>
            <StatsOverview value="9,842" changePercentage={-2.35} title="Total Schools" icon={<School/>}/>
            <StatsOverview value="12,058" changePercentage={5.78} title="Total Students" icon={<GraduationCap/>}/>
            <StatsOverview value="9,842" changePercentage={-2.35} title="Total Users" icon={<UserIcon/>}/>
        </div>
        <div className="rounded-lg border border-stroke p-4">
            <AChart/>
        </div>
      </div>
    </SuperLayout>
  );
}
