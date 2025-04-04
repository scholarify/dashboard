"use client";

import { School } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { Suspense, useState } from "react";
import DataTable from "@/components/utils/DataTable";
import { useRouter } from "next/navigation";
import CreateSchoolModal from "./components/CreateSchoolModal";
import DeleteSchoolModal from "./components/DeleteSchoolModal";
import CircularLoader from "@/components/widgets/CircularLoader";

const BASE_URL = "/super-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/schools`,
  title: "Schools",
};

// Interface pour les données des écoles
interface School {
  id: string;
  name: string;
  email: string;
  principal: string;
  creationDate: string;
  address?: string;
  website?: string;
  phoneNumber?: string;
  description?: string;
}

// Données d'exemple
const initialSchools: School[] = [
  {
    id: "SCH001",
    name: "Acme High",
    email: "contact@loremipsum.com",
    principal: "Michael Jackson",
    creationDate: "03/12/1989",
    address: "123 Lorem Ipsum, Birmingham",
    website: "www.loremipsum.com",
    phoneNumber: "+44 550 123 4567",
    description:
      "We live, our hearts colder. Cause pain is what we go through as we become older. We get insulted by others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a hand.",
  },
  {
    id: "SCH002",
    name: "Sabadan High",
    email: "contact@loremipsum.com",
    principal: "Michael Jackson",
    creationDate: "03/12/1989",
    address: "456 Oak St",
    website: "www.sabadan.com",
    phoneNumber: "+44 550 987 6543",
    description: "A great school with a rich history.",
  },
  { id: "SCH003", name: "Valley View Academy", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH004", name: "Hilltop College Prep", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH005", name: "Tom Tom Academy", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH006", name: "Sability High College", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH007", name: "IminLove Sketch School", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH008", name: "IminLove Sketch School", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH009", name: "IminLove Sketch School", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH010", name: "IminLove Sketch School", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH011", name: "IminLove Sketch School", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
];

function SchoolContent() {
  const router = useRouter();
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // État pour le modal de suppression
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null); // École à supprimer

  // Colonnes du tableau
  const columns = [
    { header: "School ID", accessor: "id" as keyof School },
    { header: "School Name", accessor: "name" as keyof School },
    { header: "Email", accessor: "email" as keyof School },
    { header: "Principal", accessor: "principal" as keyof School },
    { header: "Creation Date", accessor: "creationDate" as keyof School },
  ];

  // Gérer la suppression d'une école
  const handleDelete = (password: string) => {
    // Simuler une vérification de mot de passe (dans un vrai projet, fais une requête API)
    if (password !== "admin123") {
      alert("Incorrect password. Please try again.");
      return;
    }

    if (schoolToDelete) {
      setSchools(schools.filter((s) => s.id !== schoolToDelete.id));
      setSchoolToDelete(null);
    }
  };

  // Actions
  const actions = [
    {
      label: "View",
      onClick: (school: School) => {
        router.push(`${BASE_URL}/schools/view?id=${school.id}`);
      },
    },
    {
      label: "Delete",
      onClick: (school: School) => {
        setSchoolToDelete(school); // Stocker l'école à supprimer
        setIsDeleteModalOpen(true); // Ouvrir le modal de suppression
      },
    },
  ];

  // Gérer la suppression multiple
  const handleDeleteSelected = () => {
    if (selectedSchools.length === 0) {
      alert("Please select at least one school to delete.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedSchools.length} school(s)?`)) {
      setSchools(schools.filter((school) => !selectedSchools.includes(school)));
      setSelectedSchools([]); // Réinitialiser la sélection après suppression
    }
  };

  // Gérer l'ajout d'une nouvelle école
  const handleSave = (schoolData: any) => {
    const newSchool: School = {
      id: `SCH${schools.length + 1}`,
      name: schoolData.schoolName,
      email: schoolData.email,
      principal: schoolData.principalName,
      creationDate: new Date().toLocaleDateString("en-GB"),
      address: schoolData.address,
      website: schoolData.website,
      phoneNumber: schoolData.phoneNumber,
      description: schoolData.description,
    };
    setSchools([...schools, newSchool]);
    console.log("New school data:", schoolData);
  };

  return (
    <div className="md:p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
      >
        Add New School
      </button>

      <DataTable
        columns={columns}
        data={schools}
        actions={actions}
        defaultItemsPerPage={5}
        onSelectionChange={setSelectedSchools}
      />

      {/* Modal pour ajouter une école */}
      {isModalOpen && (
        <CreateSchoolModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal pour supprimer une école */}
      {isDeleteModalOpen && schoolToDelete && (
        <DeleteSchoolModal
          schoolName={schoolToDelete.name}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSchoolToDelete(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div>
        <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
          <CircularLoader size={32} color="teal" />
        </div>
      </div>
    }>
      <SuperLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => console.log("Logged out")}
      >
        <SchoolContent />
      </SuperLayout>
    </Suspense>
  )
}