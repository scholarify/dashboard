"use client";

import { School, } from "lucide-react";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import { useState } from "react";
import DataTable from "@/components/utils/DataTable";

const BASE_URL = "/super-admin";

const navigation = {
  icon: School,
  baseHref: `${BASE_URL}/school`,
  title: "Schools"
};



// Interface pour les données des écoles
interface School {
  id: string;
  name: string;
  email: string;
  principal: string;
  creationDate: string;
}

// Données d'exemple
const initialSchools: School[] = [
  { id: "SCH001", name: "Acme High", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
  { id: "SCH002", name: "Sabadan High", email: "contact@loremipsum.com", principal: "Michael Jackson", creationDate: "03/12/1989" },
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

export default function Page() {
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);

  // Colonnes du tableau
  const columns = [
    { header: "School ID", accessor: "id" as keyof School },
    { header: "School Name", accessor: "name" as keyof School },
    { header: "Email", accessor: "email" as keyof School },
    { header: "Principal", accessor: "principal" as keyof School },
    { header: "Creation Date", accessor: "creationDate" as keyof School },
  ];

  // Actions
  const actions = [
    {
      label: "View Details",
      onClick: (school: School) => {
        alert(`Viewing details for ${school.name}`);
      },
    },
    {
      label: "Delete School",
      onClick: (school: School) => {
        if (confirm(`Are you sure you want to delete ${school.name}?`)) {
          setSchools(schools.filter((s) => s.id !== school.id));
        }
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

  return (
    <SuperLayout
      navigation={navigation}
      showGoPro={true}
      onLogout={() => console.log("Logged out")}
    >
      <div className="p-6">
        <DataTable
          columns={columns}
          data={schools}
          actions={actions}
          defaultItemsPerPage={5} // Correspond à l'image (5 éléments par page)
          onSelectionChange={setSelectedSchools} // Passer la sélection au parent
        />
      </div>
    </SuperLayout>
  );
}
