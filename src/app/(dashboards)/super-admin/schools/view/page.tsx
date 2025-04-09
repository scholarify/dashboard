"use client";

import { School } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSchoolModal from "../components/CreateSchoolModal";
import DeleteSchoolModal from "../components/DeleteSchoolModal";
import CircularLoader from "@/components/widgets/CircularLoader";
import { getSchoolById } from "@/app/services/SchoolServices";
import { SchoolSchema } from "@/app/models/SchoolModel";



const BASE_URL = "/super-admin";

const navigation = {
    icon: School,
    baseHref: `${BASE_URL}/schools`,
    title: "School Details",
};

function SchoolViewDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("id");

    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Charger les détails de l'école en fonction de l'ID
    useEffect(() => {
        const fetchSchoolDetails = async () => {
            try {
                if (!schoolId) {
                    return;
                }
                const foundSchool = await getSchoolById(schoolId);
                if (foundSchool) {
                    setSchool(foundSchool);
                }else{
                    // Rediriger si l'école n'est pas trouvée
                    router.push(`${BASE_URL}/schools`);
                }
            } catch (error) {
                console.error("Error fetching school details:", error);
            }
        }
        fetchSchoolDetails();
        
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
    const handleSave = (schoolData: SchoolSchema) => {
        if (school) {
            const updatedSchool: SchoolSchema = {
                school_id: school.school_id,
                name: schoolData.name,
                email: schoolData.email,
                principal_name: schoolData.principal_name,
                established_year: school.established_year,
                address: schoolData.address,
                website: schoolData.website,
                phone_numer: schoolData.phone_numer,
                description: schoolData.description,
            };
            // Simuler la mise à jour (dans un vrai projet, fais une requête API)
            // const index = schoolsData.findIndex((s) => s.id === school.school_id);
            // if (index !== -1) {
            //     schoolsData[index] = updatedSchool;
            //     setSchool(updatedSchool);
            // }
        }
    };

    if (!school) {
        return <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
            <CircularLoader size={32} color="teal" />
        </div>;
    }

    return (
        <div>
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
                            <p className="text-sm text-foreground">{school.school_id}</p>
                        </div>

                        {/* Principal */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Principal
                            </p>
                            <p className="text-sm text-foreground">{school.principal_name}</p>
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
                            <p className="text-sm text-foreground">{school.established_year}</p>
                        </div>

                        {/* Email */}
                        {school.email && (

                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Email
                                </p>
                                <p className="text-sm text-foreground">{school.email}</p>
                            </div>
                        )
                        }

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
                            <p className="text-sm text-foreground">{school.phone_numer || "N/A"}</p>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal"
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
                            school_id: school.school_id,
                            name: school.name,
                            email: school.email,
                            address: school.address || "",
                            website: school.website || "",
                            principal_name: school.principal_name,
                            established_year: school.established_year,
                            phone_numer: school.phone_numer || "",
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
        </div>
    );
}

export default function SchoolViewDetail() {
    return (
        <SuperLayout
            navigation={navigation}
            showGoPro={true}
            onLogout={() => console.log("Logged out")}
        >
            <Suspense fallback={
                <div>
                    <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
                        <CircularLoader size={32} color="teal" />
                    </div>
                </div>}
            >
                <SchoolViewDetailContent />
            </Suspense>
        </SuperLayout>
    );
}