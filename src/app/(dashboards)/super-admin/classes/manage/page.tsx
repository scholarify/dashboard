"use client";

import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import CircularLoader from "@/components/widgets/CircularLoader";
import React, { Suspense, useEffect, useState } from "react";
import { Presentation } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClass, deleteClass, getClasses } from "@/app/services/ClassServices";
import { getSchools } from "@/app/services/SchoolServices";
import { createClassLevel, deleteClassLevel, getClassLevels } from "@/app/services/ClassLevels";

import { ClassCreateSchema, ClassSchema } from "@/app/models/ClassModel";
import { SchoolSchema } from "@/app/models/SchoolModel";
import DataTableFix from "@/components/utils/TableFix";
import { ClassLevelCreateSchema, ClassLevelSchema } from "@/app/models/ClassLevel";
import CreateLevelModal from "../components/CreateLevelModal";
import useAuth from "@/app/hooks/useAuth";
import NotificationCard from "@/components/NotificationCard";
import DeleteClassLevelModal from "../components/DeleteLevelModal";
import { verifyPassword } from "@/app/services/UserServices";
import CreateClassModal from "../components/CreateClassModal";
import DeleteClassModal from "../components/DeleteClassModal";


const BASE_URL = "/super-admin";

function ManageClassesPage(): JSX.Element {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("id");
  const [selectedClasses, setSelectedClasses] = useState<ClassSchema[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<ClassLevelSchema[]>([]);
  const [classes, setClasses] = useState<ClassSchema[]>([]);
  const [school, setSchool] = useState<SchoolSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [classLevel, setClassLevel] = useState<ClassLevelSchema[]>([]);
  const [classToDelete, setClassToDelete] = useState<ClassSchema | null>(null);
  const [LevelToDelete, setLevelToDelete] = useState<ClassLevelSchema | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedClassLevelId, setSelectedClassLevelId] = useState("all");
  const [isNotificationCard, setIsNotificationCard] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ClassLevelSchema | null>(null);
  const [editingClass, setEditingClass] = useState<ClassSchema | undefined>(undefined);

  const { user } = useAuth();
  const router = useRouter();

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
        const matchedSchool = allSchools.find((s: SchoolSchema) => s._id === schoolId) || null;

        const filteredClassLevels = allClassLevels.filter(
          (level: ClassLevelSchema) => level.school_id === schoolId
        );

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

  const Class_actions = [
    {
      label: "View",
      onClick: (cls: ClassSchema) => {
        router.push(`${BASE_URL}/classes/manage/view?id=${cls.class_id}&schoolId=${schoolId}`);
      },
    },
    {
      label: "Delete",
      onClick: (cls: ClassSchema) => {
        setClassToDelete(cls);
      },
    },
  ];

  const Level_actions = [
    {
      label: "Delete",
      onClick: (level: ClassLevelSchema) => {
        setLevelToDelete(level);
      },
    },
  ];

  const handleAddClass = () => {
    setEditingClass(undefined);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async (classData: ClassSchema) => {
    try {
        // Build the new class object
        const newClass: ClassCreateSchema = {
          school_id: schoolId as string,
          class_level: classData.class_level,
          class_code: classData.class_code,
          name: classData.name,
        };
    
        // Make the API call
        const data = await createClass(newClass);
    
        if (data) {
          // Construct the class object from response (optional: you may already get it structured)
          const createdClass: ClassSchema = {
            _id: data._id,
            class_id: data.class_id,
            school_id: data.school_id,
            class_level: data.class_level,
            class_code: data.class_code,
            name: data.name,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
    
          // Optional: Update class list in state if needed
          setClasses((prev) => [...prev, createdClass]);
    
          // Show success notification
          setNotificationMessage("Class created successfully!");
          setIsNotificationCard(true);
          setNotificationType("success");
        }
      } catch (error) {
        console.error("Error creating class:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unknown error occurred while creating the class.";
        setNotificationMessage(errorMessage);
        setIsNotificationCard(true);
        setNotificationType("error");
      } finally {
        setLoadingData(false);
        // Optionally close modal here
        // setIsModalOpen(false);
      }
  };

  const handleSaveLevel = async (levelData: ClassLevelCreateSchema) => {
    setLoadingData(true);
    try {
      const newLevel: ClassLevelCreateSchema = {
        name: levelData.name,
        school_id: schoolId || "",
      };

      const data = await createClassLevel(newLevel);
      if (data) {
        const createdLevel: ClassLevelSchema = {
          name: data.name,
          school_id: data.school_id,
          _id: data._id,
        };

        setClassLevel((prev) => [...prev, createdLevel]);
        setNotificationMessage("Level created successfully!");
        setNotificationType("success");
        setIsNotificationCard(true);
      }
    } catch (error) {
      console.error("Error creating class level:", error);
      alert("Failed to create class level");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteClass = async (password: string) => {
    if (!classToDelete || !user) return;

    const passwordVerified = await verifyPassword(password, user.email);
    if (!passwordVerified) {
      setNotificationMessage("Invalid Password!");
      setNotificationType("error");
      setIsNotificationCard(true);
      return;
    }

    try {
      // Call the delete class API here
      await deleteClass(classToDelete._id);
      setClasses((prev) => prev.filter((cls) => cls.class_id !== classToDelete.class_id));
      setClassToDelete(null);
      setNotificationMessage("Class deleted successfully!");
      setNotificationType("success");
      setIsNotificationCard(true);
    } catch (error) {
      console.error("Error deleting class:", error);
      setNotificationMessage("Failed to delete class.");
      setNotificationType("error");
      setIsNotificationCard(true);
    } finally {
      setClassToDelete(null);
    }
  }

  const handleDeleteLevel = async (password: string) => {
    if (!LevelToDelete || !user) return;

    const passwordVerified = await verifyPassword(password, user.email);
    if (!passwordVerified) {
      setNotificationMessage("Invalid Password!");
      setNotificationType("error");
      setIsNotificationCard(true);
      return;
    }

    try {
      await deleteClassLevel(LevelToDelete._id);
      setClassLevel((prevLevels) => prevLevels.filter((lvl) => lvl._id !== LevelToDelete._id));
      setLevelToDelete(null);
      setNotificationMessage("Class level deleted successfully!");
      setNotificationType("success");
      setIsNotificationCard(true);
    } catch (error) {
      console.error("Error deleting class level:", error);
      setNotificationMessage("Failed to delete class level.");
      setNotificationType("error");
      setIsNotificationCard(true);
    } finally {
      setLevelToDelete(null);
    }
  };

  return (
    <SuperLayout navigation={navigation} showGoPro={true} onLogout={() => console.log("Logged out")}>
      <div className="md:p-6 flex flex-col md:flex-row gap-6">
      {schoolId && isClassModalOpen &&(
        <CreateClassModal
            onClose={() => setIsClassModalOpen(false)}
            onSave={handleSaveClass}
            schoolId={schoolId} // ✅ guaranteed to be string here
            classLevels={classLevel}
            initialData={editingClass}
        />
        )}

        {classToDelete && (
          <DeleteClassModal
            className={classToDelete.name}
            onClose={() => setClassToDelete(null)}
            onDelete={handleDeleteClass}
          />
        )}
        {isLevelModalOpen && schoolId && (
          <CreateLevelModal
            onClose={() => setIsLevelModalOpen(false)}
            onSave={handleSaveLevel}
            schoolId={schoolId}
          />
        )}

        {LevelToDelete &&(
          <DeleteClassLevelModal
            levelName={LevelToDelete.name}
            onClose={() => setLevelToDelete(null)}
            onDelete={handleDeleteLevel}
          />
        )}

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

        {/* Class Table */}
        <div className="w-full md:1/2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <button onClick={handleAddClass} className="px-4 py-2 w-full bg-teal text-white rounded-md hover:bg-teal-600">
              Add New Class
            </button>
            <select
              value={selectedClassLevelId}
              onChange={(e) => setSelectedClassLevelId(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal w-full"
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
            actions={Class_actions}
            data={filteredClasses}
            defaultItemsPerPage={5}
            loading={loadingClasses}
            onLoadingChange={setLoadingClasses}
            onSelectionChange={setSelectedClasses}
          />
        </div>

        {/* Level Table */}
        <div className="w-full md:1/2">
          <button
            onClick={() => setIsLevelModalOpen(true)}
            className="px-4 mb-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 md:w-fit w-full"
          >
            Add New Level
          </button>
          <DataTableFix
            columns={classLevelColumns}
            actions={Level_actions}
            data={classLevel}
            defaultItemsPerPage={5}
            loading={loadingLevels}
            onLoadingChange={setLoadingLevels}
            onSelectionChange={setSelectedLevels}
          />
        </div>
      </div>
    </SuperLayout>
  );
}

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><CircularLoader size={32} color="teal" /></div>}>
      <ManageClassesPage />
    </Suspense>
  );
}
