"use client";

import React from "react";
import { FeeSchema } from "@/app/models/FeesModel";
import { SchoolResourceSchema } from "@/app/models/SchoolResources";
import ApplicableFeesSection from "./ApplicationFees";
import ResourceSearchLibrary from "./ResourceSearchLibrary";
import { motion } from "framer-motion";

interface FeesAndResourcesSectionProps {
    formData: {
        scholarshipPercentage: string | number | readonly string[] | undefined;
        scholarshipAmount: string | number | readonly string[] | undefined;
        applyScholarship: boolean | undefined;
        selectedFees: string[];
        selectedResources: string[];
        paymentMode: "full" | "installment";
        installments: number;
        installmentDates: string[];
    };
    handleChange: (e: React.ChangeEvent<any>) => void;
    feeList: FeeSchema[];
    feeLoading: boolean;
    resourceList: SchoolResourceSchema[];
    resourceLoading: boolean;
    applyScholarship: boolean;
    scholarshipAmount: number;
    
}

const FeesAndResourcesSection: React.FC<FeesAndResourcesSectionProps> = ({
    formData,
    handleChange,
    feeList,
    feeLoading,
    resourceList,
    resourceLoading,
}) => {
    const selectedFeesDetails = feeList.filter((fee) =>
        formData.selectedFees.includes(fee._id)
    );
    const selectedResourceDetails = resourceList.filter((res) =>
        formData.selectedResources.includes(res._id)
    );

    const rawTotalAmount =
        selectedFeesDetails.reduce((sum, f) => sum + f.amount, 0) +
        selectedResourceDetails.reduce((sum, r) => sum + r.price, 0);

    const scholarshipDiscount = formData.applyScholarship
        ? ((Number(formData.scholarshipPercentage) || 0) / 100) * rawTotalAmount
        : 0;

    const totalSelectedAmount = rawTotalAmount - scholarshipDiscount;


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ApplicableFeesSection
                    feeList={feeList}
                    feeLoading={feeLoading}
                    handleChange={handleChange}
                    formData={formData}
                />

                <ResourceSearchLibrary
                    resourceList={resourceList}
                    resourceLoading={resourceLoading}
                    handleChange={handleChange}
                    formData={formData}
                />
            </div>

            {/* Payment Option */}
            <div className="mt-4">
                <label className="font-medium text-sm block mb-2">Payment Option</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="paymentMode"
                            value="full"
                            checked={formData.paymentMode === "full"}
                            onChange={handleChange}
                            className="text-teal"
                        />
                        Full Payment
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="paymentMode"
                            value="installment"
                            checked={formData.paymentMode === "installment"}
                            onChange={handleChange}
                            className="text-teal"
                        />
                        Pay in Installments
                    </label>
                </div>
            </div>
            {/* Scholarship Section */}
            <div className="mt-6 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="applyScholarship"
                        checked={formData.applyScholarship}
                        onChange={handleChange}
                        className="text-teal-500"
                    />
                    Apply Scholarship
                </label>

                {formData.applyScholarship && (
                    <div className="mt-4">
                        <label className="font-medium text-sm block mb-2">
                            Scholarship (%) <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                            type="number"
                            name="scholarshipPercentage"
                            min="0"
                            max="100"
                            value={formData.scholarshipPercentage}
                            onChange={handleChange}
                            placeholder="Enter percentage (e.g., 20)"
                            className="w-full md:w-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                )}
                {formData.applyScholarship && (
                    <div className="mt-2 text-sm text-teal-700 font-medium">
                        Scholarship Applied: {scholarshipDiscount.toLocaleString()} XAF ({formData.scholarshipPercentage}%)
                    </div>
                )}


            </div>

            {/* Total Summary */}
            <div className="mt-6 p-4 bg-foreground dark:bg-teal-900 text-background dark:text-teal-200 font-semibold text-lg rounded-md shadow-sm border border-teal-300 dark:border-teal-700">
                Total: {totalSelectedAmount.toLocaleString()} XAF
            </div>

            {formData.paymentMode === "installment" && (
                <>
                    {/* Number of Installments */}
                    <div className="mt-4">
                        <label className="font-medium text-sm block mb-2">Number of Installments</label>
                        <select
                            name="installments"
                            value={formData.installments}
                            onChange={handleChange}
                            className="w-full md:w-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {[1, 2, 3, 4, 5].map((count) => (
                                <option key={count} value={count}>
                                    {count} {count === 1 ? "Installment" : "Installments"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Installment Dates */}
                    <div className="mt-4 space-y-4">
                        <strong className="block text-sm font-medium">Choose Due Dates:</strong>
                        {Array.from({ length: formData.installments }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <label className="text-sm font-medium">Installment {i + 1}</label>
                                <input
                                    type="date"
                                    name={`installmentDates-${i}`}
                                    value={formData.installmentDates[i] || ""}
                                    onChange={(e) => {
                                        const updatedDates = [...formData.installmentDates];
                                        updatedDates[i] = e.target.value;
                                        handleChange({
                                            target: {
                                                name: "installmentDates",
                                                value: updatedDates,
                                            },
                                        } as any);
                                    }}
                                    className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm bg-background"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Amount Breakdown */}
                    <div className="mt-4 text-sm text-gray-700 text-foreground space-y-2 bg-gray-200 p-2 rounded-md">
                        <strong>Installment Amounts:</strong>
                        {Array.from({ length: formData.installments }).map((_, i) => {
                            const amount = totalSelectedAmount / formData.installments;
                            return (
                                <div key={i} className="flex justify-between text-teal ">
                                    <span>Installment {i + 1}</span>
                                    <span className="font-bold">{amount.toLocaleString()} XAF</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* First Installment to Be Paid Now */}
                    <div className="mt-6 p-4 bg-foreground dark:bg-teal-900 text-background dark:text-teal-200 font-semibold text-lg rounded-md shadow-sm border border-teal-300 dark:border-teal-700">
                        <strong>First Installment to be Paid Now : </strong>
                        {(
                            totalSelectedAmount / formData.installments
                        ).toLocaleString()} XAF
                    </div>

                </>
            )}
        </div>
    );
};

export default FeesAndResourcesSection;
