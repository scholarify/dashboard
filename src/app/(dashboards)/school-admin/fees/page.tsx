"use client";

import { DollarSign } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getFeesBySchoolId } from "@/app/services/FeesServices";
import { FeeSchema } from "@/app/models/FeesModel";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: DollarSign,
  baseHref: `${BASE_URL}/fees`,
  title: "Fees"
};

// Fonction simulée pour récupérer les frais par école (à remplacer par l'implémentation réelle)
const getFeesBySchoolId = async (schoolId: string): Promise<FeeSchema[]> => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Retourner des données statiques pour la simulation
  return [
    {
      _id: "fee1",
      school_id: schoolId,
      fee_type: "Tuition Fee",
      amount: 1500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "fee2",
      school_id: schoolId,
      fee_type: "Registration Fee",
      amount: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "fee3",
      school_id: schoolId,
      fee_type: "Library Fee",
      amount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "fee4",
      school_id: schoolId,
      fee_type: "Sports Fee",
      amount: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "fee5",
      school_id: schoolId,
      fee_type: "Technology Fee",
      amount: 250,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

function FeesContent() {
  const [fees, setFees] = useState<FeeSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedFees, setSelectedFees] = useState<FeeSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<FeeSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Fee Type",
      accessorKey: "fee_type",
      accessor: (row: FeeSchema) => row.fee_type
    },
    {
      header: "Amount",
      accessor: (row: FeeSchema) => `$${row.amount.toFixed(2)}`
    },
    {
      header: "Created At",
      accessor: (row: FeeSchema) => new Date(row.createdAt || "").toLocaleDateString()
    },
    {
      header: "Actions",
      accessor: (row: FeeSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewFee(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteFee(props.row.original)}
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
        if (selectedFees.length > 0) {
          // Logique pour supprimer les frais sélectionnés
          console.log("Delete selected fees:", selectedFees);
        }
      },
      disabled: selectedFees.length === 0,
    },
  ];

  // Charger les frais au chargement de la page
  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const feesData = await getFeesBySchoolId(schoolId);
          setFees(feesData);
        }
      } catch (error) {
        console.error("Error fetching fees:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch fees"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchFees();
  }, [user]);

  // Gérer la visualisation d'un frais
  const handleViewFee = (feeData: FeeSchema) => {
    router.push(`/school-admin/fees/view?id=${feeData._id}`);
  };

  // Gérer la suppression d'un frais
  const handleDeleteFee = (feeData: FeeSchema) => {
    setFeeToDelete(feeData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'un nouveau frais
  const handleSave = async (feeData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer un nouveau frais
      console.log("Create new fee:", feeData);
      setSubmitStatus(createSuccessNotification("Fee created successfully"));
    } catch (error) {
      console.error("Error creating fee:", error);
      setSubmitStatus(createErrorNotification("Failed to create fee"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'un frais
  const handleDelete = async () => {
    if (!feeToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer un frais
      console.log("Delete fee:", feeToDelete);
      setSubmitStatus(createSuccessNotification("Fee deleted successfully"));
    } catch (error) {
      console.error("Error deleting fee:", error);
      setSubmitStatus(createErrorNotification("Failed to delete fee"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Fees Management</h1>

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
        Add New Fee
      </motion.button>

      <DataTableFix<FeeSchema>
        columns={columns}
        data={fees}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedFees}
      />

      {/* Modal pour ajouter un frais - à implémenter */}
      {/* Modal pour supprimer un frais - à implémenter */}
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
        <FeesContent />
      </SchoolLayout>
    </Suspense>
  );
}
