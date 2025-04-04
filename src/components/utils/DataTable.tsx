"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Eye, Pen, Trash2 } from "lucide-react";
import CircularLoader from "../widgets/CircularLoader";

// Interface générique pour les colonnes
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

// Interface pour les actions
interface Action<T> {
  label: string;
  onClick: (row: T) => void;
}

// Props du composant DataTable
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  hasSearch?: boolean;
  defaultItemsPerPage?: number;
  onSelectionChange?: (selectedRows: T[]) => void;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  actions = [],
  hasSearch = true,
  defaultItemsPerPage = 5,
  onSelectionChange,
}: DataTableProps<T>) => {
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  // État pour le nombre d'éléments par page
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(defaultItemsPerPage);
  // État pour les lignes sélectionnées
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Options pour le sélecteur (5, 10, 15, 20, All)
  const itemsPerPageOptions = [5, 10, 15, 20, "All"];

  // Filtrer les données en fonction du terme de recherche
  const filteredData = data.filter((row) =>
    columns.some((column) => {
      const value =
        typeof column.accessor === "function"
          ? column.accessor(row)
          : row[column.accessor];
      return value
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
  );

  // Calculer les données à afficher pour la page actuelle
  const totalItems = filteredData.length;
  const effectiveItemsPerPage = itemsPerPage === "All" ? totalItems : itemsPerPage;
  const totalPages = Math.ceil(totalItems / effectiveItemsPerPage);
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const endIndex = startIndex + effectiveItemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Gérer la sélection/désélection d'une ligne
  const handleRowSelection = (row: T) => {
    setSelectedRows((prev) => {
      if (prev.includes(row)) {
        const newSelection = prev.filter((r) => r !== row);
        onSelectionChange?.(newSelection);
        return newSelection;
      } else {
        const newSelection = [...prev, row];
        onSelectionChange?.(newSelection);
        return newSelection;
      }
    });
  };

  // Gérer la sélection/désélection de toutes les lignes
  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      setSelectedRows(filteredData);
      onSelectionChange?.(filteredData);
    }
  };

  // Vérifier si toutes les lignes sont sélectionnées
  const isAllSelected = selectedRows.length === filteredData.length && filteredData.length > 0;

  // Fonctions pour la pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Gérer le changement du nombre d'éléments par page
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setItemsPerPage(value === "All" ? "All" : Number(value));
    setCurrentPage(1); // Réinitialiser à la première page lors du changement
  };

  // Gérer la recherche
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
      setIsLoading(true); // Afficher le loader pendant la recherche
      setTimeout(() => {
        setIsLoading(false); // Masquer le loader après la recherche
      }, 1000);
    }
  };

  // Supprimer le filtre de recherche
  const clearSearchFilter = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Supprimer tous les filtres
  const clearAllFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Générer le texte et les IDs pour le bouton de suppression
  const getDeleteButtonProps = () => {
    if (selectedRows.length === 0) {
      return { text: "", ids: "" };
    }
    const ids = selectedRows.map((row) => row.id).join(",");
    if (selectedRows.length === filteredData.length) {
      return { text: "Supprimer tout", ids };
    }
    if (selectedRows.length === 1) {
      return { text: "Supprimer", ids };
    }
    return { text: `Supprimer (${selectedRows.length})`, ids };
  };

  const { text: deleteButtonText, ids: deleteButtonIds } = getDeleteButtonProps();

  // Fonction pour mapper les actions aux icônes
  const getActionIcon = (action: Action<T>, row: T) => {
    switch (action.label.toLowerCase()) {
      case "view":
        return (
          <button
            onClick={() => action.onClick(row)}
            className="text-gray-500 hover:text-teal"
            title="View Details"
          >
            <Eye size={20} />
          </button>
        );
      case "edit":
        return (
          <button
            onClick={() => action.onClick(row)}
            className="text-gray-500 hover:text-blue-500"
            title="Edit"
          >
            <Pen size={20} />
          </button>
        );
      case "delete":
        return (
          <button
            onClick={() => action.onClick(row)}
            className="text-gray-500 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Bouton de suppression (affiché uniquement si des lignes sont sélectionnées) */}
      {selectedRows.length > 0 && (
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            data-remove-items-id={deleteButtonIds}
          >
            {deleteButtonText}
          </button>
        </div>
      )}

      <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        {/* Zone de recherche */}
        {hasSearch && (
          <div className="p-4">
            <div className="relative w-full max-w-md">
              {isLoading && (
                <div className="absolute left-1 top-1/2 transform -translate-y-1/2">
                  <CircularLoader size={8} color="teal" />
                </div>
              )}
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setIsLoading(true);
                  setSearchTerm(e.target.value);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 1000);
                }}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal"
              />
              {searchTerm && (
                <button
                  onClick={clearSearchFilter}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtres actifs */}
        {searchTerm && (
          <div className="flex items-center justify-between text-teal border border-gray-200 dark:border-gray-700 py-1 px-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              <div className="flex items-center border border-teal space-x-1 bg-teal-200 px-2 py-1 rounded-md">
                <span className="text-sm text-teal">Search: {searchTerm}</span>
                <button onClick={clearSearchFilter} className="text-teal">
                  <X size={14} />
                </button>
              </div>
            </div>
            <button onClick={clearAllFilters} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Conteneur principal */}
        <div className="w-full flex flex-col">
          {/* Tableau avec défilement */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="lg:w-full w-max table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-foreground p-3">
                  {/* Case à cocher pour tout sélectionner */}
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-teal border-gray-300 rounded"
                    />
                  </th>
                  {columns.map((column, index) => (
                    <th key={index} className="px-4 py-3 w-max">
                      {column.header}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-4 py-3 text-right w-32">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (actions.length > 0 ? 1 : 0) + 1}
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`border-t border-gray-200 transition-colors duration-200 w-max ${
                        selectedRows.includes(row)
                          ? "bg-gray-50 dark:bg-gray-700 border-l-4 border-l-teal"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {/* Case à cocher pour chaque ligne */}
                      <td className="px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={() => handleRowSelection(row)}
                          className="h-4 w-4 text-teal border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 text-sm text-foreground">
                          {typeof column.accessor === "function"
                            ? column.accessor(row)
                            : row[column.accessor] as React.ReactNode}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="px-4 py-3 text-right w-32">
                          <div className="flex justify-end space-x-2">
                            {actions.map((action, actionIndex) => (
                              <React.Fragment key={actionIndex}>
                                {getActionIcon(action, row)}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:text-foreground">
              {/* Informations de pagination (Page X of Y) */}
              <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>

              {/* Sélecteur pour le nombre d'éléments par page */}
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                  Items per page
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="hidden sm:block px-2 py-1 border border-gray-300 w-[80px] rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons de navigation */}
              <div className="flex max-sm:justify-between max-sm:w-full space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${
                    currentPage === 1 ? "cursor-not-allowed" : "max-sm:border max-sm:border-teal max-sm:rounded-lg"
                  }`}
                >
                  <ChevronLeft size={20} className="hidden sm:block" />
                  <span className="sm:hidden">Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 w-[40px] h-[40px] py-1 rounded-full text-sm hidden sm:block ${
                      currentPage === page
                        ? "focus:outline-none ring-2 ring-teal text-teal"
                        : "text-foreground hover:ring-2 hover:ring-teal hover:text-teal"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${
                    currentPage === totalPages ? "cursor-not-allowed" : "max-sm:border max-sm:border-teal max-sm:rounded-lg"
                  }`}
                >
                  <ChevronRight size={20} className="hidden sm:block" />
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;