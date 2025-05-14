"use client";
import { getStudentsByClassAndSchool } from "@/app/services/StudentServices";
import { StudentSchema } from "@/app/models/StudentModel";
import { BookOpen, Presentation } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CircularLoader from "@/components/widgets/CircularLoader";
import NotificationCard from "@/components/NotificationCard";
import NoData from "@/components/widgets/NoData";
import { getClassById, deleteClass, updateClass } from "@/app/services/ClassServices";
import { getClassLevels } from "@/app/services/ClassLevels";
import { getSchoolBy_id, getSchools } from "@/app/services/SchoolServices";

import { ClassSchema, ClassUpdateSchema } from "@/app/models/ClassModel";
import { ClassLevelSchema } from "@/app/models/ClassLevel";
import { SchoolSchema } from "@/app/models/SchoolModel";

import UpdateClassModal from "../../components/UpdateClassModal";
import DeleteClassModal from "../../components/DeleteClassModal";
import { verifyPassword } from "@/app/services/UserServices";
import useAuth from "@/app/hooks/useAuth";
import DataTableFix from "@/components/utils/TableFix";
import { motion } from "framer-motion";
import Loading from "@/components/widgets/Loading";
import { link } from "fs";
import { calculateAge } from "@/components/utils/CalculateAge";

const BASE_URL = "/super-admin";

function ClassDetailContent({ classId, schoolId }: { classId: string | null, schoolId: string | null }) {


    // console.log("classId:", classId)

    const [classData, setClassData] = useState<ClassSchema | null>(null);
    const [classLevels, setClassLevels] = useState<ClassLevelSchema[]>([]);
    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [students, setStudents] = useState<StudentSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);
    const { user } = useAuth();

    const studentColumns = [
        { header: "Student ID", accessor: (row: StudentSchema) => row.student_id },
        { header: "Full Name", accessor: (row: StudentSchema) => row.name },
        { header: "Age", accessor: (row: StudentSchema) => calculateAge(row.date_of_birth) },
        {
            header: "Gender",
            accessor: (row: StudentSchema) =>
                row.gender ? row.gender.charAt(0).toUpperCase() + row.gender.slice(1) : "N/A",
        },
        {
            header: "Status",
            accessor: (row: StudentSchema) => row.status || "Not specified",
        },
    ];
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
            const school = schoolRes;

            setClassData(cls);
            setSchool(school);
            if (cls) {
                const studentsData = await getStudentsByClassAndSchool(cls._id, schoolId as string);
                setStudents(studentsData);
            }


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

    useEffect(() => {


        fetchData();
    }, [classId, schoolId]);



    // console.log("Class", classData)
    // console.log("Class Levels", classLevels)
    // console.log("Students:", students)



    const handleSave = async (classData: ClassUpdateSchema) => {

        if (user) {
            setIsSubmitting(true);         // Start submitting
            setSubmitStatus(null);
            try {
                const updateClassData: ClassUpdateSchema = {
                    _id: classData._id,
                    class_id: classId as string,
                    school_id: classData.school_id,
                    class_level: classData.class_level,
                    class_code: classData.class_code,
                    name: classData.name
                };
                if (classId) {
                    const data = await updateClass(classData._id, updateClassData);
                    //console.log("error from saving class:", data);
                    if (data) {
                        setClassData(data);
                        setSubmitStatus("success");                 // ✅ update success
                        setNotificationMessage("Invitation created successfully!");
                        setNotificationType("success");
                        setIsNotificationCard(true);
                        setIsSubmitting(false); // Stop submitting
                        // optional: close modal after delay
                        setTimeout(() => {
                            setIsEditModalOpen(false);
                            setSubmitStatus(null); // reset
                        }, 10000);
                    }
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Error updating Class:";
                setSubmitStatus("failure");                  // ✅ update failure
                setNotificationMessage(errorMessage);
                setIsNotificationCard(true);
                setNotificationType("error");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDelete = async (password: string) => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        if (!classData || !user) return;
        // Assuming you have a function `verifyPassword` that checks if the provided password is valid
        const passwordVerified = user ? await verifyPassword(password, user.email) : false;

        if (!passwordVerified) {
            // If password is not valid
            setNotificationMessage("Invalid Password!");
            setNotificationType("error");
            setIsNotificationCard(true);

            // ✅ Fix: Reset loading/submitting states even when password fails
            setIsSubmitting(false);
            setSubmitStatus("failure");
            setTimeout(() => {
                setIsDeleteModalOpen(false); // ✅ Close delete modal properly
                setSubmitStatus(null);
            }, 10000);
            return; // Stop execution if password verification fails
        }

        // Proceed with deletion if the password is verified
        if (classData) {
            try {
                // Call the API to delete the class (assuming `deleteClass` is a function that deletes a class)
                await deleteClass(classData._id);
                fetchData();
                setSubmitStatus("success");
                // Remove the class from the state to update the UI
                setNotificationMessage("Class Deleted successfully!");
                setNotificationType("success");
                setIsNotificationCard(true);
                setTimeout(() => {
                    setIsDeleteModalOpen(false); // ✅ Close delete modal properly
                    setSubmitStatus(null);
                    router.push(`${BASE_URL}/classes`);
                }, 10000);
                // Redirect back to the class list after deletion
                
            } catch (error) {
                console.error("Error Deleting Class :", error);

                setSubmitStatus("failure");

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred while deleting this class.";

                setNotificationMessage(errorMessage);
                setNotificationType("error");
                setIsNotificationCard(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading) {
        return (
            <Loading/>
        );
      }
      

    if (!classData) {
        return <div className="">
            <NoData/>
        </div>;
    }

    return (
        <div className="md:py-6">
            {isNotificationCard && (
                <NotificationCard
                    title="Notification"
                    message={notificationMessage}
                    onClose={() => setIsNotificationCard(false)}
                    type={notificationType}
                    isVisible={isNotificationCard}
                    isFixed={true}
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                />
            )}
            {/* Edit Modal */}
            {isEditModalOpen && (
                <UpdateClassModal
                    onClose={() => {setIsEditModalOpen(false); setSubmitStatus(null); }}
                    onSave={handleSave}
                    initialData={classData}
                    classLevels={classLevels}
                    submitStatus={submitStatus}
                    isSubmitting={isSubmitting}
                />

            )}

            {isDeleteModalOpen && classData && (
                <DeleteClassModal
                    className={classData.name}
                    onClose={() => {setIsDeleteModalOpen(false); setSubmitStatus(null); router.push(`${BASE_URL}/classes`);}}
                    onDelete={handleDelete}
                    submitStatus={submitStatus}
                    isSubmitting={isSubmitting}
                />
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                    {classData?.name} - <span className="opacity-60">{school?.name}</span>
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
                <div className="flex justify-end space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-700"
                    >
                        Edit Class
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete Class
                    </motion.button>
                </div>
            </div>
            <div className="dark:bg-gray-800  mt-4">
                <h1 className="text-2xl font-bold text-foreground mb-4 p-6">
                    Students Of {classData?.name} - <span className="opacity-60">{school?.name}</span>
                </h1>
                <DataTableFix
                    data={students}
                    columns={studentColumns}
                    hasSearch
                    showCheckbox={false}
                />
            </div>


        </div>
    );

}


export default function ClassViewDetailPage() {
    const searchParams = useSearchParams();
    const classId = searchParams.get("classId");
    const schoolId = searchParams.get("schoolId")
    return (
        <SuperLayout
            navigation={{ icon: Presentation, baseHref: `${BASE_URL}/classes/manage/view?classId=${classId}&schoolId=${schoolId});`, title: "Class Details" }}
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
                <ClassDetailContent classId={classId} schoolId={schoolId} />
            </Suspense>
        </SuperLayout>
    );
}
