"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

// Interface pour les données d'un parent
interface Parent {
  id: string;
  name: string;
}

// Interface pour les données d'un enfant
interface Child {
  id: string;
  name: string;
  parentId: string;
  schoolInfo?: string; // Informations supplémentaires sur l'école (comme dans l'image)
}

// Interface pour les données de la souscription
interface SubscriptionSchema {
  id: string;
  parentId: string;
  childIds: string[];
  expirationDate: string; // Date d'expiration de la souscription
}

// Props du composant
interface UpdateSubscriptionProps {
  onClose: () => void;
  onSave: (subscriptionData: SubscriptionSchema) => void;
  subscription: SubscriptionSchema; // Données de la souscription à modifier
  parent: Parent; // Parent associé à la souscription (non modifiable)
  children: Child[]; // Liste des enfants du parent
  pricePerStudent?: number; // Prix par étudiant (optionnel, par défaut 19900)
}

const UpdateSubscriptionModal: React.FC<UpdateSubscriptionProps> = ({
  onClose,
  onSave,
  subscription,
  parent,
  children,
  pricePerStudent = 19900, // Prix par défaut
}) => {
  const [formData, setFormData] = useState<SubscriptionSchema>({
    id: subscription.id,
    parentId: subscription.parentId,
    childIds: subscription.childIds,
    expirationDate: subscription.expirationDate,
  });

  const [childSearch, setChildSearch] = useState<string>("");
  const [filteredChildren, setFilteredChildren] = useState<Child[]>(children);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  // Filtrer les enfants en fonction de la recherche
  useEffect(() => {
    setFilteredChildren(
      children.filter((child) =>
        child.name.toLowerCase().includes(childSearch.toLowerCase())
      )
    );
  }, [childSearch, children]);

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
    if (formData.childIds.length === 0) {
      alert("Please select at least one child.");
      return;
    }
    onSave(formData);
    onClose();
  };

  // Calculer le coût total
  const totalCost = formData.childIds.length * pricePerStudent;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Renew Subscription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Parent Name (non modifiable) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Name
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 bg-gray-100 dark:bg-gray-600">
              <span>{parent.name}</span>
            </div>
          </div>

          {/* Child Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Child Name(s)
            </label>
            <div className="relative">
              <div
                onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal cursor-pointer flex justify-between items-center"
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
              {isChildDropdownOpen && (
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
                          <div className="flex flex-col">
                            <span>{child.name}</span>
                            {child.schoolInfo && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {child.schoolInfo}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                        No children available.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expiration Date */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Current subscription expires on: {subscription.expirationDate}
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
            >
              Renew
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscriptionModal;