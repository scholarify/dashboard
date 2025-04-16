"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { Presentation } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { getClasses } from '@/app/services/ClassServices';
import { getSchools } from '@/app/services/SchoolServices';

import { ClassSchema } from '@/app/models/ClassModel';
import { SchoolSchema } from '@/app/models/SchoolModel';
import DataTableFix from '@/components/utils/TableFix';

const BASE_URL = "/super-admin";

function ManageClassesPage(): JSX.Element {
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("id");
    const [selectedClasses, setSelectedClasses] = useState<ClassSchema[]>([]);
    const [classes, setClasses] = useState<ClassSchema[]>([]);
    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    

    useEffect(() => {
        if (!schoolId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [allClasses, allSchools] = await Promise.all([
                    getClasses(),
                    getSchools()
                ]);

                const filtered = allClasses.filter((cls: ClassSchema) => cls.school_id === schoolId);
                const matchedSchool = allSchools.find((s: SchoolSchema) => s._id === schoolId) || null;

                setClasses(filtered);
                setSchool(matchedSchool);
            } catch (err) {
                console.error("Failed to fetch classes or school", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [schoolId]);

    const columns = [
        { header: "Class ID", accessor: (row: ClassSchema) => row.class_id },
        { header: "Class Level", accessor: (row: ClassSchema) => row.class_level },
        { header: "Class Code", accessor: (row: ClassSchema) => row.class_code },
        { header: "Created At", accessor: (row: ClassSchema) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-" },
    ];

    const navigation = {
        icon: Presentation,
        baseHref: `${BASE_URL}/classes`,
        title: school ? `Manage Classes of ${school.name}` : "Manage Classes",
    };
    console.log("Selected Classes", selectedClasses);
    const handleDeleteSelected = () => {
        if (selectedClasses.length === 0) {
          alert("Please select at least one school to delete.");
          return;
        }
        if (confirm(`Are you sure you want to delete ${selectedClasses.length} school(s)?`)) {
          setClasses(classes.filter((cl) => !selectedClasses.includes(cl)));
          setSelectedClasses([]); // Réinitialiser la sélection après suppression
        }
      };


    return (
        <SuperLayout
            navigation={navigation}
            showGoPro={true}
            onLogout={() => console.log("Logged out")}
        >
            <div className="md:p-6">
                {schoolId ? (
                    <DataTableFix
                        columns={columns}
                        data={classes}
                        defaultItemsPerPage={5}
                        loading={loading}
                        onLoadingChange={setLoading}
                        showCheckbox={true}
                        onSelectionChange={setSelectedClasses}
                    />
                ) : (
                    <p className="text-red-600">Missing school ID in URL.</p>
                )}
            </div>
        </SuperLayout>
    );
}

export default function Page(): JSX.Element {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
                    <CircularLoader size={32} color="teal" />
                </div>
            }
        >
            <ManageClassesPage />
        </Suspense>
    );
}
