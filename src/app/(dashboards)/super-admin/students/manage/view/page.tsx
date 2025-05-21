"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStudentById } from "@/app/services/StudentServices";
import { getSchools } from "@/app/services/SchoolServices";
import { getUserBy_id } from "@/app/services/UserServices";
import { StudentSchema } from "@/app/models/StudentModel";
import { SchoolSchema } from "@/app/models/SchoolModel";
import { UserSchema } from "@/app/models/UserModel";
import CircularLoader from "@/components/widgets/CircularLoader";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import NotificationCard from "@/components/NotificationCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getClasses } from "@/app/services/ClassServices";
import { ClassSchema } from "@/app/models/ClassModel";

export default function ViewParentPage() {
    const [schools, setSchools] = useState<SchoolSchema[]>([]);
    const [classes, setClasses] = useState<ClassSchema[]>([]);
    const [student, setStudent] = useState<StudentSchema | null>(null);
    const [parents, setParents] = useState<UserSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error" | "info" | "warning">("success");
    const searchParams = useSearchParams();
    const student_id = searchParams.get("studentId");
    const schoolId = searchParams.get("schoolId");

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const BASE_URL = "/super-admin";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentData, schoolData, classData] = await Promise.all([
                    getStudentById(student_id as string),
                    getSchools(),
                    getClasses()
                ]);

                setStudent(studentData);
                setSchools(schoolData);
                setClasses(classData)
                // Fetch parents if guardian_id exists
                if (studentData?.guardian_id?.length) {
                    const guardianUsers = await Promise.all(
                        studentData.guardian_id.map((id: string) => getUserBy_id(id))
                    );
                    setParents(guardianUsers);
                }
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };
        if (student_id) fetchData();
    }, [student_id]);

    const getSchoolNames = (ids?: string[]) =>
        ids?.map((id) => schools.find((s) => s._id === id)?.name || "Unknown").join(", ") || "No Schools";
    const getClassNames = (ids?: string[]) =>
        ids
          ?.map((id) =>
            classes.find((c) => c._id === id && c.school_id === schoolId)?.name || "Unknown"
          )
          .join(", ") || "No class";
      

    return (
        <SuperLayout
            navigation={{ icon: ArrowLeft, title: "Student Details", baseHref: "/super-admin/students" }}
            showGoPro={true}
            onLogout={() => console.log("Logout")}
        >
            {isNotificationCard && (
                <NotificationCard
                    title="Notification"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d" strokeWidth="1.5" />
                            <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d" strokeWidth="1.5" />
                        </svg>
                    }
                    message={notificationMessage}
                    onClose={() => setIsNotificationCard(false)}
                    type={notificationType}
                    isVisible={isNotificationCard}
                    isFixed={true}
                />
            )}

            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/90">
                    <CircularLoader size={32} color="teal" />
                </div>
            ) : !student ? (
                <div className="text-center text-red-600 font-semibold">Student not found.</div>
            ) : (
                <div className="md:p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Student Details
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <InfoBox label="Student ID" value={student.student_id || "N/A"} />
                            <InfoBox label="Name" value={student.name || "N/A"} />
                            <InfoBox label="Gender" value={student.gender || "N/A"} />
                            <InfoBox label="Date Of Birth" value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : "N/A"} />
                            <InfoBox label="School" value={getSchoolNames([schoolId as string])} />
                            <InfoBox
                                label="Parent(s)"
                                value={
                                    parents.length
                                        ? parents.map((p) => p.name).join(", ")
                                        : "No parents found"
                                }
                            />
                            <InfoBox label="Class" value={getClassNames([student.class_id as string])} />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Link
                                href={`${BASE_URL}/students/manage?id=${schoolId}`}
                                className="px-4 py-2 border border-gray-500 text-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Back to Students
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                onClick={() => setIsUpdateModalOpen(true)}
                                className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 flex items-center gap-2"
                            >
                                Edit Student
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
                            >
                                Delete Student
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}
        </SuperLayout>
    );
}

const InfoBox = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
    </div>
);
