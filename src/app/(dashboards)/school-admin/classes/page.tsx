"use client";

import { Presentation } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getClasses } from "@/app/services/ClassServices";
import { ClassSchema } from "@/app/models/ClassModel";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: Presentation,
  baseHref: `${BASE_URL}/classes`,
  title: "Classes"
};

function ClassesContent() {
  const [classes, setClasses] = useState<ClassSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<ClassSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Class Name",
      accessorKey: "name",
      accessor: (row: ClassSchema) => row.name
    },
    {
      header: "Class Level",
      accessorKey: "class_level",
      accessor: (row: ClassSchema) => row.class_level
    },
    {
      header: "Class Code",
      accessorKey: "class_code",
      accessor: (row: ClassSchema) => row.class_code
    },
    {
      header: "Actions",
      accessor: (row: ClassSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewClass(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteClass(props.row.original)}
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
        if (selectedClasses.length > 0) {
          // Logique pour supprimer les classes sélectionnées
          console.log("Delete selected classes:", selectedClasses);
        }
      },
      disabled: selectedClasses.length === 0,
    },
  ];

  // Charger les classes au chargement de la page
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const allClasses = await getClasses();
          // Filtrer les classes pour n'afficher que celles de l'école de l'administrateur
          const schoolClasses = allClasses.filter(cls => cls.school_id === schoolId);
          setClasses(schoolClasses);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch classes"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchClasses();
  }, [user]);

  // Gérer la visualisation d'une classe
  const handleViewClass = (classData: ClassSchema) => {
    router.push(`/school-admin/classes/view?id=${classData._id}`);
  };

  // Gérer la suppression d'une classe
  const handleDeleteClass = (classData: ClassSchema) => {
    setClassToDelete(classData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'une nouvelle classe
  const handleSave = async (classData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer une nouvelle classe
      console.log("Create new class:", classData);
      setSubmitStatus(createSuccessNotification("Class created successfully"));
    } catch (error) {
      console.error("Error creating class:", error);
      setSubmitStatus(createErrorNotification("Failed to create class"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'une classe
  const handleDelete = async () => {
    if (!classToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer une classe
      console.log("Delete class:", classToDelete);
      setSubmitStatus(createSuccessNotification("Class deleted successfully"));
    } catch (error) {
      console.error("Error deleting class:", error);
      setSubmitStatus(createErrorNotification("Failed to delete class"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Classes Management</h1>

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
        Add New Class
      </motion.button>

      <DataTableFix<ClassSchema>
        columns={columns}
        data={classes}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedClasses}
      />

      {/* Modal pour ajouter une classe - à implémenter */}
      {/* Modal pour supprimer une classe - à implémenter */}
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
        <ClassesContent />
      </SchoolLayout>
    </Suspense>
  );
}
