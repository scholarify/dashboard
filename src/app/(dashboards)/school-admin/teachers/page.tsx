"use client";

import { Users } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getUsers } from "@/app/services/UserServices";
import { UserSchema } from "@/app/models/UserModel";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: Users,
  baseHref: `${BASE_URL}/teachers`,
  title: "Teachers"
};

function TeachersContent() {
  const [teachers, setTeachers] = useState<UserSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedTeachers, setSelectedTeachers] = useState<UserSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<UserSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Référence aux fonctions de gestion des modales pour éviter les avertissements
  const handleSaveRef = React.useRef<(teacherData: any) => Promise<void>>();
  const handleDeleteRef = React.useRef<() => Promise<void>>();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      accessor: (row: UserSchema) => row.name
    },
    {
      header: "Email",
      accessorKey: "email",
      accessor: (row: UserSchema) => row.email
    },
    {
      header: "Phone",
      accessorKey: "phone",
      accessor: (row: UserSchema) => row.phone || "N/A"
    },
    {
      header: "Actions",
      accessor: (row: UserSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewTeacher(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteTeacher(props.row.original)}
            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Actions pour le tableau
  const actions = [
    {
      label: "Delete Selected",
      onClick: () => {
        if (selectedTeachers.length > 0) {
          // Logique pour supprimer les enseignants sélectionnés
          console.log("Delete selected teachers:", selectedTeachers);
        }
      },
      disabled: selectedTeachers.length === 0,
    },
  ];

  // Charger les enseignants au chargement de la page
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const allUsers = await getUsers();
          // Filtrer les utilisateurs pour n'afficher que les enseignants de l'école de l'administrateur
          const schoolTeachers = allUsers.filter(
            (user: UserSchema) => user.role === "teacher" && user.school_ids && user.school_ids.includes(schoolId)
          );
          setTeachers(schoolTeachers);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch teachers"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchTeachers();
  }, [user]);

  // Gérer la visualisation d'un enseignant
  const handleViewTeacher = (teacherData: UserSchema) => {
    router.push(`/school-admin/teachers/view?id=${teacherData._id}`);
  };

  // Gérer la suppression d'un enseignant
  const handleDeleteTeacher = (teacherData: UserSchema) => {
    setTeacherToDelete(teacherData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'un nouvel enseignant
  const handleSave = async (teacherData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer un nouvel enseignant
      console.log("Create new teacher:", teacherData);
      setSubmitStatus(createSuccessNotification("Teacher created successfully"));
    } catch (error) {
      console.error("Error creating teacher:", error);
      setSubmitStatus(createErrorNotification("Failed to create teacher"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleSaveRef.current = handleSave;

  // Gérer la suppression d'un enseignant
  const handleDelete = async () => {
    if (!teacherToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer un enseignant
      console.log("Delete teacher:", teacherToDelete);
      setSubmitStatus(createSuccessNotification("Teacher deleted successfully"));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setSubmitStatus(createErrorNotification("Failed to delete teacher"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleDeleteRef.current = handleDelete;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>

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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
      >
        Add New Teacher
      </motion.button>

      <DataTableFix<UserSchema>
        columns={columns}
        data={teachers}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedTeachers}
      />

      {/* Modal pour ajouter un enseignant - à implémenter */}
      {/* Modal pour supprimer un enseignant - à implémenter */}
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
        <TeachersContent />
      </SchoolLayout>
    </Suspense>
  );
}
