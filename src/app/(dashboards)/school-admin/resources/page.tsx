"use client";

import { BookOpen } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getSchoolResourcesBySchoolId } from "@/app/services/SchoolResourcesServices";
import { SchoolResourceSchema } from "@/app/models/SchoolResources";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: BookOpen,
  baseHref: `${BASE_URL}/resources`,
  title: "Resources"
};

function ResourcesContent() {
  const [resources, setResources] = useState<SchoolResourceSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedResources, setSelectedResources] = useState<SchoolResourceSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<SchoolResourceSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Référence aux fonctions de gestion des modales pour éviter les avertissements
  const handleSaveRef = React.useRef<(resourceData: any) => Promise<void>>();
  const handleDeleteRef = React.useRef<() => Promise<void>>();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      accessor: (row: SchoolResourceSchema) => row.name
    },
    {
      header: "Type",
      accessorKey: "type",
      accessor: (row: SchoolResourceSchema) => row.type
    },
    {
      header: "Price",
      accessor: (row: SchoolResourceSchema) => `$${row.price.toFixed(2)}`
    },
    {
      header: "Stock",
      accessorKey: "stock",
      accessor: (row: SchoolResourceSchema) => row.stock.toString()
    },
    {
      header: "Actions",
      accessor: (row: SchoolResourceSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewResource(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteResource(props.row.original)}
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
        if (selectedResources.length > 0) {
          // Logique pour supprimer les ressources sélectionnées
          console.log("Delete selected resources:", selectedResources);
        }
      },
      disabled: selectedResources.length === 0,
    },
  ];

  // Charger les ressources au chargement de la page
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const resourcesData = await getSchoolResourcesBySchoolId(schoolId);
          setResources(resourcesData);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch resources"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchResources();
  }, [user]);

  // Gérer la visualisation d'une ressource
  const handleViewResource = (resourceData: SchoolResourceSchema) => {
    router.push(`/school-admin/resources/view?id=${resourceData._id}`);
  };

  // Gérer la suppression d'une ressource
  const handleDeleteResource = (resourceData: SchoolResourceSchema) => {
    setResourceToDelete(resourceData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'une nouvelle ressource
  const handleSave = async (resourceData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer une nouvelle ressource
      console.log("Create new resource:", resourceData);
      setSubmitStatus(createSuccessNotification("Resource created successfully"));
    } catch (error) {
      console.error("Error creating resource:", error);
      setSubmitStatus(createErrorNotification("Failed to create resource"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleSaveRef.current = handleSave;

  // Gérer la suppression d'une ressource
  const handleDelete = async () => {
    if (!resourceToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer une ressource
      console.log("Delete resource:", resourceToDelete);
      setSubmitStatus(createSuccessNotification("Resource deleted successfully"));
    } catch (error) {
      console.error("Error deleting resource:", error);
      setSubmitStatus(createErrorNotification("Failed to delete resource"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleDeleteRef.current = handleDelete;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Resources Management</h1>

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
        Add New Resource
      </motion.button>

      <DataTableFix<SchoolResourceSchema>
        columns={columns}
        data={resources}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedResources}
      />

      {/* Modal pour ajouter une ressource - à implémenter */}
      {/* Modal pour supprimer une ressource - à implémenter */}
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
        <ResourcesContent />
      </SchoolLayout>
    </Suspense>
  );
}
