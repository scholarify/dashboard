"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

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
  itemsPerPage?: number;
  onSelectionChange?: (selectedRows: T[]) => void;
}

const DataTable = <T,>({
  columns,
  data,
  actions = [],
  itemsPerPage = 5,
  onSelectionChange,
}: DataTableProps<T>) => {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  // État pour les lignes sélectionnées
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Calculer les données à afficher pour la page actuelle
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      setSelectedRows(data);
      onSelectionChange?.(data);
    }
  };

  // Vérifier si toutes les lignes sont sélectionnées
  const isAllSelected = selectedRows.length === data.length && data.length > 0;

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

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      {/* Tableau */}
      <table className="w-full table-auto border-collapse">
        {/* En-tête */}
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-foreground p-3">
            {/* Case à cocher pour tout sélectionner */}
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="h-4 w-4 text-teal border-gray-300 rounded"
              />
            </th>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3">
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>
        {/* Corps */}
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
                className={`border-t border-gray-200 transition-colors duration-200 ${
                  selectedRows.includes(row)
                    ? "bg-blue-100 dark:bg-blue-900" // Fond pour les lignes sélectionnées
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {/* Case à cocher pour chaque ligne */}
                <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button className="text-foreground hover:text-teal">
                        <MoreVertical size={20} />
                      </button>
                      {/* Menu déroulant pour les actions */}
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                        <div className="py-1">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:text-foreground">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 w-[40px] h-[40px] py-1 rounded-full text-sm ${
                    currentPage === page
                      ? "focus:outline-none ring-2 ring-teal text-teal"
                      : "text-foreground hover:ring-2 hover:ring-teal hover:text-teal"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;