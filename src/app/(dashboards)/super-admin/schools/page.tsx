"use client";

import { School } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { Suspense, useEffect, useState } from "react";
import DataTable from "@/components/utils/DataTable";
import { useRouter } from "next/navigation";
import CreateSchoolModal from "./components/CreateSchoolModal";
import DeleteSchoolModal from "./components/DeleteSchoolModal";
import CircularLoader from "@/components/widgets/CircularLoader";
import useAuth from "@/app/hooks/useAuth";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { SchoolCreateSchema, SchoolSchema } from "@/app/models/SchoolModel";
import { createSchool, deleteSchool, getSchools } from "@/app/services/SchoolServices";
import Link from "next/link";
import NotificationCard from "@/components/NotificationCard";
import { verifyPassword } from "@/app/services/UserServices";


const BASE_URL = "/super-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/schools`,
  title: "Schools",
};



function SchoolContent() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolSchema[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const {user} = useAuth();
  const fetchSchools = async () => {
    setLoadingData(true);
    try {
      const fetchedSchools = await getSchools();
      setSchools(fetchedSchools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    fetchSchools();
  }, []);
  
  const [selectedSchools, setSelectedSchools] = useState<SchoolSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // État pour le modal de suppression
  const [schoolToDelete, setSchoolToDelete] = useState<SchoolSchema | null>(null); // École à supprimer
  
  const [isNotificationCard, setIsNotificationCard] = useState(false);
  const [notificationCard, setNotificationCard] = useState({
    message: "",
    type: "",
  });

  // Colonnes du tableau
  const columns = [
    { header: "School ID", accessor: (row: SchoolSchema) => row.school_id },
    { header: "School Name", accessor: (row: SchoolSchema) => { return <Link href={`${BASE_URL}/schools/view?id=${row.school_id}`}>{row.name}</Link>; } },
    { header: "Email", accessor: (row: SchoolSchema) => row.email },
    { header: "Principal", accessor: (row: SchoolSchema) => row.principal_name },
    { header: "Established Year", accessor: (row: SchoolSchema) => row.established_year },
    { header: "Address", accessor: (row: SchoolSchema) => row.address },
    { header: "Website", accessor: (row: SchoolSchema) => row.website },
    { header: "Phone Number", accessor: (row: SchoolSchema) => row.phone_number },
  ];

  // Gérer la suppression d'une école
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
    if (schoolToDelete) {
      if (schoolToDelete?.school_id) {
        const deleted = await deleteSchool(schoolToDelete.school_id);
        if (deleted) {
          fetchSchools();
          setNotificationCard({
            message: "School deleted successfully",
            type: "success",
          });
          setIsNotificationCard(true);
        }
      } else {
        setNotificationCard({
          message: "Failed to delete school. Please try again.",
          type: "error",
        });
        setIsNotificationCard(true);
      }
    }
  };

  // Actions
  const actions = [
    {
      label: "View",
      onClick: (school: SchoolSchema) => {
        router.push(`${BASE_URL}/schools/view?id=${school.school_id}`);
      },
    },
    {
      label: "Delete",

      onClick: (school: SchoolSchema) => {
        setSchoolToDelete(school); // Stocker l'école à supprimer
        setIsDeleteModalOpen(true); // Ouvrir le modal de suppression
      },
    },
  ];

  // Gérer la suppression multiple
  const handleDeleteSelected = () => {
    if (selectedSchools.length === 0) {
    alert("Please select at least one school to delete.");
    return;
  }

  // Récupérer les clés des lignes sélectionnées depuis le bouton
  const deleteButton = document.querySelector("[data-remove-items-id]");
  const keysToDelete = deleteButton?.getAttribute("data-remove-items-id")?.split(",") || [];

  if (confirm(`Are you sure you want to delete ${selectedSchools.length} school(s)?`)) {
    // Filtrer les écoles en utilisant les clés
    const newSchools = schools.filter((school, index) => {
      const key = school.id ? String(school.id) : `row-${index}`;
      return !keysToDelete.includes(key);
    });
    setSchools(newSchools);
    setSelectedSchools([]);
  }
  };

  // Gérer l'ajout d'une nouvelle école
  const handleSave = async (schoolData: SchoolCreateSchema) => {
    setLoadingData(true);
    try {
      const newSchool: SchoolCreateSchema = {
        name: schoolData.name,
        email: schoolData.email,
        principal_name: schoolData.principal_name,
        established_year: new Date().toLocaleDateString("en-US"),
        address: schoolData.address,
        website: schoolData.website,
        phone_number: schoolData.phone_number,
        description: schoolData.description,
      };
      const data = await createSchool(newSchool);
      if (data) {
        const school: SchoolSchema = {
          _id:data._id,
          school_id: data.school_id,
          name: data.name,
          email: data.email,
          principal_name: data.principal_name,
          established_year: data.established_year,
          address: data.address,
          website: data.website,
          phone_number: data.phone_number,
          description: data.description,
        };
        setSchools((prev) => [...prev, school]);
        setNotificationCard({
          message: "School created successfully",
          type: "success",
        });
        setIsNotificationCard(true);
      }
    } catch (error) {
      console.error("Error creating school:", error);

    } finally {
      setIsModalOpen(false);
      setLoadingData(false);
    }

  };



  return (
    <div className="md:p-6">
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
      >
        Add New School
      </button>

      <DataTable<SchoolSchema>
        columns={columns}
        data={schools}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedSchools}
      />

      {/* Modal pour ajouter une école */}
      {isModalOpen && (
        <CreateSchoolModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal pour supprimer une école */}
      {isDeleteModalOpen && schoolToDelete && (
        <DeleteSchoolModal
          schoolName={schoolToDelete.name}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSchoolToDelete(null);
          }}
          onDelete={handleDelete}
        />
      )}
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
      <ProtectedRoute>
        <SuperLayout
          navigation={navigation}
          showGoPro={true}
          onLogout={() => logout()}
        >
          <SchoolContent />
        </SuperLayout>
      </ProtectedRoute>
    </Suspense>
  )
}