"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/app/hooks/useAuth';
import DataTableFix from '@/components/utils/TableFix';
import { getSchools } from '@/app/services/SchoolServices';
import { createInvitation, getInvitations } from '@/app/services/InvitationServices';
import { getStudents } from '@/app/services/StudentServices'; // Add this to fetch students
import { SchoolSchema } from '@/app/models/SchoolModel';
import { InvitationCreateSchema, InvitationSchema } from '@/app/models/Invitation';
import { StudentSchema } from '@/app/models/StudentModel'; // Assuming you have this
import CreateInvitationModal from './components/CreateInviteModal';
import NotificationCard from '@/components/NotificationCard';

export default function Page() {
    const BASE_URL = "/super-admin";

    const navigation = {
        icon: UserPlus,
        baseHref: `${BASE_URL}/parents`,
        title: "Manage Parent Invitations",
    };

    function Parents() {
        const router = useRouter();
        const [invitations, setInvitations] = useState<InvitationSchema[]>([]);
        const [schools, setSchools] = useState<SchoolSchema[]>([]);
        const [students, setStudents] = useState<StudentSchema[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [loadingData, setLoadingData] = useState(false);
        const [isNotificationCard, setIsNotificationCard] = useState(false);
        const [notificationMessage, setNotificationMessage] = useState("");
        const [notificationType, setNotificationType] = useState("success");
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);

        console.log("Invitations:", invitations);
        // console.log("Schools invi view:", schools);
        // console.log("Students invi view:", students);
        useEffect(() => {
            const fetchData = async () => {
                setLoadingData(true);
                try {
                    const fetchedInvitations = await getInvitations();
                    const fetchedSchools = await getSchools();
                    const fetchedStudents = await getStudents();
                    setInvitations(fetchedInvitations);
                    setSchools(fetchedSchools);
                    setStudents(fetchedStudents);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }, []);

        const getSchoolNames = (schoolIds?: string[]) => {
            if (!schoolIds || schoolIds.length === 0) return "No Schools";
            return schoolIds.map(id => {
                const school = schools.find(s => s._id === id);
                return school ? school.name : "Unknown School";
            }).join(", ");
        };

        const getStudentNames = (studentIds?: string[]) => {
            if (!studentIds || studentIds.length === 0) return "No Children";
            return studentIds.map(id => {
                const student = students.find(s => s._id === id);
                return student ? student.name : "Unknown Student";
            }).join(", ");
        };

        const StatusBadge = ({ status }: { status: "pending" | "accepted" | "expired" }) => {
            const getStatusStyles = () => {
                switch (status) {
                    case "pending":
                        return "bg-yellow-100 text-yellow-800";
                    case "accepted":
                        return "bg-green-100 text-green-800";
                    case "expired":
                        return "bg-red-100 text-red-800";
                    default:
                        return "";
                }
            };

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}>
                    {status}
                </span>
            );
        };
        const columns = [
            { header: "Email", accessor: (row: InvitationSchema) => row.email },
            { header: "Phone", accessor: (row: InvitationSchema) => row.phone || "N/A" },
            { header: "Name", accessor: (row: InvitationSchema) => row.name || "N/A" },
            { header: "Invited From", accessor: (row: InvitationSchema) => getSchoolNames(row.school_ids) },
            { header: "Children", accessor: (row: InvitationSchema) => getStudentNames(row.childrenIds) },
            { header: "Status", accessor: (row: InvitationSchema) => <StatusBadge status={row.status || "pending"} /> },

        ];

        const actions = [
            {
                label: "View",
                onClick: (invite: InvitationSchema) => {
                    router.push(`${BASE_URL}/parents/view?id=${invite._id}`);
                },
            },
        ];
        const handleSaveInvitation = async (invitationData: InvitationCreateSchema) => {
            //console.log("Invitation Data:", invitationData);
            setIsSubmitting(true);         // Start submitting
            setSubmitStatus(null);
            setLoadingData(true);
            try {
                const newInvitation: InvitationCreateSchema = {
                    email: invitationData.email,
                    phone: invitationData.phone,
                    name: invitationData.name,
                    school_ids: invitationData.school_ids,
                    childrenIds: invitationData.childrenIds,
                    status: "pending",
                    token: invitationData.token,
                }
                const data = await createInvitation(newInvitation)
                if (data) {
                    const [fetchedInvitations, fetchedSchools, fetchedStudents] = await Promise.all([
                        getInvitations(),
                        getSchools(),
                        getStudents(),
                    ]);

                    setInvitations(fetchedInvitations);
                    setSchools(fetchedSchools);
                    setStudents(fetchedStudents);

                    setSubmitStatus("success");                 // ✅ update success
                    setNotificationMessage("Invitation created successfully!");
                    setNotificationType("success");
                    setIsNotificationCard(true);

                    // optional: close modal after delay
                    setTimeout(() => {
                        setIsModalOpen(false);
                        setSubmitStatus(null); // reset
                    }, 4000);
                }
            } catch (error) {
                console.error("Error creating Invitation:", error);

                setSubmitStatus("failure");                  // ✅ update failure

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred while creating the invitation.";

                setNotificationMessage(errorMessage);
                setNotificationType("error");
                setIsNotificationCard(true);
            } finally {
                setIsSubmitting(false);                     // ✅ end submitting
                setLoadingData(false);
            }
        };
        return (
            <div className="">
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
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
                    >
                        Add New User
                    </button>
                </div>
                {isModalOpen && (
                    <CreateInvitationModal
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveInvitation}
                        submitStatus={submitStatus}
                        isSubmitting={isSubmitting}
                    />
                )}
                <DataTableFix
                    columns={columns}
                    data={invitations}
                    actions={actions}
                    defaultItemsPerPage={5}
                    loading={loadingData}
                    onLoadingChange={setLoadingData}
                    showCheckbox={false}
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
                <Parents />
            </SuperLayout>
        </Suspense>
    );
}
