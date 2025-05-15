"use client";

import React from "react";
import { FeeSchema } from "@/app/models/FeesModel";
import { SchoolResourceSchema } from "@/app/models/SchoolResources";

interface RegistrationSummaryProps {
    formData: any;
    feeList: FeeSchema[];
    resourceList: SchoolResourceSchema[];
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({
    formData,
    feeList,
    resourceList,
}) => {
    const selectedFeesDetails = feeList.filter((fee) =>
        formData.selectedFees.includes(fee._id)
    );
    const selectedResourceDetails = resourceList.filter((res) =>
        formData.selectedResources.includes(res._id)
    );

    const totalAmount =
        selectedFeesDetails.reduce((sum, f) => sum + f.amount, 0) +
        selectedResourceDetails.reduce((sum, r) => sum + r.price, 0);

    const scholarshipPercentage = Number(formData.scholarshipPercentage) || 0;
    const applyScholarship = formData.applyScholarship;

    const scholarshipDiscount = applyScholarship
        ? (scholarshipPercentage / 100) * totalAmount
        : 0;

    const finalAmount = totalAmount - scholarshipDiscount;

    return (
        <div className="space-y-6 text-sm text-gray-800 dark:text-gray-200">
            <h3 className="text-lg font-semibold">Review Submission Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium text-lg text-teal">Student Info</h4>
                    <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                    <p><strong>DOB:</strong> {formData.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {formData.gender}</p>
                    <p><strong>Nationality:</strong> {formData.nationality}</p>
                    <p><strong>Place of Birth:</strong> {formData.place_of_birth}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                </div>

                <div>
                    <h4 className="font-medium text-lg text-teal">Guardian Info</h4>
                    <p><strong>Name:</strong> {formData.guardian_name}</p>
                    <p><strong>Relationship:</strong> {formData.guardian_relationship}</p>
                    <p><strong>Phone:</strong> {formData.guardian_phone}</p>
                    <p><strong>Email:</strong> {formData.guardian_email}</p>
                    <p><strong>Occupation:</strong> {formData.guardian_occupation}</p>
                </div>

                <div>
                    <h4 className="font-medium text-lg text-teal">Emergency Contact</h4>
                    <p><strong>Name:</strong> {formData.emergency_contact_name}</p>
                    <p><strong>Phone:</strong> {formData.emergency_contact_phone}</p>
                    <p><strong>Relationship:</strong> {formData.emergency_contact_relationship}</p>
                </div>

                <div>
                    <h4 className="font-medium text-lg text-teal">Medical Info</h4>
                    <p><strong>Health Condition:</strong> {formData.health_condtion || "None reported"}</p>
                    <p><strong>Doctor:</strong> {formData.doctors_name}</p>
                    <p><strong>Doctor Phone:</strong> {formData.doctors_phone}</p>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="font-medium text-lg text-teal">Fees & Resources</h4>
                <ul className="list-disc ml-5">
                    {selectedFeesDetails.map((fee) => (
                        <li key={fee._id}>{fee.fee_type}: {fee.amount.toLocaleString()} XAF</li>
                    ))}
                    {selectedResourceDetails.map((res) => (
                        <li key={res._id}>{res.name}: {res.price.toLocaleString()} XAF</li>
                    ))}
                </ul>

                <p className="mt-2">
                    <strong>Total:</strong> {totalAmount.toLocaleString()} XAF
                </p>

                {applyScholarship && (
                    <>
                        <p>
                            <strong>Scholarship ({scholarshipPercentage}%):</strong> -{scholarshipDiscount.toLocaleString()} XAF
                        </p>
                        <p className="font-semibold">
                            Total Payable: {finalAmount.toLocaleString()} XAF
                        </p>
                    </>

                )}



                <p className="mt-2">
                    Payment Mode: <strong>{formData.paymentMode}</strong>
                </p>

                {formData.paymentMode === "installment" && (
                    <div className="mt-2">
                        <p><strong>Installments:</strong> {formData.installments}</p>
                        <p><strong>Payment Dates:</strong> {formData.installmentDates.join(', ')}</p>
                        <p className="mt-1 font-medium">Installment Breakdown:</p>
                        <ul className="list-disc ml-6">
                            {Array.from({ length: formData.installments }, (_, idx) => (
                                <li key={idx}>
                                    Installment {idx + 1}: {(finalAmount / formData.installments).toLocaleString()} XAF
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h4 className="font-medium">Consent</h4>
                <p>
                    Guardian Agreement:{" "}
                    <span className={`font-semibold ${formData.guardian_agreed_to_terms ? "text-green-600" : "text-red-600"}`}>
                        {formData.guardian_agreed_to_terms ? "Agreed" : "Not Agreed"}
                    </span>
                </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Please ensure all information is correct before submitting. You will not be able to modify it afterward.
            </p>
        </div>
    );
};

export default RegistrationSummary;
