"use client";

import { School } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { getSchoolById } from "@/app/services/SchoolServices";
import { SchoolSchema } from "@/app/models/SchoolModel";
import NotificationCard from "@/components/NotificationCard";
import { createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/school`,
  title: "School"
};

function SchoolContent() {
  const [school, setSchool] = useState<SchoolSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();

  // Charger les données de l'école au chargement de la page
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const schoolData = await getSchoolById(schoolId);
          setSchool(schoolData);
        }
      } catch (error) {
        console.error("Error fetching school:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch school data"));
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularLoader size={32} color="teal" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">School Information</h1>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">No school information found. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Information</h1>

      {submitStatus && (
        <div className="mb-4">
          <NotificationCard
            type={submitStatus.type}
            title={submitStatus.title}
            message={submitStatus.message}
            onClose={() => setSubmitStatus(null)}
            isVisible={true}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{school.name}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">ID:</span> {school.school_id}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Email:</span> {school.email || "Not specified"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Phone:</span> {school.phone_number || "Not specified"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Website:</span> {school.website || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Principal:</span> {school.principal_name}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Established:</span> {school.established_year}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Address:</span> {school.address || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-600">{school.description || "No description available."}</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const { logout } = useAuth();
  return (
    <Suspense fallback={
      <div>
        <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
          <CircularLoader size={32} color="teal" />
        </div>
      </div>
    }>
      <SchoolLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => logout()}
      >
        <SchoolContent />
      </SchoolLayout>
    </Suspense>
  );
}
