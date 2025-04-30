"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { getUsers } from "@/app/services/UserServices";
import { getStudents } from "@/app/services/StudentServices";
import { UserSchema } from "@/app/models/UserModel";
import { StudentSchema } from "@/app/models/StudentModel";

// Interface pour les données d'un parent
interface Parent {
  id: string;
  name: string;
  email?: string;
}

// Interface pour les données d'un enfant
interface Child {
  id: string;
  name: string;
  parentId: string; // Ajout du parentId pour associer chaque enfant à un parent
  schoolInfo?: string;
}

// Interface pour les données de la souscription
interface SubscriptionCreateSchema {
  parentId: string;
  childIds: string[];
}

// Props du composant
interface CreateSubscriptionProps {
  onClose: () => void;
  onSave: (subscriptionData: SubscriptionCreateSchema) => void;
  pricePerStudent?: number; // Prix par étudiant (optionnel, par défaut 19900)
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionProps> = ({
  onClose,
  onSave,
  pricePerStudent = 19900, // Prix par défaut
}) => {
  const [formData, setFormData] = useState<SubscriptionCreateSchema>({
    parentId: "",
    childIds: [],
  });

  const [parentSearch, setParentSearch] = useState<string>("");
  const [childSearch, setChildSearch] = useState<string>("");
  const [parents, setParents] = useState<Parent[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch parents and children from the database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users with role "parent"
        const users = await getUsers();
        interface ParentUser {
          id: string;
          name: string;
          email?: string;
        }

        const parentUsers: ParentUser[] = users
          .filter((user: UserSchema) => user.role === "parent")
          .map((user: UserSchema) => ({
            id: user._id,
            name: user.name,
            email: user.email,
          }));
        setParents(parentUsers);

        // Fetch all students
        const studentsData = await getStudents();
        const formattedChildren = studentsData.map(student => ({
          id: student._id,
          name: student.name,
          parentId: student.guardian_id[0], // Using the first guardian as parent
          schoolInfo: `School ID: ${student.school_id}, Class ID: ${student.class_id}`
        }));
        setChildren(formattedChildren);

        // Initialize filtered parents
        setFilteredParents(parentUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  // Filtrer les parents en fonction de la recherche
  useEffect(() => {
    setFilteredParents(
      parents.filter((parent) =>
        parent.name.toLowerCase().includes(parentSearch.toLowerCase())
      )
    );
  }, [parentSearch, parents]);

  // Filtrer les enfants en fonction du parent sélectionné et de la recherche
  useEffect(() => {
    if (!formData.parentId) {
      setFilteredChildren([]); // Aucun parent sélectionné, pas d'enfants à afficher
      setFormData((prev) => ({ ...prev, childIds: [] })); // Réinitialiser les enfants sélectionnés
      return;
    }

    // Filtrer les enfants par parentId et par terme de recherche
    const childrenOfSelectedParent = children.filter(
      (child) => child.parentId === formData.parentId
    );
    setFilteredChildren(
      childrenOfSelectedParent.filter((child) =>
        child.name.toLowerCase().includes(childSearch.toLowerCase())
      )
    );
  }, [childSearch, formData.parentId, children]);

  // Gérer la sélection du parent
  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      parentId: e.target.value,
      childIds: [], // Réinitialiser les enfants sélectionnés lors du changement de parent
    }));
    setChildSearch(""); // Réinitialiser la recherche des enfants
    setIsParentDropdownOpen(false); // Ferme le dropdown après sélection
    setParentSearch(""); // Réinitialise la recherche des parents
  };

  // Gérer la sélection/désélection des enfants
  const handleChildChange = (childId: string) => {
    setFormData((prev) => {
      const childIds = prev.childIds.includes(childId)
        ? prev.childIds.filter((id) => id !== childId) // Désélectionner si déjà sélectionné
        : [...prev.childIds, childId]; // Ajouter si non sélectionné
      return { ...prev, childIds };
    });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentId || formData.childIds.length === 0) {
      alert("Please select a parent and at least one child.");
      return;
    }
    onSave(formData);
    onClose();
  };

  // Calculer le coût total
  const totalCost = formData.childIds.length * pricePerStudent;

  // Obtenir le nom du parent sélectionné pour l'affichage
  const selectedParentName =
    parents.find((parent) => parent.id === formData.parentId)?.name ||
    "Select a parent";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Create New Subscription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Parent Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent Name
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal cursor-pointer flex justify-between items-center"
                >
                  <span>{selectedParentName}</span>
                  <span>▼</span>
                </div>
                {isParentDropdownOpen && (
                  <div className="absolute p-2 z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="w-full flex px-2 items-center border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 focus:outline-none">
                      <Search />
                      <input
                        type="text"
                        placeholder="Search for parent"
                        value={parentSearch}
                        onChange={(e) => setParentSearch(e.target.value)}
                        className="w-full px-3 py-2 border-none text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 focus:outline-none"
                      />
                    </div>
                    <select
                      value={formData.parentId}
                      onChange={handleParentChange}
                      className="w-full text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 focus:outline-none"
                      size={filteredParents.length + 1}
                    >
                      <option value="" disabled className="hidden">
                        Select a parent
                      </option>
                      {filteredParents.map((parent) => (
                        <option key={parent.id} value={parent.id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                          {parent.name} {parent.email ? `(${parent.email})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Child Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Child Name(s)
              </label>
              <div className="relative">
                <div
                  onClick={() => formData.parentId && setIsChildDropdownOpen(!isChildDropdownOpen)} // Désactiver le clic si aucun parent n'est sélectionné
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal flex justify-between items-center ${
                    formData.parentId ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <span>
                    {formData.childIds.length > 0
                      ? formData.childIds
                          .map((id) => children.find((child) => child.id === id)?.name)
                          .join(", ") || "Select children"
                      : "Select children"}
                  </span>
                  <span>▼</span>
                </div>
                {isChildDropdownOpen && formData.parentId && (
                  <div className="absolute p-2 z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="w-full flex px-2 items-center border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 focus:outline-none">
                      <Search />
                      <input
                        type="text"
                        placeholder="Search for child"
                        value={childSearch}
                        onChange={(e) => setChildSearch(e.target.value)}
                        className="w-full px-3 py-2 border-none text-gray-600 dark:text-foreground dark:bg-gray-700 focus:outline-none"
                      />
                    </div>
                    <div className="w-full text-sm text-gray-600 dark:text-foreground dark:bg-gray-700">
                      {filteredChildren.length > 0 ? (
                        filteredChildren.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <input
                              type="checkbox"
                              checked={formData.childIds.includes(child.id)}
                              onChange={() => handleChildChange(child.id)}
                              className="h-4 w-4 text-teal border-gray-300 rounded cursor-pointer mr-2"
                            />
                            <span>{child.name}</span>
                            {child.schoolInfo && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {child.schoolInfo}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          No children available for this parent.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Details */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yearly Subscription
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected Students: {formData.childIds.length} × ${pricePerStudent.toLocaleString()} = ${totalCost.toLocaleString()}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600"
                disabled={formData.childIds.length === 0 || !formData.parentId}
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;