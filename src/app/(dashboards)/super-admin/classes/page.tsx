"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { Presentation, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserCreateSchema, UserSchema } from '@/app/models/UserModel';
import { SchoolSchema } from '@/app/models/SchoolModel';
import { getSchools } from '@/app/services/SchoolServices';
import Link from 'next/link';
import useAuth from '@/app/hooks/useAuth';
import DataTableFix from '@/components/utils/TableFix';
import { getClasses } from '@/app/services/ClassServices';
import { ClassSchema } from '@/app/models/ClassModel';
import CreateLevelModal from './components/CreateLevelModal';


export default function Page() {
    const BASE_URL = "/super-admin";

    const navigation = {
        icon: Presentation,
        baseHref: `${BASE_URL}/classes`,
        title: "Classes",
    };

    function Classes() {
        const router = useRouter();
        const [classes, setClasses] = useState<ClassSchema[]>([]);
        const [schools, setSchools] = useState<SchoolSchema[]>([]);
        const [loadingData, setLoadingData] = useState(false);
    
        useEffect(() => {
            const fetchSchools = async () => {
                setLoadingData(true);
                try {
                    const fetchedClasses = await getClasses();
                    const fetchedSchools = await getSchools();
                    setClasses(fetchedClasses);
                    setSchools(fetchedSchools);
                } catch (error) {
                    console.error("Error fetching schools or classes:", error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchSchools();
        }, []);
    
        // Count classes per school
        const getClassCount = (schoolId: string) => {
            return classes.filter(cls => cls.school_id === schoolId).length;
        };
    
        const columns = [
            { header: "School ID", accessor: (row: SchoolSchema) => row.school_id },
            { header: "School Name", accessor: (row: SchoolSchema) => { return <Link href={`${BASE_URL}/schools/view?id=${row.school_id}`}>{row.name}</Link>; } },
            { header: "Address", accessor: (row: SchoolSchema) => row.address },
            { header: "Classes", accessor: (row: SchoolSchema) => getClassCount(row._id) },
        ];
    
        const actions = [
            {
                label: "manage",
                onClick: (school: SchoolSchema) => {
                    // Navigate to the list of classes for the specific school
                    router.push(`${BASE_URL}/classes/manage?id=${school._id}`);
                },
            },
        ];
    
        return (
            <div className="md:p-6">
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
                <Classes />
            </SuperLayout>
        </Suspense>
    );
}


