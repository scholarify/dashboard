"use client";

import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { Presentation } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { getClasses } from "@/app/services/ClassServices";
import { getSchools } from "@/app/services/SchoolServices";
import { getClassLevels } from "@/app/services/ClassLevels";

import { ClassSchema } from "@/app/models/ClassModel";
import { SchoolSchema } from "@/app/models/SchoolModel";
import DataTableFix from "@/components/utils/TableFix";
import { ClassLevelSchema } from "@/app/models/ClassLevel";

const BASE_URL = "/super-admin";

function ManageClassesPage(): JSX.Element {
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("id");
    const [selectedClasses, setSelectedClasses] = useState<ClassSchema[]>([]);
    const [classes, setClasses] = useState<ClassSchema[]>([]);
    const [school, setSchool] = useState<SchoolSchema | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingClasses, setLoadingClasses] = useState<boolean>(false);
    const [loadingLevels, setLoadingLevels] = useState<boolean>(false);
    const [classLevel, setClassLevel] = useState<ClassLevelSchema[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClassLevelId, setSelectedClassLevelId] = useState<string>("all");

    useEffect(() => {
        if (!schoolId) return;

        const fetchData = async () => {
            setLoading(true);
            setLoadingClasses(true);
            setLoadingLevels(true);
            try {
                const [allClasses, allSchools, allClassLevels] = await Promise.all([
                    getClasses(),
                    getSchools(),
                    getClassLevels(),
                ]);

                const filteredClasses = allClasses.filter(
                    (cls: ClassSchema) => cls.school_id === schoolId
                );
                const matchedSchool = allSchools.find(
                    (s: SchoolSchema) => s._id === schoolId
                ) || null;

                const filteredClassLevels = allClassLevels.filter(
                    (level: ClassLevelSchema) => level.school_id === schoolId
                );
                console.log("allClassLevels Class Levels:", allClassLevels); // Add this

                setClasses(filteredClasses);
                setSchool(matchedSchool);
                setClassLevel(filteredClassLevels);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
                setLoadingClasses(false);
                setLoadingLevels(false);
            }
        };

        fetchData();
    }, [schoolId]);

    // console.log("Classes", classes);
    console.log("Class Levels", classLevel);

    const columns = [
        {
            header: "Class Level",
            accessor: (row: ClassSchema) => {
                const level = classLevel.find(
                    (lvl) => lvl._id === (typeof row.class_level === "object" ? row.class_level : row.class_level)
                );
                return level ? level.name : "Unknown";
            },
        },
        { header: "Class Name", accessor: (row: ClassSchema) => row.name },
        { header: "Class Code", accessor: (row: ClassSchema) => row.class_code },
    ];

    const classLevelColumns = [
        { header: "Class Level Name", accessor: (row: ClassLevelSchema) => row.name },
    ];
    const filteredClasses =
        selectedClassLevelId === "all"
            ? classes
            : classes.filter((cls) => cls.class_level === selectedClassLevelId);

    const navigation = {
        icon: Presentation,
        baseHref: `${BASE_URL}/classes`,
        title: school ? `Manage Classes of ${school.name}` : "Manage Classes",
    };

    const handleDeleteSelected = () => {
        if (selectedClasses.length === 0) {
            alert("Please select at least one school to delete.");
            return;
        }
        if (confirm(`Are you sure you want to delete ${selectedClasses.length} school(s)?`)) {
            setClasses(classes.filter((cl) => !selectedClasses.includes(cl)));
            setSelectedClasses([]); // Reset selection after deletion
        }
    };

    return (
        <SuperLayout
            navigation={navigation}
            showGoPro={true}
            onLogout={() => console.log("Logged out")}
        >
            <div className="md:p-6 flex flex-col md:flex-row gap-6">
                {/* First Table: Classes */}
                <div className="w-full md:w-1/2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 w-full py-2 bg-teal text-white rounded-md hover:bg-teal-600"
                        >
                            Add New Class
                        </button>
                        {/* Class Level Filter */}
                        <select
                            value={selectedClassLevelId}
                            onChange={(e) => setSelectedClassLevelId(e.target.value)}
                            className=" px-3 py-2 border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal w-full"
                        >
                            <option value="all">All Class Levels</option>
                            {classLevel.map((level) => (
                                <option key={level._id} value={level._id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DataTableFix
                        columns={columns}
                        data={filteredClasses}
                        defaultItemsPerPage={5}
                        loading={loadingClasses}
                        onLoadingChange={setLoadingClasses}
                        showCheckbox={true}
                        onSelectionChange={setSelectedClasses}
                    />

                </div>

                {/* Second Table: Class Levels */}
                <div className="w-full md:w-1/2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 mb-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 md:w-fit w-full"
                    >
                        Add New Level
                    </button>
                    <DataTableFix
                        columns={classLevelColumns}
                        data={classLevel}
                        defaultItemsPerPage={5}
                        loading={loadingLevels}
                        onLoadingChange={setLoadingLevels}
                    />

                </div>
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
