"use client";

import { BookOpen, Presentation } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CircularLoader from "@/components/widgets/CircularLoader";
import NotificationCard from "@/components/NotificationCard";

import { getClassById, deleteClass, updateClass } from "@/app/services/ClassServices";
import { getClassLevels } from "@/app/services/ClassLevels";
import { getSchoolBy_id, getSchools } from "@/app/services/SchoolServices";

import { ClassSchema } from "@/app/models/ClassModel";
import { ClassLevelSchema } from "@/app/models/ClassLevel";
import { SchoolSchema } from "@/app/models/SchoolModel";

import UpdateClassModal from "../../components/UpdateClassModal";
import DeleteClassModal from "../../components/DeleteClassModal";
import { verifyPassword } from "@/app/services/UserServices";
import useAuth from "@/app/hooks/useAuth";

const BASE_URL = "/super-admin";

function ClassDetailContent({ classId, schoolId }: { classId: string | null, schoolId: string | null }) {


    // console.log("classId:", classId)

    const [classData, setClassData] = useState<ClassSchema | null>(null);
    const [classLevels, setClassLevels] = useState<ClassLevelSchema[]>([]);
    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success")
    const { user } = useAuth();

    const [notification, setNotification] = useState({
        visible: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!classId || !schoolId) {
                console.log("Missing classId or schoolId");
                setLoading(false);
                return;
            }
    
            try {
                const [clsRes, levelsRes, schoolRes] = await Promise.all([
                    getClassById(classId as string),
                    getClassLevels(),
                    getSchoolBy_id(schoolId as string),
                ]);
    
                // console.log("clsRes", clsRes);
                // console.log("levelsRes", levelsRes);
                // console.log("schoolRes", schoolRes);
    
                // Adapt to the structure your API returns
                const cls = clsRes;
                const levels = levelsRes;
                const school =  schoolRes;
    
                setClassData(cls);
                setSchool(school);
    
                const filteredLevels = levels?.filter(
                    (lvl) => lvl.school_id === schoolId
                ) || [];
    
                setClassLevels(filteredLevels);
            } catch (error) {
                console.error("Error fetching class data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [classId, schoolId]);
    
    
    
    // console.log("Class", classData)
    // console.log("Class Levels", classLevels)



    const handleSave = async (updatedData: Partial<ClassSchema>) => {
        // if (!classData) return;
        // try {
        //   const updated = await updateClass(classData._id, updatedData);
        //   setClassData(updated);
        //   setNotification({ visible: true, type: "success", message: "Class updated successfully!" });
        // } catch (error) {
        //   setNotification({ visible: true, type: "error", message: "Failed to update class." });
        // } finally {
        //   setIsEditModalOpen(false);
        // }
    };

    // const handleDelete = async (password: string) => {
    //     // Assuming you have a function `verifyPassword` that checks if the provided password is valid
    //     const passwordVerified = user ? await verifyPassword(password, user.email) : false;

    //     if (!passwordVerified) {
    //         // If password is not valid
    //         setNotificationMessage("Invalid Password!");
    //         setNotificationType("error");
    //         setIsNotificationCard(true);
    //         return; // Stop execution if password verification fails
    //     }

    //     // Proceed with deletion if the password is verified
    //     if (classData) {
    //         try {
    //             // Call the API to delete the class (assuming `deleteClass` is a function that deletes a class)
    //             await deleteClass(classData._id);

    //             // Remove the class from the state to update the UI
    //             setNotificationMessage("Class Deleted successfully!");
    //             setNotificationType("success");
    //             setIsNotificationCard(true);

    //             // Redirect back to the class list after deletion
    //             router.push(`${BASE_URL}/classes`);
    //         } catch (error) {
    //             console.error("Error deleting class:", error);

    //             // Handle any errors that occur during the deletion process
    //             const errorMessage = error instanceof Error ? error.message : "Error deleting class";
    //             setNotificationMessage(errorMessage);
    //             setIsNotificationCard(true);
    //             setNotificationType("error");
    //         }
    //     }
    // };


    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
    //             <CircularLoader size={32} color="teal" />
    //         </div>
    //     );
    // }

    // if (!classData) {
    //     return <p className="text-center text-gray-500">Class not found.</p>;
    // }

    return (
        <div className="md:p-6">
            {notification.visible && (
                <NotificationCard
                    title="Notification"
                    message={notification.message}
                    type={notification.type}
                    isVisible={notification.visible}
                    onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
                    isFixed
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                    {classData?.name} Details
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Class Name</p>
                        <p className="text-sm text-foreground">{classData?.name}</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Class Code</p>
                        <p className="text-sm text-foreground">{classData?.class_code}</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Class Level</p>
                        <p className="text-sm text-foreground">
                            {classLevels.find(level => level._id === classData?.class_level)?.name || "Unknown"}
                        </p>

                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">School</p>
                        <p className="text-sm text-foreground">{school?.name || "N/A"}</p>
                    </div>
                </div>

                {/* Buttons */}
                {/* <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-700"
                    >
                        Edit Class
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete Class
                    </button>
                </div> */}
            </div>

   


        </div>
    );
}

export default function ClassViewDetailPage() {
    const searchParams = useSearchParams();
    const classId = searchParams.get("id");
    const schoolId = searchParams.get("schoolId")
    return (
        <SuperLayout
            navigation={{ icon: Presentation, baseHref: `/super-admin/classes/manage/view?id=${classId}&schoolId=${schoolId}`, title: "Class Details" }}
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
                <ClassDetailContent classId={classId} schoolId={schoolId}/>
            </Suspense>
        </SuperLayout>
    );
}
