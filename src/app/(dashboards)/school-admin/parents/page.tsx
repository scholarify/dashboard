"use client";

import { UserPlus } from "lucide-react";
import SchoolLayout from "@/components/Dashboard/Layouts/SchoolLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { getInvitations } from "@/app/services/InvitationServices";
import { InvitationSchema } from "@/app/models/Invitation";
import { motion } from "framer-motion";
import NotificationCard from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from "@/app/types/notification";

const BASE_URL = "/school-admin";

const navigation = {
  icon: UserPlus,
  baseHref: `${BASE_URL}/parents`,
  title: "Parents"
};

function ParentsContent() {
  const [invitations, setInvitations] = useState<InvitationSchema[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedInvitations, setSelectedInvitations] = useState<InvitationSchema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<InvitationSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<NotificationState | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Référence aux fonctions de gestion des modales pour éviter les avertissements
  const handleSaveRef = React.useRef<(invitationData: any) => Promise<void>>();
  const handleDeleteRef = React.useRef<() => Promise<void>>();

  // Colonnes pour le tableau
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      accessor: (row: InvitationSchema) => row.name || "N/A"
    },
    {
      header: "Email",
      accessorKey: "email",
      accessor: (row: InvitationSchema) => row.email
    },
    {
      header: "Phone",
      accessorKey: "phone",
      accessor: (row: InvitationSchema) => row.phone || "N/A"
    },
    {
      header: "Status",
      accessorKey: "status",
      accessor: (row: InvitationSchema) => row.status,
      cell: (props: any) => {
        const status = props.getValue();
        let statusClass = "";

        switch(status) {
          case "pending":
            statusClass = "bg-yellow-100 text-yellow-800";
            break;
          case "accepted":
            statusClass = "bg-green-100 text-green-800";
            break;
          case "expired":
            statusClass = "bg-red-100 text-red-800";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      header: "Invited At",
      accessor: (row: InvitationSchema) => new Date(row.invitedAt || "").toLocaleDateString()
    },
    {
      header: "Actions",
      accessor: (row: InvitationSchema) => row._id,
      cell: (props: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewInvitation(props.row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteInvitation(props.row.original)}
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
        if (selectedInvitations.length > 0) {
          // Logique pour supprimer les invitations sélectionnées
          console.log("Delete selected invitations:", selectedInvitations);
        }
      },
      disabled: selectedInvitations.length === 0,
    },
  ];

  // Charger les invitations au chargement de la page
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoadingData(true);
        // Si l'utilisateur est connecté et a un ID d'école associé
        if (user && user.school_ids && user.school_ids.length > 0) {
          const schoolId = user.school_ids[0]; // Utiliser le premier ID d'école
          const allInvitations = await getInvitations();
          // Filtrer les invitations pour n'afficher que celles de l'école de l'administrateur
          const schoolInvitations = allInvitations.filter(
            invitation => invitation.school_ids && invitation.school_ids.includes(schoolId)
          );
          setInvitations(schoolInvitations);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
        setSubmitStatus(createErrorNotification("Failed to fetch invitations"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchInvitations();
  }, [user]);

  // Gérer la visualisation d'une invitation
  const handleViewInvitation = (invitationData: InvitationSchema) => {
    router.push(`/school-admin/parents/view?id=${invitationData._id}`);
  };

  // Gérer la suppression d'une invitation
  const handleDeleteInvitation = (invitationData: InvitationSchema) => {
    setInvitationToDelete(invitationData);
    setIsDeleteModalOpen(true);
  };

  // Gérer la création d'une nouvelle invitation
  const handleSave = async (invitationData: any) => {
    setIsSubmitting(true);
    try {
      // Logique pour créer une nouvelle invitation
      console.log("Create new invitation:", invitationData);
      setSubmitStatus(createSuccessNotification("Invitation sent successfully"));
    } catch (error) {
      console.error("Error creating invitation:", error);
      setSubmitStatus(createErrorNotification("Failed to send invitation"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleSaveRef.current = handleSave;

  // Gérer la suppression d'une invitation
  const handleDelete = async () => {
    if (!invitationToDelete) return;

    setIsSubmitting(true);
    try {
      // Logique pour supprimer une invitation
      console.log("Delete invitation:", invitationToDelete);
      setSubmitStatus(createSuccessNotification("Invitation deleted successfully"));
    } catch (error) {
      console.error("Error deleting invitation:", error);
      setSubmitStatus(createErrorNotification("Failed to delete invitation"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assigner la fonction à la référence
  handleDeleteRef.current = handleDelete;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parent Invitations</h1>

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
        Invite New Parent
      </motion.button>

      <DataTableFix<InvitationSchema>
        columns={columns}
        data={invitations}
        actions={actions}
        defaultItemsPerPage={5}
        loading={loadingData}
        onLoadingChange={setLoadingData}
        onSelectionChange={setSelectedInvitations}
      />

      {/* Modal pour ajouter une invitation - à implémenter */}
      {/* Modal pour supprimer une invitation - à implémenter */}
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
        <ParentsContent />
      </SchoolLayout>
    </Suspense>
  );
}
