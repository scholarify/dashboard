"use client";

import { School } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSchoolModal from "../components/CreateSchoolModal";
import DeleteSchoolModal from "../components/DeleteSchoolModal";

// Interface pour les données des écoles
interface School {
  id: string;
  name: string;
  email: string;
  principal: string;
  creationDate: string;
  address?: string;
  website?: string;
  phoneNumber?: string;
  description?: string;
}

// Données d'exemple (simulées, à remplacer par une API dans un vrai projet)
const schoolsData: School[] = [
  {
    id: "SCH001",
    name: "Acme High",
    email: "contact@loremipsum.com",
    principal: "Michael Jackson",
    creationDate: "03/12/1989",
    address: "123 Lorem Ipsum, Birmingham",
    website: "https://franckeldev.com",
    phoneNumber: "+44 550 123 4567",
    description:
      "We live, our hearts colder. Cause pain is what we go through as we become older. We get insulted by others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a hand.",
  },
  {
    id: "SCH002",
    name: "Sabadan High",
    email: "contact@loremipsum.com",
    principal: "Michael Jackson",
    creationDate: "03/12/1989",
    address: "456 Oak St",
    website: "https://franckeldev.com",
    phoneNumber: "+44 550 987 6543",
    description: "A great school with a rich history.",
  },
  // Ajoute d'autres écoles si nécessaire
];

const BASE_URL = "/super-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/schools`,
  title: "School Details",
};

export default function SchoolViewDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("id");

  const [school, setSchool] = useState<School | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Charger les détails de l'école en fonction de l'ID
  useEffect(() => {
    if (schoolId) {
      const foundSchool = schoolsData.find((s) => s.id === schoolId);
      if (foundSchool) {
        setSchool(foundSchool);
      } else {
        // Rediriger si l'école n'est pas trouvée
        router.push(`${BASE_URL}/schools`);
      }
    }
  }, [schoolId, router]);

  // Gérer la suppression de l'école
  const handleDelete = async (password: string) => {
    try {
        const response = await fetch("/api/verify-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });
        const data = await response.json();
        if (!data.isValid) {
          alert("Incorrect password. Please try again.");
          return;
        }
    
        if (school) {
          const deleteResponse = await fetch(`/api/schools/${school.id}`, {
            method: "DELETE",
          });
          if (deleteResponse.ok) {
            router.push(`${BASE_URL}/schools`);
          } else {
            alert("Failed to delete school. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error deleting school:", error);
        alert("An error occurred. Please try again.");
      }
  };

  // Gérer la sauvegarde après modification
  const handleSave = (schoolData: any) => {
    if (school) {
      const updatedSchool: School = {
        id: school.id,
        name: schoolData.schoolName,
        email: schoolData.email,
        principal: schoolData.principalName,
        creationDate: school.creationDate,
        address: schoolData.address,
        website: schoolData.website,
        phoneNumber: schoolData.phoneNumber,
        description: schoolData.description,
      };
      // Simuler la mise à jour (dans un vrai projet, fais une requête API)
      const index = schoolsData.findIndex((s) => s.id === school.id);
      if (index !== -1) {
        schoolsData[index] = updatedSchool;
        setSchool(updatedSchool);
      }
    }
  };

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <SuperLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div className="md:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Titre */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {school.name} Details
          </h1>

          {/* Section School Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              School Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {school.description || "No description available."}
            </p>
          </div>

          {/* Grille des informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* School ID */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                School ID
              </p>
              <p className="text-sm text-foreground">{school.id}</p>
            </div>

            {/* Principal */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Principal
              </p>
              <p className="text-sm text-foreground">{school.principal}</p>
            </div>

            {/* School Name */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                School Name
              </p>
              <p className="text-sm text-foreground">{school.name}</p>
            </div>

            {/* Creation Date */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Creation Date
              </p>
              <p className="text-sm text-foreground">{school.creationDate}</p>
            </div>

            {/* Email */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Email
              </p>
              <p className="text-sm text-foreground">{school.email}</p>
            </div>

            {/* Website */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Website
              </p>
              <p className="text-sm text-foreground">
                {school.website ? (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline"
                  >
                    {school.website}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>

            {/* Address */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Address
              </p>
              <p className="text-sm text-foreground">{school.address || "N/A"}</p>
            </div>

            {/* Phone Number */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Phone Number
              </p>
              <p className="text-sm text-foreground">{school.phoneNumber || "N/A"}</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
            >
              Edit School
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)} // Ouvre le modal de suppression
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete School
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour l'édition */}
      {isEditModalOpen && (
        <CreateSchoolModal
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          initialData={
            {
                schoolName: school.name,
                email: school.email,
                address: school.address || "",
                website: school.website || "",
                principalName: school.principal,
                creationDate: school.creationDate,
                phoneNumber: school.phoneNumber || "",
                description: school.description || "",
            }
          }
        />
      )}

      {/* Modal pour la suppression */}
      {isDeleteModalOpen && (
        <DeleteSchoolModal
          schoolName={school.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </SuperLayout>
  );
}