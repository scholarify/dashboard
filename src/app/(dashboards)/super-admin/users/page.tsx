"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useState } from 'react';
import { School } from 'lucide-react';
import DataTable from '@/components/utils/DataTable';
import CreateUserModal from './components/CreateUserModal';
import { useRouter } from 'next/navigation';
import DeleteUserModal from './components/DeleteUserModal';

export default function Page() {
  const BASE_URL = "/super-admin";

  const navigation = {
    icon: School,
    baseHref: `${BASE_URL}/users`,
    title: "Schools",
  };

  interface User extends Record<string, unknown>{
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
    phone?: string;
    address?: string;
    school: string;
    lastLogin: string;
  }

  const initialUsers: User[] = [
    { id: "USR0001", name: "Alice Johnson", email: "alice.johnson@schoolmail.com", role: "Teacher", school: "Greenwood High", lastLogin: "2025-04-07", password: "" },
    { id: "USR0002", name: "Bob Smith", email: "bob.smith@schoolmail.com", role: "Admin", school: "Oceanview Academy", lastLogin: "2025-04-06", password: "" },
    { id: "USR0003", name: "Cynthia Lee", email: "cynthia.lee@schoolmail.com", role: "Parent", school: "", lastLogin: "2025-04-05", password: "" },
    { id: "USR0004", name: "Daniel Kim", email: "daniel.kim@schoolmail.com", role: "Super Admin", school: "Riverdale Institute", lastLogin: "2025-04-03", password: "" },
    // ... Add remaining users
  ];

  function UserContent() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("All");
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);


    const roles = ["All", ...Array.from(new Set(users.map(user => user.role))).sort()];

    const filteredUsers = selectedRole === "All"
      ? users
      : users.filter(user => user.role === selectedRole);

    const handleSaveUser = (userData: any) => {
      const newUser: User = {
        id: `USR${users.length + 1}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        school: userData.school,
        lastLogin: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      console.log("New user data:", userData);
    };
    const handleDelete = (password: string) => {
        // Simuler une vérification de mot de passe (dans un vrai projet, fais une requête API)
        if (password !== "admin123") {
          alert("Incorrect password. Please try again.");
          return;
        }
      
        if (userToDelete) {
          setUsers(users.filter((u) => u.id !== userToDelete.id));
          setUserToDelete(null);
        }
      };

    return (
      <div className="md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Add New User
          </button>

          {isModalOpen && (
            <CreateUserModal
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveUser}
              roles={roles.filter(role => role !== "All")}
              schools={["Greenwood High", "Oceanview Academy", "Hilltop School", "Riverdale Institute"]}
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

        <DataTable
          columns={[
            { header: "User ID", accessor: "id" },
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            { header: "School", accessor: "school" },
            { header: "Last Login", accessor: "lastLogin" },
          ]}
          data={filteredUsers}
          actions={[
            {
                label: "View",
                onClick: (user: User) => {
                  router.push(`${BASE_URL}/users/view?id=${user.id}`);
                },
              },
              {
                label: "Delete",
                onClick: (user: User) => {
                  setUserToDelete(user);
                  setIsDeleteUserModalOpen(true);
                },
              },
          ]}
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
