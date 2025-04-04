"use client";

import { DollarSign, GraduationCap, LayoutDashboard, School, User, UserIcon } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import StatsOverview from "@/components/widgets/StatsOverview";
import AChart from "@/components/utils/AChart";
import PerformanceTable from "@/components/utils/PerformanceTable";
const BASE_URL = "/super-admin";


const navigation = {
  icon: LayoutDashboard,
  baseHref: `${BASE_URL}/dashboard`,
  title: "Dashboard"
};

const performanceData = [
  {
    id: "SCH001",
    schoolName: "Acme High",
    metrics: {
      "Number of Active Subscriptions": 156,
      "Average Grade": 85,
    },
  },
  {
    id: "SCH002",
    schoolName: "Sabadan High",
    metrics: {
      "Number of Active Subscriptions": 158,
      "Average Grade": 88,
    },
  },
  {
    id: "SCH003",
    schoolName: "Valley View Academy",
    metrics: {
      "Number of Active Subscriptions": 129,
      "Average Grade": 82,
    },
  },
  {
    id: "SCH004",
    schoolName: "Hilltop College Prep",
    metrics: {
      "Number of Active Subscriptions": 120,
      "Average Grade": 90,
    },
  },
  {
    id: "SCH005",
    schoolName: "Tom Tom Academy",
    metrics: {
      "Number of Active Subscriptions": 110,
      "Average Grade": 78,
    },
  },
  {
    id: "SCH006",
    schoolName: "Sability High College",
    metrics: {
      "Number of Active Subscriptions": 105,
      "Average Grade": 80,
    },
  },
  {
    id: "SCH007",
    schoolName: "IminLove Sketch School",
    metrics: {
      "Number of Active Subscriptions": 97,
      "Average Grade": 75,
    },
  },
];

// Liste des métriques disponibles
const metricOptions = ["Number of Active Subscriptions", "Average Grade"];

export default function Page() {
  return (
    <SuperLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsOverview value="12,058" changePercentage={5.78} title="Total Revenue (USD)" icon={<DollarSign />} />
          <StatsOverview value="9,842" changePercentage={-2.35} title="Total Schools" icon={<School />} />
          <StatsOverview value="12,058" changePercentage={5.78} title="Total Students" icon={<GraduationCap />} />
          <StatsOverview value="9,842" changePercentage={-2.35} title="Total Users" icon={<UserIcon />} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-lg border border-stroke p-4 h-max">
            <AChart />
          </div>
          <PerformanceTable
            data={performanceData}
            defaultItemsPerPage={5}
            metricOptions={metricOptions}
          />
        </div>

      </div>
    </SuperLayout>
  );
}
