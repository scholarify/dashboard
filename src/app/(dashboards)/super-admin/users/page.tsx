"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { School, Users } from 'lucide-react';
import DataTable from '@/components/utils/DataTable';
import CreateUserModal from './components/CreateUserModal';
import { useRouter } from 'next/navigation';
import DeleteUserModal from './components/DeleteUserModal';
import { UserCreateSchema, UserSchema } from '@/app/models/UserModel';
import { createUser, deleteUser, getUsers, verifyPassword } from '@/app/services/UserServices';
import NotificationCard from '@/components/NotificationCard';
import { SchoolSchema } from '@/app/models/SchoolModel';
import { getSchools } from '@/app/services/SchoolServices';
import Link from 'next/link';
import useAuth from '@/app/hooks/useAuth';
import DataTableFix from '@/components/utils/TableFix';
import { motion } from 'framer-motion';

export default function Page() {
  const BASE_URL = "/super-admin";

  const navigation = {
    icon: Users,
    baseHref: `${BASE_URL}/users`,
    title: "Users",
  };

  function UserContent() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("All");
    const [selectedUsers, setSelectedUsers] = useState<UserSchema[]>([]);
    const [users, setUsers] = useState<UserSchema[]>([]);
    const [schools, setSchools] = useState<SchoolSchema[]>([]);
    const [userToDelete, setUserToDelete] = useState<UserSchema | null>(null);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);
    const { user } = useAuth();

    console.log("array of selected users:", selectedUsers)
    const fetchSchools = async () => {
      setLoadingData(true);
      try {
        const fetchedUsers = await getUsers();
        const fetchedSchools = await getSchools();
        setSchools(fetchedSchools);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching schools or User:", error);
      } finally {
        setLoadingData(false);
      }
    };
    useEffect(() => {

      fetchSchools();
    }, []);
    //console.log(schools)
    // Create a mapping from school_id to school name
    const schoolNameMap: { [key: string]: string } = schools.reduce((map, school) => {
      map[school._id] = school.name;
      return map;
    }, {} as { [key: string]: string });

    const columns = [
      { header: "User ID", accessor: (row: UserSchema) => row.user_id },
      { header: "Name", accessor: (row: UserSchema) => { return <Link href={`${BASE_URL}/users/view?id=${row.user_id}`}>{row.name}</Link>; } },
      { header: "Email", accessor: (row: UserSchema) => row.email },
      { header: "Role", accessor: (row: UserSchema) => row.role },

      {
        header: "School",
        accessor: (row: UserSchema) =>
          (row.school_ids ?? []).map(id => schoolNameMap[id] || "Unknown School").join(", "), // Added fallback for unknown school IDs
      },
      {
        header: "Last Login",
        accessor: (row: UserSchema) => {
          const date = new Date(row.lastLogin || "No Date");
          return date.toLocaleString();  // Returns a human-readable date format
        }
      }
    ]
    const actions = [
      {
        label: "View",
        onClick: (user: UserSchema) => {
          router.push(`${BASE_URL}/users/view?id=${user.user_id}`);
        },
      },
      {
        label: "Delete",
        onClick: (user: UserSchema) => {
          setUserToDelete(user);
          setIsDeleteUserModalOpen(true);
        },
      },
    ]

    const roles = ["All", ...Array.from(new Set(users.map(user => user.role))).sort()];

    const filteredUsers = selectedRole === "All"
      ? users
      : users.filter(user => user.role === selectedRole);

    const handleSaveUser = async (userData: UserCreateSchema) => {
      setIsSubmitting(true);         // Start submitting
      setSubmitStatus(null);
      setLoadingData(true); // Set loading state to true when starting the process
      try {
        const newUser: UserCreateSchema = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password: userData.password,
          phone: userData.phone,
          address: userData.address,
          school_ids: userData.school_ids, // Corrected this to `school_ids` (assuming school is an array of IDs)
          isVerified: userData.isVerified ?? false, // Default value for `isVerified` if not provided
        };

        // Make the API call to create the user
        const data = await createUser(newUser);


        if (data) {
          // Assuming 'data' contains the newly created user, so we use it directly
          fetchSchools(); // Refresh the list of users after creating a new one

          // Display success message
          setSubmitStatus("success");
          setNotificationMessage("User created successfully!");
          setIsNotificationCard(true);
          setNotificationType("success");
          setTimeout(() => {
            setIsModalOpen(false);
            setSubmitStatus(null); // reset
          }, 10000);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        setSubmitStatus("failure");
        // Capture the error message from the error object or use a default one
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unknown error occurred while creating this user.";

        setNotificationMessage(errorMessage);
        setNotificationType("error");
        setIsNotificationCard(true);
      } finally {
        setLoadingData(false); // Reset loading state
        setIsSubmitting(false);                     // ✅ end submitting
        setLoadingData(false);
      }
    };



    const handleDelete = async (password: string) => {
      setIsSubmitting(true);
      setSubmitStatus(null);
      // setLoadingData(false);
      const passwordVerified = user ? await verifyPassword(password, user.email) : false;
      //console.log("passwordVerified", passwordVerified);
      if (!passwordVerified) {
        setNotificationMessage("Invalid Password!");
        setNotificationType("error");
        setIsNotificationCard(true);
        // setLoadingData(false);
        // ✅ Fix: Reset loading/submitting states even when password fails
        setIsSubmitting(false);
        setSubmitStatus("failure");
        setTimeout(() => {
          setUserToDelete(null); // ✅ Close delete modal properly
          setSubmitStatus(null);
        }, 10000);
        return;
      }

      if (userToDelete) {
        try {
          // Call the API to delete the user from the backend
          await deleteUser(userToDelete.user_id); // Assuming user_id exists

          fetchSchools(); // Refresh the list of users after deletion
          setSubmitStatus("success");
          setNotificationMessage("User Deleted successfully!");
          setIsNotificationCard(true);
          setNotificationType("success");

          setTimeout(() => {
            setUserToDelete(null); // ✅ Close delete modal properly
            setSubmitStatus(null);
          }, 10000);
        } catch (error) {
          console.error("Error Deleting Invitation:", error);

          setSubmitStatus("failure");
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred while deleting the invitation.";

          setNotificationMessage(errorMessage);
          setNotificationType("error");
          setIsNotificationCard(true);
        } finally {
          setIsSubmitting(false);                     // ✅ end submitting
          // setLoadingData(false);
        }
      }
    };

    // Gérer la suppression multiple
    const handleDeleteSelected = () => {
      if (selectedUsers.length === 0) {
        alert("Please select at least one school to delete.");
        return;
      }
      if (confirm(`Are you sure you want to delete ${selectedUsers.length} school(s)?`)) {
        setUsers(users.filter((user) => !selectedUsers.includes(user)));
        setSelectedUsers([]); // Réinitialiser la sélection après suppression
      }
    };

    return (
      <div className="">
        {isNotificationCard && (
          <NotificationCard
            title="Notification"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d " strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" />
                <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d " strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" />
              </svg>

            }
            message={notificationMessage}
            onClose={() => setIsNotificationCard(false)}
            type={notificationType}
            isVisible={isNotificationCard}
            isFixed={true}
          />
        )

        }
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Add New User
          </motion.button>

          {isModalOpen && (
            <CreateUserModal
              onClose={() => { setIsModalOpen(false); setSubmitStatus(null); }}
              onSave={handleSaveUser}
              roles={roles.filter(role => role !== "All")}
              schools={schools}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
            />
          )}
          {isDeleteUserModalOpen && userToDelete && (
            <DeleteUserModal
              userName={userToDelete.name}
              onClose={() => {
                setIsDeleteUserModalOpen(false);
                setUserToDelete(null);
              }}
              onDelete={handleDelete}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
            />
          )}

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <DataTableFix
          columns={columns}
          data={filteredUsers}
          actions={actions}
          defaultItemsPerPage={5}
          loading={loadingData}
          onLoadingChange={setLoadingData}
          onSelectionChange={setSelectedUsers}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
        <CircularLoader size={32} color="teal" />
      </div>
    }>
      <SuperLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => console.log("Logged out")}
      >
        <UserContent />
      </SuperLayout>
    </Suspense>
  );
}


