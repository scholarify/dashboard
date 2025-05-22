"use client";

import { Settings } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { getSchoolById, updateSchool } from "@/app/services/SchoolServices";
import { SchoolSchema, SchoolUpdateSchema } from "@/app/models/SchoolModel";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: Settings,
  baseHref: `${BASE_URL}/settings`,
  title: "Settings"
};

function SettingsContent() {
  const [school, setSchool] = useState<SchoolSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();

  // Formulaire pour les paramètres de l'école
  const [formData, setFormData] = useState<SchoolUpdateSchema>({
    _id: "",
    school_id: "",
    name: "",
    email: "",
    address: "",
    website: "",
    phone_number: "",
    principal_name: "",
    established_year: "",
    description: ""
  });

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

          // Initialiser le formulaire avec les données de l'école
          setFormData({
            _id: schoolData._id,
            school_id: schoolData.school_id,
            name: schoolData.name,
            email: schoolData.email || "",
            address: schoolData.address || "",
            website: schoolData.website || "",
            phone_number: schoolData.phone_number || "",
            principal_name: schoolData.principal_name,
            established_year: schoolData.established_year,
            description: schoolData.description || ""
          });
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

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Mettre à jour les données de l'école
      await updateSchool(formData.school_id, formData);
      setSubmitStatus(createSuccessNotification("School settings updated successfully"));
    } catch (error) {
      console.error("Error updating school:", error);
      setSubmitStatus(createErrorNotification("Failed to update school settings"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularLoader size={32} color="teal" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Settings</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="principal_name" className="block text-sm font-medium text-gray-700">Principal Name</label>
            <input
              type="text"
              id="principal_name"
              name="principal_name"
              value={formData.principal_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label htmlFor="established_year" className="block text-sm font-medium text-gray-700">Established Year</label>
            <input
              type="text"
              id="established_year"
              name="established_year"
              value={formData.established_year}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
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
        <SettingsContent />
      </SchoolLayout>
    </Suspense>
  );
}
