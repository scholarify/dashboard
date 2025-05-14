'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import { GraduationCap, Presentation } from 'lucide-react';
import { getStudentsBySchool } from '@/app/services/StudentServices';
import { getSchools } from '@/app/services/SchoolServices';
import { getUsers } from '@/app/services/UserServices';
import { getClasses } from '@/app/services/ClassServices';
import { StudentCreateSchema, StudentSchema } from '@/app/models/StudentModel';
import { SchoolSchema } from '@/app/models/SchoolModel';
import { UserSchema } from '@/app/models/UserModel';
import { ClassSchema } from '@/app/models/ClassModel';
import DataTableFix from '@/components/utils/TableFix';
import { motion } from 'framer-motion';
import CreateStudentModal from '../components/CreateStudentModal';
const BASE_URL = '/super-admin';

function ManageStudentsPage(): JSX.Element {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('id');
  const router = useRouter();
  const [students, setStudents] = useState<StudentSchema[]>([]);
  const [school, setSchool] = useState<SchoolSchema | null>(null);
  const [parentsMap, setParentsMap] = useState<Record<string, string>>({});
  const [classesMap, setClassesMap] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<ClassSchema[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentSchema | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);
  
  useEffect(() => {
    if (!schoolId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsData, schoolsData, usersData, classesData] = await Promise.all([
          getStudentsBySchool(schoolId),
          getSchools(),
          getUsers(),
          getClasses(),
        ]);

        setStudents(studentsData);
        setClasses(classesData);

        const matchedSchool = schoolsData.find((s: SchoolSchema) => s._id === schoolId) || null;
        setSchool(matchedSchool);

        const parentUsers = usersData.filter((user: UserSchema) => user.role === 'parent');
        const parentMap: Record<string, string> = {};
        parentUsers.forEach((parent: { _id: string | number; name: string; }) => {
          parentMap[parent._id] = parent.name;
        });
        setParentsMap(parentMap);

        const classMap: Record<string, string> = {};
        classesData.forEach((cls: ClassSchema) => {
          classMap[cls._id] = cls.name;
        });
        setClassesMap(classMap);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId]);

  const filteredStudents = selectedClass === 'all'
    ? students
    : students.filter((student) => student.class_id === selectedClass);

  const columns = [
    { header: 'Student ID', accessor: (row: StudentSchema) => row.student_id },
    {
      header: 'Class Name',
      accessor: (row: StudentSchema) => classesMap[row.class_id] || row.class_id,
    },
    {
      header: 'Parent(s) Name',
      accessor: (row: StudentSchema) => {
        const guardianNames = row.guardian_id
          .map((id) => parentsMap[id] || id)
          .join(', ');
        return guardianNames || 'No guardian';
      },
    },
    { header: 'Student Name', accessor: (row: StudentSchema) => row.name },
  ];

  const actions = [
    {
      label: "View",
      onClick: (std: StudentSchema) => {
        router.push(`${BASE_URL}/students/manage/view?studentId=${std._id}&schoolId=${schoolId}`);
      },
    },
    {
      label: "Delete",
      onClick: (std: StudentSchema) => {
        setStudentToDelete(std);
      },
    },
  ];
  const navigation = {
    icon: GraduationCap,
    baseHref: `${BASE_URL}/students/manage/?id=${schoolId}`,
    title: school ? `Manage Students of ${school.name}` : 'Manage Students',
  };


  const handleRegister = () =>{
    router.replace(`${BASE_URL}/students/manage/register?schoolId=${schoolId}`)
  }

  return (
    <SuperLayout navigation={navigation} showGoPro={true} onLogout={() => console.log('Logged out')}>
      <div className="md:py-6 flex flex-col gap-6">
        {/* Class Filter Dropdown */}
        <div className='flex gap-3'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={handleRegister}
            className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Register A Student
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Upload CVS List
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
          >
            Print Student List
          </motion.button>
        </div>
        <div className="flex justify-end">
          <select
            className="px-3 py-2 border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal w-full"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <DataTableFix
          columns={columns}
          data={filteredStudents}
          defaultItemsPerPage={5}
          loading={loading}
          onLoadingChange={setLoading}
          showCheckbox={false}
          actions={actions}
        />
      </div>
    </SuperLayout>
  );
}

export default function Page(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <CircularLoader size={32} color="teal" />
        </div>
      }
    >
      <ManageStudentsPage />
    </Suspense>
  );
}
