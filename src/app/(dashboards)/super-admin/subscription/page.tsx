"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import DataTable from '@/components/utils/DataTable';
import { useRouter } from 'next/navigation';
import NotificationCard from '@/components/NotificationCard';
import Link from 'next/link';
import useAuth from '@/app/hooks/useAuth';
import { getUserById, getUserBy_id, verifyPassword } from '@/app/services/UserServices';
import CreateSubscriptionModal from '../subscription/components/CreateSubscriptionModal';
import DeleteUserModal from '../users/components/DeleteUserModal';
import UpdateSubscriptionModal from './components/UpdateSubscriptionModal';
import { getSubscriptions } from '@/app/services/SubscriptionsServices';
import { SubscriptionSchema } from '@/app/models/SubscriptionModel';
import { getStudentById } from '@/app/services/StudentServices';

// Interface pour une souscription
interface Parent {
  id: string;
  name: string;
  email?: string;
}

interface Child {
  id: string;
  name: string;
  parentId: string;
  schoolInfo?: string;
}

interface SubscriptionNewFormSchema extends Record<string, unknown> {
  parent: Parent;
  children: Child[];
  status: boolean;
  startDate: string;
  endDate: string;
  // For backward compatibility with existing code
  id?: string;
  parentName?: string;
  childNames?: string[];
  parentId?: string;
  childIds?: string[];
}

interface SubscriptionCreateSchema {
  parentId: string;
  childIds: string[];
}

// Données statiques pour les parents et enfants (pour la modale de création)
const staticParents = [
  { id: "parent1", name: "John Logan" },
  { id: "parent2", name: "Maria Rodriguez" },
  { id: "parent3", name: "Michael Johnson" },
];

const staticChildren = [
  { id: "child1", name: "Emma Logan", parentId: "parent1" },
  { id: "child2", name: "Carlos Rodriguez", parentId: "parent2", schoolInfo: "Acme High School (Form 5)" },
  { id: "child3", name: "Ana Rodriguez", parentId: "parent2", schoolInfo: "Sability College (Form 3)" },
  { id: "child4", name: "Sarah Johnson", parentId: "parent3" },
];

export default function Page() {
  const BASE_URL = "/super-admin";

  const navigation = {
    icon: Wallet, // Tu peux remplacer l'icône par une icône plus appropriée pour les souscriptions
    baseHref: `${BASE_URL}/subscription`,
    title: "Subscriptions",
  };

  function SubscriptionContent() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<SubscriptionNewFormSchema[]>([]);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState<SubscriptionNewFormSchema[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<SubscriptionNewFormSchema | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [subscriptionToUpdate, setSubscriptionToUpdate] = useState<SubscriptionNewFormSchema | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error">("success");
    const { user } = useAuth();

    async function getAllSubscriptions() {
        try {
          setLoadingData(true);
          const fetchedSubscriptions = await getSubscriptions();

          // Group subscriptions by guardian_id (parent)
          const subscriptionsByParent: Record<string, {
            parent: { id: string, name: string, email: string },
            children: { id: string, name: string, parentId: string }[],
            subscriptions: SubscriptionSchema[]
          }> = {};

          // Process each subscription
          await Promise.all(
            fetchedSubscriptions.map(async (subscription: SubscriptionSchema) => {
              // Get parent information
              const parentData = await getUserBy_id(subscription.guardian_id);

              if (parentData && parentData.role === "parent") {
                // Initialize parent entry if it doesn't exist
                if (!subscriptionsByParent[parentData._id]) {
                  subscriptionsByParent[parentData._id] = {
                    parent: {
                      id: parentData._id,
                      name: parentData.name,
                      email: parentData.email
                    },
                    children: [],
                    subscriptions: []
                  };
                }

                // Add subscription to parent's subscriptions
                subscriptionsByParent[parentData._id].subscriptions.push(subscription);

                // Get student information for each student_id in the subscription
                if (subscription.student_id && subscription.student_id.length > 0) {
                  const studentPromises = subscription.student_id.map(async (studentId) => {
                    try {
                      const studentData = await getStudentById(studentId);
                      if (studentData) {
                        // Check if this child is already in the list
                        const existingChildIndex = subscriptionsByParent[parentData._id].children
                          .findIndex(child => child.id === studentData.student_id);

                        if (existingChildIndex === -1) {
                          // Add child if not already in the list
                          subscriptionsByParent[parentData._id].children.push({
                            id: studentData.student_id,
                            name: studentData.name,
                            parentId: parentData._id
                          });
                        }
                      }
                      return studentData;
                    } catch (error) {
                      console.error(`Error fetching student with ID ${studentId}:`, error);
                      return null;
                    }
                  });

                  await Promise.all(studentPromises);
                }
              }
            })
          );

          // Convert the grouped data to the format expected by the component
          const formattedSubscriptions = Object.values(subscriptionsByParent).map(group => {
            return {
              parent: group.parent,
              children: group.children,
              status: group.subscriptions.some(sub => sub.status),
              startDate: group.subscriptions[0]?.createdAt ? new Date(group.subscriptions[0].createdAt).toLocaleDateString() : "",
              endDate: group.subscriptions[0]?.expiryDate ? new Date(group.subscriptions[0].expiryDate).toLocaleDateString() : ""
            } as SubscriptionNewFormSchema;
          });

          setSubscriptions(formattedSubscriptions);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        } finally {
          setLoadingData(false);
        }
    }
    useEffect(() => {
      getAllSubscriptions();
    }, []);



    const columns = [
      { header: "Parent Name", accessor: (row: SubscriptionNewFormSchema) => row.parent?.name || row.parentName || "Unknown" },
      { header: "Child Name(s)", accessor: (row: SubscriptionNewFormSchema) => {
        if (row.children && row.children.length > 0) {
          return row.children.map(child => child.name).join(", ");
        } else if (row.childNames && row.childNames.length > 0) {
          return row.childNames.join(", ");
        }
        return "No children";
      }},
      {
        header: "Status",
        accessor: (row: SubscriptionNewFormSchema) => {
          const statusText = typeof row.status === 'boolean' ? (row.status ? "Active" : "Inactive") : row.status;
          return (
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                statusText === "Active" || row.status === true
                  ? "bg-green-100 text-green-800"
                  : new Date(row.endDate) > new Date()
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
            >
              {statusText}
            </span>
          );
        },
      },
      { header: "Start Date", accessor: (row: SubscriptionNewFormSchema) => row.startDate || "N/A" },
      { header: "End Date", accessor: (row: SubscriptionNewFormSchema) => row.endDate || "N/A" },
    ];



    const actions = [
      {
        label: "edit",
        onClick: (subscription: SubscriptionNewFormSchema) => {
          setSubscriptionToUpdate(subscription);
          setIsUpdateModalOpen(true);
        },
      },
      {
        label: "Delete",
        onClick: (subscription: SubscriptionNewFormSchema) => {
          setSubscriptionToDelete(subscription);
          setIsDeleteModalOpen(true);
        },
      },
    ];

    const handleUpdateSubscription = async (updatedSubscription: any) => {
      setLoadingData(true);
      try {
        // Simuler la mise à jour de la souscription (remplace par un appel API plus tard)
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === updatedSubscription.id ? {
              ...sub,
              childIds: updatedSubscription.childIds,
              children: sub.children.filter(child =>
                updatedSubscription.childIds.includes(child.id)
              )
            } : sub
          )
        );
        setNotificationMessage("Subscription renewed successfully!");
        setIsNotificationCard(true);
        setNotificationType("success");
      } catch (error) {
        console.error("Error renewing subscription:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while renewing the subscription.";
        setNotificationMessage(errorMessage);
        setIsNotificationCard(true);
        setNotificationType("error");
      } finally {
        setLoadingData(false);
      }
    };

    const handleSaveSubscription = async (subscriptionData: SubscriptionCreateSchema) => {
      setLoadingData(true);
      try {
        // Simuler la création d'une souscription (remplace par un appel API plus tard)
        const parent = staticParents.find((p) => p.id === subscriptionData.parentId);
        const children = staticChildren.filter((c) => subscriptionData.childIds.includes(c.id));

        if (!parent || !children.length) {
          throw new Error("Invalid parent or children selection");
        }

        const newSubscription: SubscriptionNewFormSchema = {
          id: `sub-${subscriptions.length + 1}`,
          parent: {
            id: parent.id,
            name: parent.name
          },
          children: children.map(c => ({
            id: c.id,
            name: c.name,
            parentId: parent.id
          })),
          status: true,
          startDate: "03/12/2029", // À remplacer par une date dynamique
          endDate: "03/12/2029",   // À remplacer par une date dynamique
          // For backward compatibility
          parentName: parent.name,
          childNames: children.map((c) => c.name),
          parentId: parent.id,
          childIds: children.map(c => c.id)
        };

        setSubscriptions((prev) => [...prev, newSubscription]);
        setNotificationMessage("Subscription created successfully!");
        setIsNotificationCard(true);
        setNotificationType("success");
      } catch (error) {
        console.error("Error creating subscription:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while creating the subscription.";
        setNotificationMessage(errorMessage);
        setIsNotificationCard(true);
        setNotificationType("error");
      } finally {
        setLoadingData(false);
      }
    };

    const handleDelete = async (password: string) => {
      const passwordVerified = user ? await verifyPassword(password, user.email) : false;
      if (!passwordVerified) {
        setNotificationMessage("Invalid Password!");
        setNotificationType("error");
        setIsNotificationCard(true);
        return;
      }

      if (subscriptionToDelete) {
        try {
          // Simuler la suppression (remplace par un appel API plus tard)
          setSubscriptions(subscriptions.filter((s) => s.id !== subscriptionToDelete.id));
          setNotificationMessage("Subscription deleted successfully!");
          setIsNotificationCard(true);
          setNotificationType("success");
          setSubscriptionToDelete(null);
          setIsDeleteModalOpen(false);
        } catch (error) {
          console.error("Error deleting subscription:", error);
          const errorMessage = error instanceof Error ? error.message : "Error deleting subscription.";
          setNotificationMessage(errorMessage);
          setIsNotificationCard(true);
          setNotificationType("error");
        }
      }
    };

    const handleDeleteSelected = () => {
      if (selectedSubscriptions.length === 0) {
        alert("Please select at least one subscription to delete.");
        return;
      }
      if (confirm(`Are you sure you want to delete ${selectedSubscriptions.length} subscription(s)?`)) {
        // Create a set of IDs for faster lookup
        const selectedIds = new Set(selectedSubscriptions.map(sub => sub.id));
        setSubscriptions(subscriptions.filter(subscription => !selectedIds.has(subscription.id || '')));
        setSelectedSubscriptions([]);
        setNotificationMessage(`${selectedSubscriptions.length} subscription(s) deleted successfully!`);
        setIsNotificationCard(true);
        setNotificationType("success");
      }
    };

    return (
      <div className="md:p-6">
        {isNotificationCard && (
          <NotificationCard
            title="Notification"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            message={notificationMessage}
            onClose={() => setIsNotificationCard(false)}
            type={notificationType}
            isVisible={isNotificationCard}
            isFixed={true}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Create New Subscription
          </button>

          {isModalOpen && (
            <CreateSubscriptionModal
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveSubscription}
              parents={staticParents}
              children={staticChildren}
              pricePerStudent={19900}
            />
          )}
          {isUpdateModalOpen && subscriptionToUpdate && (
            <UpdateSubscriptionModal
              onClose={() => {
                setIsUpdateModalOpen(false);
                setSubscriptionToUpdate(null);
              }}
              onSave={handleUpdateSubscription}
              subscription={{
                id: subscriptionToUpdate.id || '',
                parentId: subscriptionToUpdate.parentId || subscriptionToUpdate.parent?.id || '',
                childIds: subscriptionToUpdate.childIds || subscriptionToUpdate.children?.map(c => c.id) || [],
                expirationDate: subscriptionToUpdate.endDate || ''
              } as any}
              parent={subscriptionToUpdate.parent as any}
              children={subscriptionToUpdate.children as any}
              pricePerStudent={19900}
            />
          )}
          {isDeleteModalOpen && subscriptionToDelete && (
            <DeleteUserModal
              userName={subscriptionToDelete.parentName || subscriptionToDelete.parent?.name || 'Unknown'}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSubscriptionToDelete(null);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>

        <DataTable<SubscriptionNewFormSchema>
          columns={columns}
          data={subscriptions}
          actions={actions as any}
          defaultItemsPerPage={5}
          loading={loadingData}
          onLoadingChange={setLoadingData}
          onSelectionChange={setSelectedSubscriptions}
          idAccessor="id"
        />

        {selectedSubscriptions.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Selected ({selectedSubscriptions.length})
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
          <CircularLoader size={32} color="teal" />
        </div>
      }
    >
      <SuperLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => console.log("Logged out")}
      >
        <SubscriptionContent />
      </SuperLayout>
    </Suspense>
  );
}