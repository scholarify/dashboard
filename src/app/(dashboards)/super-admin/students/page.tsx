"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SchoolSchema } from '@/app/models/SchoolModel';
import { getSchools } from '@/app/services/SchoolServices';
import Link from 'next/link';
import DataTableFix from '@/components/utils/TableFix';
import { getStudents } from '@/app/services/StudentServices'; // You need to create this
import { StudentSchema } from '@/app/models/StudentModel'; // You need to create this

export default function Page() {
    const BASE_URL = "/super-admin";

    const navigation = {
        icon: GraduationCap,
        baseHref: `${BASE_URL}/students`,
        title: "Students",
    };

    function Students() {
        const router = useRouter();
        const [students, setStudents] = useState<StudentSchema[]>([]);
        const [schools, setSchools] = useState<SchoolSchema[]>([]);
        const [loadingData, setLoadingData] = useState(false);

        useEffect(() => {
            const fetchData = async () => {
                setLoadingData(true);
                try {
                    const fetchedStudents = await getStudents();
                    const fetchedSchools = await getSchools();
                    setStudents(fetchedStudents);
                    setSchools(fetchedSchools);
                } catch (error) {
                    console.error("Error fetching students or schools:", error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }, []);

        const getStudentCount = (schoolId: string) => {
            return students.filter(std => std.school_id === schoolId).length;
        };

        const columns = [
            { header: "School ID", accessor: (row: SchoolSchema) => row.school_id },
            { header: "School Name", accessor: (row: SchoolSchema) => <Link href={`${BASE_URL}/schools/view?id=${row.school_id}`}>{row.name}</Link> },
            { header: "Address", accessor: (row: SchoolSchema) => row.address },
            { header: "Students", accessor: (row: SchoolSchema) => getStudentCount(row._id) },
        ];

        const actions = [
            {
                label: "manage",
                onClick: (school: SchoolSchema) => {
                    router.push(`${BASE_URL}/students/manage?id=${school._id}`);
                },
            },
        ];

        return (
            <div className="">
                <DataTableFix
                    columns={columns}
                    data={schools}
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
                <Students />
            </SuperLayout>
        </Suspense>
    );
}
