"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import CircularLoader from "../widgets/CircularLoader";

// Interface pour les données de performance
interface PerformanceData {
    id: string;
    schoolName: string;
    metrics: {
        [key: string]: number; // Par exemple, "numberOfActiveSubscriptions": 156
    };
}

// Props du composant PerformanceTable
interface PerformanceTableProps {
    data: PerformanceData[];
    defaultItemsPerPage?: number;
    metricOptions: string[]; // Liste des métriques disponibles (ex: ["Number of Active Subscriptions", "Average Grade"])
}

const PerformanceTable = ({
    data,
    defaultItemsPerPage = 5,
    metricOptions,
}: PerformanceTableProps) => {
    const [isLoading, setIsLoading] = useState(false); // État pour le chargement
    // État pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    // État pour le nombre d'éléments par page
    const [itemsPerPage, setItemsPerPage] = useState<number | "All">(defaultItemsPerPage);
    // État pour le terme de recherche
    const [searchTerm, setSearchTerm] = useState<string>("");
    // État pour la métrique sélectionnée
    const [selectedMetric, setSelectedMetric] = useState<string>(metricOptions[0] || "");

    // Options pour le sélecteur (5, 10, 15, 20, All)
    const itemsPerPageOptions = [5, 10, 15, 20, "All"];

    // Trier les données par la métrique sélectionnée (décroissant)
    const sortedData = [...data].sort((a, b) => {
        const metricA = a.metrics[selectedMetric] || 0;
        const metricB = b.metrics[selectedMetric] || 0;
        return metricB - metricA;
    });

    // Filtrer les données en fonction du terme de recherche
    const filteredData = sortedData.filter((row) =>
        row.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculer les données à afficher pour la page actuelle
    const totalItems = filteredData.length;
    const effectiveItemsPerPage = itemsPerPage === "All" ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / effectiveItemsPerPage);
    const startIndex = (currentPage - 1) * effectiveItemsPerPage;
    const endIndex = startIndex + effectiveItemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

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
            setCurrentPage(1);
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

    // Gérer le changement de métrique
    const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMetric(event.target.value);
        setCurrentPage(1); // Réinitialiser à la première page lors du changement
    };

    return (
        <div className="w-full">
            {/* Zone de recherche et sélecteur de métrique */}
            <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700  shadow-sm flex flex-col">
                <div className="p-4 flex items-center justify-between">
                    <div className="relative w-full max-w-xs">
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
                            className="w-full  px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal"
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
                    <div className="flex flex-col  text-right space-x-2 w-full max-w-xs">
                        <label htmlFor="metricSelect" className="text-sm text-gray-600 dark:text-gray-400">
                            Select Performance Metric
                        </label>
                        <select
                            id="metricSelect"
                            value={selectedMetric}
                            onChange={handleMetricChange}
                            className="px-2 py-1 border w-full border-gray-300 rounded-md text-sm text-gray-600 dark:text-foreground dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal"
                        >
                            {metricOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtres actifs */}
                {searchTerm && (
                    <div className="flex items-center justify-between text-teal border border-gray-200 dark:border-gray-700 py-1 px-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                            <div className="flex items-center border border-teal space-x-1 bg-teal-200 px-2 py-1 rounded-md">
                                <span className="text-sm text-teal">
                                    Search: {searchTerm}
                                </span>
                                <button onClick={clearSearchFilter} className="text-teal">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Conteneur principal */}
                <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    {/* Tableau avec défilement */}
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="sm:w-full w-max table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-foreground p-3">
                                    <th className="px-4 py-3 w-12">Rank</th>
                                    <th className="px-4 py-3 w-max">School Name</th>
                                    <th className="px-4 py-3 w-max">Performance Metric</th>
                                    <th className="px-4 py-3 w-max">Metric Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-3 text-center text-gray-500"
                                        >
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <td className="px-4 py-3 w-12">{startIndex + index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-foreground">{row.schoolName}</td>
                                            <td className="px-4 py-3 text-sm text-foreground">{selectedMetric}</td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {row.metrics[selectedMetric] || "N/A"}
                                            </td>
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
                                    className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${currentPage === 1 ? "cursor-not-allowed" : "max-sm:border max-sm:border-teal max-sm:rounded-lg"
                                        }`}
                                >
                                    <ChevronLeft size={20} className="hidden sm:block" />
                                    <span className="sm:hidden">Previous</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 w-[40px] h-[40px] py-1 rounded-full text-sm hidden sm:block ${currentPage === page
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
                                    className={`p-2 text-foreground hover:text-teal disabled:text-gray-500 ${currentPage === totalPages ? "cursor-not-allowed" : "max-sm:border max-sm:border-teal max-sm:rounded-lg"
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

export default PerformanceTable;