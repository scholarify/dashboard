"use client";

import { School } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSchoolModal from "../components/CreateSchoolModal";
import DeleteSchoolModal from "../components/DeleteSchoolModal";
import CircularLoader from "@/components/widgets/CircularLoader";
import { deleteSchool, getSchoolById, updateSchool } from "@/app/services/SchoolServices";
import { SchoolSchema, SchoolUpdateSchema } from "@/app/models/SchoolModel";
import NotificationCard from "@/components/NotificationCard";
import { verifyPassword } from "@/app/services/UserServices";
import useAuth from "@/app/hooks/useAuth";



const BASE_URL = "/super-admin";

const navigation = {
    icon: School,
    baseHref: `${BASE_URL}/schools`,
    title: "School Details",
};

function SchoolViewDetailContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("id");

    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationCard, setNotificationCard] = useState({
        message: "",
        type: "",
    });
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
                } else {
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
        // Simuler une vérification de mot de passe (dans un vrai projet, fais une requête API)
        const passwordVerified = user ? await verifyPassword(password, user.email) : false;
        console.log("passwordVerified", passwordVerified);
        if (!passwordVerified) {
            setNotificationCard({
                message: "Invalid password. Please try again.",
                type: "error",
            });
            setIsNotificationCard(true);
            return;
        }
        if (!schoolId) {
            throw new Error("School ID is null. Cannot delete school.");
        }
        const deleted = await deleteSchool(schoolId);
        if (deleted) {
            setNotificationCard({
                message: "School deleted successfully",
                type: "success",
            });
            setIsNotificationCard(true);
            router.push(`${BASE_URL}/schools`);
        }
    }

// Gérer la sauvegarde après modification
const handleSave = async (schoolData: SchoolSchema) => {
    if (school) {
        setLoadingData(true);
        try {
            const updatedSchool: SchoolUpdateSchema = {
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
            if (schoolData.school_id) {
                if (school.school_id) {
                    const data = await updateSchool(school.school_id, updatedSchool);
                    if (data) {
                        setSchool(data);
                        setIsNotificationCard(true);
                        setNotificationCard({
                            message: "School updated successfully",
                            type: "success",
                        });
                    }
                } else {
                    console.error("School ID is undefined. Cannot update school.");
                }
            }
        } catch (error) {
            console.error("Error updating school:", error);
        } finally {
            setLoadingData(false);
            setIsEditModalOpen(false); // Ferme le modal après la sauvegarde}

        }

    }
};

if (!school) {
    return <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
        <CircularLoader size={32} color="teal" />
    </div>;
}

if (loadingData) {
    return <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
        <CircularLoader size={32} color="teal" />
    </div>;
}

return (
    <div>
        {isNotificationCard && (
            <NotificationCard
                title="Notification"
                icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d " strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" />
                        <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d " strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" />
                    </svg>

                }
                message={notificationCard.message}
                onClose={() => setIsNotificationCard(false)}
                type={notificationCard.type}
                isVisible={isNotificationCard}
                isFixed={true}
            />
        )

        }
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
                        <p className="text-sm text-foreground">{school.phone_number || "N/A"}</p>
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
                        email: school.email || "",
                        address: school.address || "",
                        website: school.website || "",
                        principal_name: school.principal_name,
                        established_year: school.established_year,
                        phone_number: school.phone_number || "",
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