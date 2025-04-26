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
import { getInvitations } from '@/app/services/InvitationServices';
import { getStudents } from '@/app/services/StudentServices'; // Add this to fetch students
import { SchoolSchema } from '@/app/models/SchoolModel';
import { InvitationCreateSchema, InvitationSchema } from '@/app/models/Invitation';
import { StudentSchema } from '@/app/models/StudentModel'; // Assuming you have this
import CreateInvitationModal from './components/CreateInviteModal';

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
        console.log("Invitations:", invitations);
        console.log("Schools:", schools);
        console.log("Students:", students); // Log the fetched students
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
            { header: "Schools Invited", accessor: (row: InvitationSchema) => getSchoolNames(row.school_ids) },
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
        const handleSaveInvitation = (invitationData: InvitationCreateSchema) => {
            // TODO: send invitation to the server
            console.log("Saving invitation", invitationData);
            setIsModalOpen(false);
        };
        return (
            <div className="">
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
