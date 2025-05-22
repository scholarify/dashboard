"use client";

import { DollarSign, GraduationCap, LayoutDashboard, School, Users } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import StatsOverview from "@/components/widgets/StatsOverview";
import AChart from "@/components/utils/AChart";
import PerformanceTable from "@/components/utils/PerformanceTable";
import useAuth from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";
import CircularLoader from "@/components/widgets/CircularLoader";
import { getStudentsBySchool } from "@/app/services/StudentServices";
import { StudentSchema } from "@/app/models/StudentModel";

const BASE_URL = "/school-admin";

const navigation = {
  icon: LayoutDashboard,
  baseHref: `${BASE_URL}/dashboard`,
  title: "Dashboard"
};

// Données de performance statiques pour simuler les données des classes
const performanceData = [
  {
    id: "CLS001",
    schoolName: "Class 6A",
    metrics: {
      "Number of Students": 32,
      "Average Grade": 85,
    },
  },
  {
    id: "CLS002",
    schoolName: "Class 7B",
    metrics: {
      "Number of Students": 28,
      "Average Grade": 88,
    },
  },
  {
    id: "CLS003",
    schoolName: "Class 8C",
    metrics: {
      "Number of Students": 30,
      "Average Grade": 82,
    },
  },
  {
    id: "CLS004",
    schoolName: "Class 9A",
    metrics: {
      "Number of Students": 25,
      "Average Grade": 90,
    },
  },
  {
    id: "CLS005",
    schoolName: "Class 10B",
    metrics: {
      "Number of Students": 27,
      "Average Grade": 78,
    },
  },
];

// Liste des métriques disponibles
const metricOptions = ["Number of Students", "Average Grade"];

export default function Page() {
  const { logout, user } = useAuth();
  const [students, setStudents] = useState<StudentSchema[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données des étudiants pour l'école de l'administrateur
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user && user.school_ids && user.school_ids.length > 0) {
          // Utiliser le premier ID d'école associé à l'administrateur
          const schoolId = user.school_ids[0];
          const studentsData = await getStudentsBySchool(schoolId);
          setStudents(studentsData);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user]);

  if (loading) {
    return (
      <SchoolLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => logout()}
      >
        <div className="flex justify-center items-center h-64">
          <CircularLoader size={32} color="teal" />
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => logout()}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsOverview value="3,245" changePercentage={5.78} title="Total Revenue (USD)" icon={<DollarSign />} />
          <StatsOverview value="142" changePercentage={2.35} title="Total Teachers" icon={<Users />} />
          <StatsOverview value={students.length.toString()} changePercentage={3.48} title="Total Students" icon={<GraduationCap />} />
          <StatsOverview value="32" changePercentage={1.25} title="Total Classes" icon={<School />} />
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
    </SchoolLayout>
  );
}
