"use client";

import { Users } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateUserModal from "../components/CreateUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import CircularLoader from "@/components/widgets/CircularLoader";
import { deleteUser, getUserById, updateUser, verifyPassword } from "@/app/services/UserServices";
import { UserSchema, UserUpdateSchema } from "@/app/models/UserModel";
import NotificationCard from "@/components/NotificationCard";
import { SchoolSchema } from "@/app/models/SchoolModel";
import { getSchools } from "@/app/services/SchoolServices";
import UpdateUserModal from "../components/UpdateUserModal";
import { Schoolbell } from "next/font/google";
import { motion } from "framer-motion";
import Loading from "@/components/widgets/Loading";


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
    const [userToDelete, setUserToDelete] = useState<UserSchema | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);
    const [notificationType, setNotificationType] = useState("success")
    const [loadingSchools, setLoadingSchools] = useState(true); // New state for loading schools
    const [users, setUsers] = useState<UserSchema[]>([]);
    const roles = ["admin", "teacher", "student", "super"];

    // Load user details based on the userId
    const fetchData = async () => {
        setLoadingData(true);
        try {
            if (!userId) {
                return;
            }
            // Set loading to true while fetching data
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
            setLoadingData(false);   
            setLoadingSchools(false); // Set loading to false after fetching data
            }
    };
    useEffect(() => {

        fetchData();
    }, [userId, router]);

    // console.log("filterd schools found:", filteredSchools)

    // Handle user deletion

     const handleDelete = async (password: string) => {
       setIsSubmitting(true);
       setSubmitStatus(null);
       // setLoadingData(false);
       if(!user) return;
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
           setIsDeleteModalOpen(false); // ✅ Close delete modal properly
           setSubmitStatus(null);
         }, 10000);
         return;
       }
 
       if (user) {
         try {
           // Call the API to delete the user from the backend
           await deleteUser(user.user_id); // Assuming user_id exists
            // Redirect to the users page after deletion
           setSubmitStatus("success");
           setNotificationMessage("User Deleted successfully!");
           setIsNotificationCard(true);
           setNotificationType("success");
 
           setTimeout(() => {
             setIsDeleteModalOpen(false); // ✅ Close delete modal properly
             setSubmitStatus(null);
             router.push("/super-admin/users");
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
 

    // Handle saving updates to the user
    const handleSave = async (userData: UserUpdateSchema) => {
        if (user) {
            setIsSubmitting(true);         // Start submitting
            setSubmitStatus(null);
            // setLoadingData(true);
            try {
                const updatedUser: UserUpdateSchema = {
                    user_id: user?.user_id || "",
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
                        fetchData();
                        setSubmitStatus("success");                 // ✅ update success
                        setNotificationMessage("User Updated successfully!");
                        setNotificationType("success");
                        setIsNotificationCard(true);

                        // optional: close modal after delay
                        setTimeout(() => {
                            setIsEditModalOpen(false);

                            setSubmitStatus(null); // reset

                        }, 10000);
                    }
                } else {
                    console.error("User ID is undefined. Cannot update user.");
                }
            } catch (error) {
                console.error("Error Updating User:", error);

                setSubmitStatus("failure");                  // ✅ update failure

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred while Updating this user.";

                setNotificationMessage(errorMessage);
                setNotificationType("error");
                setIsNotificationCard(true);
            } finally {
                setIsSubmitting(false);                     // ✅ end submitting
                // setLoadingData(false);
            }
        }
    };

    // if (!user) {
    //     <Loading />
    // }

    if (loadingData) {
        return (
            <Loading />
        );
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
                        {user ? `${user.name} Details` : "User Details"}
                    </h1>

                    {/* User Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* User ID */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                User ID
                            </p>
                            <p className="text-sm text-foreground">{user ? user.user_id : "N/A"}</p>
                        </div>

                        {/* User Role */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Role
                            </p>
                            <p className="text-sm text-foreground">{user ? user.role : "N/A"}</p>
                        </div>

                        {/* Name */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Name
                            </p>
                            <p className="text-sm text-foreground">{user ? user.name : "N/A"}</p>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Email
                            </p>
                            <p className="text-sm text-foreground">{user ? user.email : "N/A"}</p>
                        </div>

                        {/* Phone Number */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md h-fit">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Phone Number
                            </p>
                            <p className="text-sm text-foreground">{user ? user.phone || "N/A" : "N/A"}</p>
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal"
                        >
                            Edit User
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={() => setIsDeleteModalOpen(true)} // Open delete modal
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete User
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <UpdateUserModal
                    onClose={() => { setIsEditModalOpen(false); setSubmitStatus(null); setUserToDelete(null); }}
                    onSave={handleSave}
                    initialData={{
                        user_id: user?.user_id || "",
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        password: user?.password || "",
                        role: user?.role,
                        address: user?.address || "",
                        school_ids: user?.school_ids || [],
                    }}
                    roles={roles}
                    schools={schools}
                    isSubmitting={isSubmitting}
                    submitStatus={submitStatus}
                />

            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <DeleteUserModal
                    userName={user?.name || "Unknown"}
                    onClose={() => { setIsDeleteModalOpen(false); setSubmitStatus(null); router.push("/super-admin/users"); }}
                    onDelete={handleDelete}
                    isSubmitting={isSubmitting}
                    submitStatus={submitStatus}
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
