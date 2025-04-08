"use client";

import { User } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateUserModal from "../components/CreateUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import CircularLoader from "@/components/widgets/CircularLoader";

// User interface
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    school?: string;
    lastLogin?: string;
    password?: string;
}

const initialUsers: User[] = [
    { id: "USR0001", name: "Alice Johnson", email: "alice.johnson@schoolmail.com", role: "Teacher", school: "Greenwood High", lastLogin: "2025-04-07", password: "" },
    { id: "USR0002", name: "Bob Smith", email: "bob.smith@schoolmail.com", role: "Admin", school: "Oceanview Academy", lastLogin: "2025-04-06", password: "" },
    { id: "USR0003", name: "Cynthia Lee", email: "cynthia.lee@schoolmail.com", role: "Parent", school: "", lastLogin: "2025-04-05", password: "" },
    { id: "USR0004", name: "Daniel Kim", email: "daniel.kim@schoolmail.com", role: "Super Admin", school: "Riverdale Institute", lastLogin: "2025-04-03", password: "" },
    // ... Add remaining users
];

const BASE_URL = "/super-admin";

const navigation = {
    icon: User,
    baseHref: `${BASE_URL}/users`,
    title: "User Details",
};

function UserViewDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [user, setUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const roles = ["All", ...Array.from(new Set(users.map((user) => user.role))).sort()];

    useEffect(() => {
        if (userId) {
            const foundUser = users.find((u) => u.id === userId);
            if (foundUser) {
                setUser(foundUser); // Update user state
            } else {
                router.push(`${BASE_URL}/users`);
            }
        }
    }, [userId, users, router]); // Add `users` to the dependencies

    const handleDelete = async (password: string) => {
        try {
            const response = await fetch("/api/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!data.isValid) {
                alert("Incorrect password. Please try again.");
                return;
            }

            if (user) {
                const deleteResponse = await fetch(`/api/users/${user.id}`, {
                    method: "DELETE",
                });
                if (deleteResponse.ok) {
                    router.push(`${BASE_URL}/users`);
                } else {
                    alert("Failed to delete user. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleSave = (userData: any) => {
        if (user) {
            const updatedUser: User = {
                ...user,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
                address: userData.address,
                school: userData.school,
            };

            const index = users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
                const updatedUsers = [...users];
                updatedUsers[index] = updatedUser;
                setUsers(updatedUsers); // Update the users array
                setUser(updatedUser); // Update the user state
            }
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
                <CircularLoader size={32} color="teal" />
            </div>
        );
    }

    return (
        <div>
            <div className="md:p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-foreground mb-4">{user.name} Details</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <InfoBox label="User ID" value={user.id} />
                        <InfoBox label="Name" value={user.name} />
                        <InfoBox label="Email" value={user.email} />
                        <InfoBox label="Role" value={user.role} />
                        <InfoBox label="Phone" value={user.phone || "N/A"} />
                        <InfoBox label="Address" value={user.address || "N/A"} />
                        <InfoBox label="School" value={user.school || "N/A"} />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
                        >
                            Edit User
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <CreateUserModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                    initialData={{
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone || "",
                        address: user.address || "",
                        school: Array.isArray(user.school) ? user.school : [user.school || ""],
                        password: "",
                    }}
                    roles={roles.filter((role) => role !== "All")}
                    schools={["Greenwood High", "Oceanview Academy", "Hilltop School", "Riverdale Institute"]}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteUserModal
                    userName={user.name}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</p>
            <p className="text-sm text-foreground">{value}</p>
        </div>
    );
}

export default function UserViewDetail() {
    return (
        <SuperLayout
            navigation={navigation}
            showGoPro={true}
            onLogout={() => console.log("Logged out")}
        >
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
                        <CircularLoader size={32} color="teal" />
                    </div>
                }
            >
                <UserViewDetailContent />
            </Suspense>
        </SuperLayout>
    );
}
