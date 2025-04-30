"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInvitations, resendInvitationToken } from "@/app/services/InvitationServices";
import { getSchools } from "@/app/services/SchoolServices";
import { getStudents } from "@/app/services/StudentServices";
import { InvitationSchema } from "@/app/models/Invitation";
import { SchoolSchema } from "@/app/models/SchoolModel";
import { StudentSchema } from "@/app/models/StudentModel";
import CircularLoader from "@/components/widgets/CircularLoader";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import NotificationCard from "@/components/NotificationCard";

export default function ViewParentPage() {
    const [invitation, setInvitation] = useState<InvitationSchema | null>(null);
    const [schools, setSchools] = useState<SchoolSchema[]>([]);
    const [students, setStudents] = useState<StudentSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success");
    const searchParams = useSearchParams();
    const invitationId = searchParams.get("id");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [invites, schoolData, studentData] = await Promise.all([
                    getInvitations(),
                    getSchools(),
                    getStudents(),
                ]);

                const found = invites.find((inv) => inv._id === invitationId);
                if (found) setInvitation(found);
                setSchools(schoolData);
                setStudents(studentData);
            } catch (error) {
                console.error("Error loading invitation data", error);
            } finally {
                setLoading(false);
            }
        };

        if (invitationId) fetchData();
    }, [invitationId]);

    const getSchoolNames = (ids?: string[]) =>
        ids?.map((id) => schools.find((s) => s._id === id)?.name || "Unknown").join(", ") || "No Schools";

    const getStudentNames = (ids?: string[]) =>
        ids?.map((id) => students.find((s) => s._id === id)?.name || "Unknown").join(", ") || "No Children";

    async function handleResendToken() {
        if (!invitation?.email) return;
        setLoadingData(true);
        try {
            await resendInvitationToken(invitation.email);

            setInvitation(invitation);
            setNotificationMessage("Invitation created successfully!");
            setIsNotificationCard(true);
            setNotificationType("success");
        } catch (error) {
            console.error("Error creating Invitation:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while creating the class.";
            setNotificationMessage(errorMessage);
            setIsNotificationCard(true);
            setNotificationType("error");
        } finally {
            setLoadingData(false);
        }
    }

    return (
        <SuperLayout
            navigation={{ icon: ArrowLeft, title: "Parent Invitation Details", baseHref: "/super-admin/parents" }}
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
                <div className="flex justify-center items-center h-[60vh]">
                    <CircularLoader size={32} color="teal" />
                </div>
            ) : !invitation ? (
                <div className="text-center text-red-600 font-semibold">Invitation not found.</div>
            ) : (
                <div className="md:p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        {/* Title */}
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Parent Invitation Details
                        </h1>

                        {/* Parent Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Name */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Name</p>
                                <p className="text-sm text-foreground">{invitation.name || "N/A"}</p>
                            </div>

                            {/* Email */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Email</p>
                                <p className="text-sm text-foreground">{invitation.email}</p>
                            </div>

                            {/* Phone */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Phone</p>
                                <p className="text-sm text-foreground">{invitation.phone || "N/A"}</p>
                            </div>

                            {/* Status */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Status</p>
                                <p className="text-sm text-foreground">{invitation.status}</p>
                            </div>

                            {/* Schools */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Schools</p>
                                <p className="text-sm text-foreground">{getSchoolNames(invitation.school_ids)}</p>
                            </div>

                            {/* Children */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Children</p>
                                <p className="text-sm text-foreground">{getStudentNames(invitation.childrenIds)}</p>
                            </div>

                            {/* Token
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Token</p>
                                <p className="text-sm text-foreground">{invitation.token}</p>
                            </div> */}

                            {/* Invited At */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Invited At</p>
                                <p className="text-sm text-foreground">{invitation.invitedAt ? new Date(invitation.invitedAt).toLocaleString() : "N/A"}</p>
                            </div>

                            {/* Expires At */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Expires At</p>
                                <p className="text-sm text-foreground">{new Date(invitation.expiresAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            {/* Back to Invitations Button */}
                            <Link
                                href="/super-admin/parents"
                                className="px-4 py-2 border border-gray-500 text-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Back to Invitations
                            </Link>

                            {/* Conditional Action Button */}
                            {invitation.status === "expired" && (
                                <button
                                    onClick={handleResendToken}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-bg-orange-700"
                                >
                                    Resend Token
                                </button>
                            )}

                            {invitation.status === "pending" && (
                                <button
                                    disabled
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                >
                                    Resend Token (Disabled)
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </SuperLayout>
    );
}
