"use client";

import { GraduationCap } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getStudentsBySchool } from "@/app/services/StudentServices";
import { StudentSchema } from "@/app/models/StudentModel";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: GraduationCap,
  baseHref: `${BASE_URL}/students`,
  title: "Students"
};

function StudentsContent() {
  const [students, setStudents] = useState<StudentSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<StudentSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      accessor: (row: StudentSchema) => row.name
    },
    {
      header: "Class",
      accessor: (row: StudentSchema) => row.class_id || "Not Assigned"
    },
    {
      header: "Guardian",
      accessor: (row: StudentSchema) => row.guardian_name || "Not Specified"
    },
    {
      header: "Contact",
      accessor: (row: StudentSchema) => row.guardian_phone || row.phone || "Not Available"
    },
    {
      header: "Actions",
      accessor: (row: StudentSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewStudent(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteStudent(props.row.original)}
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
        if (selectedStudents.length > 0) {
          // Logique pour supprimer les étudiants sélectionnés
          console.log("Delete selected students:", selectedStudents);
        }
      },
      disabled: selectedStudents.length === 0,
    },
  ];

  // Charger les étudiants au chargement de la page
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const studentsData = await getStudentsBySchool(schoolId);
          setStudents(studentsData);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch students"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchStudents();
  }, [user]);

  // Gérer la visualisation d'un étudiant
  const handleViewStudent = (studentData: StudentSchema) => {
    router.push(`/school-admin/students/view?id=${studentData._id}`);
  };

  // Gérer la suppression d'un étudiant
  const handleDeleteStudent = (studentData: StudentSchema) => {
    setStudentToDelete(studentData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'un nouvel étudiant
  const handleSave = async (studentData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer un nouvel étudiant
      console.log("Create new student:", studentData);
      setSubmitStatus(createSuccessNotification("Student created successfully"));
    } catch (error) {
      console.error("Error creating student:", error);
      setSubmitStatus(createErrorNotification("Failed to create student"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'un étudiant
  const handleDelete = async () => {
    if (!studentToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer un étudiant
      console.log("Delete student:", studentToDelete);
      setSubmitStatus(createSuccessNotification("Student deleted successfully"));
    } catch (error) {
      console.error("Error deleting student:", error);
      setSubmitStatus(createErrorNotification("Failed to delete student"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Students Management</h1>

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
        Add New Student
      </motion.button>

      <DataTableFix<StudentSchema>
        columns={columns}
        data={students}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedStudents}
      />

      {/* Modal pour ajouter un étudiant - à implémenter */}
      {/* Modal pour supprimer un étudiant - à implémenter */}
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
        <StudentsContent />
      </SchoolLayout>
    </Suspense>
  );
}
