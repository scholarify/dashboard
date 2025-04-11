"use client";

import { Users } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateUserModal from "../components/CreateUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import CircularLoader from "@/components/widgets/CircularLoader";
import { deleteUser, getUserById, updateUser } from "@/app/services/UserServices";
import { UserSchema, UserUpdateSchema } from "@/app/models/UserModel";
import NotificationCard from "@/components/NotificationCard";
import { SchoolSchema } from "@/app/models/SchoolModel";
import { getSchools } from "@/app/services/SchoolServices";

const BASE_URL = "/super-admin";

const navigation = {
    icon: Users,
    baseHref: `${BASE_URL}/users`,
    title: "User Details",
};

function UserViewDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");

    const [user, setUser] = useState<UserSchema | null>(null);
    const [schools, setAllSchools] = useState<SchoolSchema[]>([]); // State to store all schools
    const [filteredSchools, setFilteredSchools] = useState<SchoolSchema[]>([]); // State to store filtered schools for the user
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const [notificationType, setNotificationType] = useState("success")
    const [loadingSchools, setLoadingSchools] = useState(true); // New state for loading schools
    const [users, setUsers] = useState<UserSchema[]>([]);
    const roles = ["admin", "teacher", "student","super"];

    // Load user details based on the userId
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userId) {
                    return;
                }

                // Fetch user details
                const foundUser = await getUserById(userId);
                if (foundUser) {
                    setUser(foundUser);
                    // Fetch all schools
                    const schools = await getSchools();
                    setAllSchools(schools);

                    // Filter the schools based on school_ids of the user, making sure school_ids is defined
                    const userSchools = schools.filter((school: { _id: string; }) =>
                        foundUser.school_ids?.includes(school._id) // safe check
                    );
                    setFilteredSchools(userSchools);
                } else {
                    // Redirect if the user is not found
                    router.push("/super-admin/users");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoadingSchools(false); // Set loading to false after schools are loaded
            }
        };
        fetchData();
    }, [userId, router]);

    // console.log("filterd schools found:", filteredSchools)

    // Handle user deletion

    const handleDelete = async (password: string) => {
        if (password !== "admin123") {
            alert("Incorrect password. Please try again.");
            return;
        }

        if (user) {
            try {
                // Call the API to delete the user from the backend
                await deleteUser(user.user_id); // Assuming user_id exists

                // Update the frontend state to reflect the deletion
                setUsers(users.filter((u) => u.user_id !== user.user_id));

                setNotificationMessage("User Deleted successfully!");
                setIsNotificationCard(true);
                setNotificationType("success");
                router.push("/super-admin/users");

            } catch (error) {
                console.error("Error deleting user:", error);
                const errorMessage = error instanceof Error ? error.message : "Error deleting user:";
                setNotificationMessage(errorMessage);
                setIsNotificationCard(true);
                setNotificationType("error");
            }
        }
    };

    // Handle saving updates to the user
    const handleSave = async (userData: UserUpdateSchema) => {
        if (user) {
            setLoadingData(true);
            try {
                const updatedUser: UserUpdateSchema = {
                    user_id: user.user_id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    phone: userData.phone,
                    address: userData.address,
                    school_ids: userData.school_ids,
                    isVerified: userData.isVerified,
                };
                if (userData.user_id) {
                    const data = await updateUser(userData.user_id, updatedUser);
                    if (data) {
                        setUser(data);
                        setIsNotificationCard(true);
                        setNotificationMessage("User updated successfully.");
                    }
                } else {
                    console.error("User ID is undefined. Cannot update user.");
                }
            } catch (error) {
                console.error("Error updating user:", error);
            } finally {
                setLoadingData(false);
                setIsEditModalOpen(false); // Close modal after saving
            }
        }
    };

    if (!user) {
        return <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
            <CircularLoader size={32} color="teal" />
        </div>;
    }

    if (loadingData) {
        return <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
            <CircularLoader size={32} color="teal" />
        </div>;
    }

    return (
        <div>
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

            <div className="md:p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        {user.name} Details
                    </h1>

                    {/* User Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* User ID */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                User ID
                            </p>
                            <p className="text-sm text-foreground">{user.user_id}</p>
                        </div>

                        {/* User Role */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Role
                            </p>
                            <p className="text-sm text-foreground">{user.role}</p>
                        </div>

                        {/* Name */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Name
                            </p>
                            <p className="text-sm text-foreground">{user.name}</p>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Email
                            </p>
                            <p className="text-sm text-foreground">{user.email}</p>
                        </div>

                        {/* Phone Number */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md h-fit">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Phone Number
                            </p>
                            <p className="text-sm text-foreground">{user.phone || "N/A"}</p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Assigned Schools</p>
                            {loadingSchools ? (
                                <div className="flex justify-center items-center">
                                    <CircularLoader size={32} color="teal" />
                                </div>
                            ) : (
                                <ul className="list-disc list-inside text-sm text-foreground mt-1">
                                    {filteredSchools.length > 0 ? (
                                        filteredSchools.map(school => (
                                            <li key={school.school_id}>{school.name}</li>
                                        ))
                                    ) : (
                                        <li>No schools assigned.</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal"
                        >
                            Edit User
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)} // Open delete modal
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <CreateUserModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                    initialData={{
                        user_id: user.user_id,
                        name: user.name,
                        email: user.email || "",
                        phone: user.phone || "",
                        role: user.role,
                        address: user.address || "",
                        school_ids: user.school_ids || [],
                    }}
                    roles={roles} 
                    schools={schools} 
                />

            )}

            {/* Delete Modal */}
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

export default function UserViewDetail() {
    return (
        <SuperLayout
            navigation={navigation}
            showGoPro={true}
            onLogout={() => console.log("Logged out")}
        >
            <Suspense fallback={
                <div>
                    <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
                        <CircularLoader size={32} color="teal" />
                    </div>
                </div>
            }>
                <UserViewDetailContent />
            </Suspense>
        </SuperLayout>
    );
}
