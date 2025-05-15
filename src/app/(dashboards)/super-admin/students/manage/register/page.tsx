"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SuperLayout from "@/components/Dashboard/Layouts/SuperLayout";
import NotificationCard from "@/components/NotificationCard";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import CustomInput from "@/components/inputs/CustomInput";
import CustomDateInput from "@/components/inputs/CustomDateInput";
import CustomNationalitySelect from "@/components/inputs/CustomNationalitySelect";
import CustomPhoneInput from "@/components/inputs/CustomPhoneInput";
import CustomSelect from "@/components/inputs/CustomSelect";
import CustomCheckboxInput from "@/components/inputs/CustomCheckBoxInput";
import CustomTextarea from "@/components/inputs/CustomTextarea";
import { FeeSchema } from "@/app/models/FeesModel";
import { getFeesBySchoolId } from "@/app/services/FeesServices";
import { getSchoolResourcesBySchoolId } from "@/app/services/SchoolResourcesServices";
import { SchoolResourceSchema } from "@/app/models/SchoolResources";
import FeesAndResourcesSection from "@/components/utils/Fees&ResourcesSection";
import ConsentDeclaration from "@/components/utils/ConsentDeclaration";
import RegistrationSummary from "@/components/utils/RegistrationSummary";
import { getClassLevelById, getClassLevelsBySchoolId } from "@/app/services/ClassLevels";
import { ClassLevelSchema } from "@/app/models/ClassLevel";
import { createStudent } from "@/app/services/StudentServices";
import { createFeePayment } from "@/app/services/FeePaymentServices";
import { AcademicYearSchema } from "@/app/models/AcademicYear";
import { getAcademicYears } from "@/app/services/AcademicYearServices";



interface FormData {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
    place_of_birth?: string;
    address?: string;
    phone?: string;
    guardian_address?: string;
    guardian_phone?: string;
    guardian_name?: string;
    guardian_occupation?: string;
    guardian_email?: string;
    guardian_relationship?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
    previous_school?: string;
    class_id: string;
    guardian_agreed_to_terms: boolean;
    transcript_reportcard: boolean;
    health_condition?: string;
    doctors_name?: string;
    doctors_phone?: string;
    selectedFees: string[];         // ✅ required for fee checkboxes
    selectedResources: string[];    // ✅ required for resource checkboxes
    paymentMode: "full" | "installment";
    installments: number;
    installmentDates: string[];
    applyScholarship: boolean;
    scholarshipAmount: number;
    status?: "enrolled" | "graduated" | "dropped" | "not enrolled";
    scholarshipPercentage: number; // ✅ Made property required
}
const steps = [
    { title: "Personal Information", description: "Enter the student's details." },
    { title: "Contact Information", description: "Provide the student's contact info." },
    { title: "Parent/Guardian Details", description: "Provide information for parent/guardian." },
    { title: "Academic Information", description: "Details regarding the student's academic background." },
    { title: "Emergency Contact", description: "Provide emergency contact information." },
    { title: "Medical Information", description: "Fill in any medical history if applicable." },
    { title: "Consent and Declaration", description: "Agree to terms and conditions." },
    { title: "Fee Information", description: "Choose the fee structure and payment options." },
    { title: "Payment Confirmation", description: "Provide proof of payment and registration confirmation." },
];

function StepIndicator({ steps, currentStep }: { steps: any[]; currentStep: number }) {

    return (
        <div className="flex overflow-x-auto custom-scrollbar gap-4 my-6">
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <div key={index} className="flex flex-col items-center text-center flex-shrink-0 w-24">
                        <div
                            className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold ${isActive ? "bg-gray-800" : isCompleted ? "bg-teal" : "bg-gray-500"
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span className={`mt-1 text-xs ${isActive ? "font-semibold text-foreground" : "text-foreground"}`}>
                            {step.title.split(" ")[0]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function RegistrationContent({
    steps,
    currentStep,
    formData,
    handleChange,
    handleNext,
    handleBack,
    countryCode,
    setCountryCode,
    sameAddressAsChild,
    setSameAddressAsChild,
    sameEmergencyAsGuardian,
    setSameEmergencyAsGuardian,
    setIsNotificationCard,
    setNotificationMessage,
    setNotificationType,

}: {
    steps: any[];
    currentStep: number;
    formData: FormData;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleNext: () => void;
    handleBack: () => void;
    countryCode: string;
    setCountryCode: (value: string) => void;
    sameAddressAsChild: boolean;
    setSameAddressAsChild: (value: boolean) => void;
    setIsNotificationCard: (value: boolean) => void;
    setNotificationMessage: (value: string) => void;
    setNotificationType: (value: "success" | "error" | "info" | "warning") => void;
    sameEmergencyAsGuardian: boolean;
    setSameEmergencyAsGuardian: (value: boolean) => void;
              
}) {
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("schoolId");
    const [feeList, setFeeList] = useState<FeeSchema[]>([]);
    const [feeLoading, setFeeLoading] = useState(false);
    const [classLevels, setClassLevels] = useState<ClassLevelSchema[]>([])
    const [acadamicYear, setCurrentAcademicYear] = useState<string>("")

    const [resourceList, setResourceList] = useState<SchoolResourceSchema[]>([]);
    const [resourceLoading, setResourceLoading] = useState(true);
    const [classLoading, setClassLoading] = useState(true);
    const [yearLoading, setYearLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "failure" | null>(null);

    const classOptions = classLevels.map((level) => ({
        label: level.name,
        value: level._id,
    }));
    const getCurrentAcademicYear = (academicYears: AcademicYearSchema[]): string => {
        const today = new Date();
      
        const current = academicYears.find(year => {
          const start = new Date(year.start_date);
          const end = new Date(year.end_date);
          return today >= start && today <= end;
        });
      
        return current?.academic_year || "";
      };
      
      const fetchAcademicYear = async () => {
        try {
          setYearLoading(true);
      
          const years = await getAcademicYears();
          const current = getCurrentAcademicYear(years);
      
          if (current) {
            console.log("✅ Current Academic Year:", current);
            setCurrentAcademicYear(current); // current is already a string
          } else {
            console.warn("⚠️ No current academic year found for today.");
            setCurrentAcademicYear(""); // Reset to an empty string
          }
        } catch (error) {
          console.error("Error fetching academic years:", error);
        } finally {
          setYearLoading(false);
        }
      };
      

    const fetchClassLevel = async () => {
        try {
            setClassLoading(true);
            if (!schoolId) {
                throw new Error("School ID is required to fetch fees.");
            }
            const level = await getClassLevelsBySchoolId(schoolId); // Replace with dynamic if needed
            setClassLevels(level);
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setClassLoading(true);
        }
    };
    const fetchFees = async () => {
        try {
            setFeeLoading(true);
            if (!schoolId) {
                throw new Error("School ID is required to fetch fees.");
            }
            const fees = await getFeesBySchoolId(schoolId); // Replace with dynamic if needed
            setFeeList(fees);
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setFeeLoading(false);
        }
    };
    const fetchResources = async () => {
        try {
            if (!schoolId) {
                throw new Error("School ID is required to fetch fees.");
            } const resources = await getSchoolResourcesBySchoolId(schoolId);
            setResourceList(resources);
        } catch (error) {
            console.error("Error loading school resources:", error);
        } finally {
            setResourceLoading(false);
        }
    };


    // console.log("academic year:",acadamicYear);
    useEffect(() => {

        fetchFees();
        fetchResources();
        fetchClassLevel();
        fetchAcademicYear();
    }, [currentStep]);
    // console.log("here is fee list :",feeList);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />

                        <CustomInput
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />

                        <CustomInput
                            label="Middle Name"
                            id="middleName"
                            placeholder="(Optional)"
                            name="middleName"
                            value={formData.middleName || ""}
                            onChange={handleChange}
                        />

                        <CustomDateInput
                            label="Date of Birth"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                        />

                        <CustomNationalitySelect
                            label="Nationality"
                            id="nationality"
                            name="nationality"
                            value={formData.nationality || ""}
                            onChange={handleChange}
                            required
                        />
                        <CustomSelect
                            label="Gender"
                            id="gender"
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                            required
                            options={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                            ]}
                            placeholder="Select gender"
                        />
                        <CustomInput
                            label="Place Of Birth"
                            id="place_of_birth"
                            name="place_of_birth"
                            value={formData.place_of_birth || ""}
                            onChange={handleChange}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            label="Student Address"
                            id="address"
                            placeholder="(Optional)"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                        />
                        <CustomPhoneInput
                            label="Student Phone Number (Optional)"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            countryCode={countryCode}
                            onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            label="Parent/Gaurdian Name"
                            id="guardian_name"
                            name="guardian_name"
                            value={formData.guardian_name || ""}
                            onChange={handleChange}
                        />
                        <CustomSelect
                            label="Relationship With Student"
                            id="guardian_relationship"
                            name="guardian_relationship"
                            value={formData.guardian_relationship || ""}
                            onChange={handleChange}
                            required
                            options={[
                                { label: "Mother", value: "Mother" },
                                { label: "Father", value: "Father" },
                                { label: "Brother", value: "Brother" },
                                { label: "Sister", value: "Sister" },
                                { label: "Aunty", value: "Aunty" },
                                { label: "Uncle", value: "Uncle" },
                                { label: "Grand Mother", value: "Grand Mother" },
                                { label: "Grand Father", value: "Grand Father" },
                                { label: "Other", value: "Other" },
                            ]}
                            placeholder="Select Relationship"
                        />
                        <CustomCheckboxInput
                            label="Same address as student"
                            id="sameAddressAsChild"
                            name="sameAddressAsChild"
                            checked={sameAddressAsChild}
                            onChange={(e) => setSameAddressAsChild(e.target.checked)}
                        />

                        <CustomInput
                            label="Address"
                            id="guardian_address"
                            placeholder="(Required)"
                            name="guardian_address"
                            value={formData.guardian_address || ""}
                            onChange={handleChange}

                        />
                        <CustomPhoneInput
                            label="Phone Number (Required)"
                            id="guardian_phone"
                            name="guardian_phone"
                            value={formData.guardian_phone || ''}
                            onChange={handleChange}
                            countryCode={countryCode}
                            onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                            required
                        />
                        <CustomInput
                            label="Occupation"
                            id="guardian_occupation"
                            placeholder="(Optional)"
                            name="guardian_occupation"
                            value={formData.guardian_occupation || ""}
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Email"
                            id="guardian_email"
                            placeholder="(Optional)"
                            name="guardian_email"
                            value={formData.guardian_email || ""}
                            onChange={handleChange}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomSelect
                            label="Select Class"
                            id="class_id"
                            name="class_id"
                            value={formData.class_id || ""}
                            onChange={handleChange}
                            required
                            options={classOptions}
                            placeholder="Select Class"
                        />
                        <CustomInput
                            label="Previous School/Institution"
                            id="previous_school"
                            placeholder="(Optional)"
                            name="previous_school"
                            value={formData.previous_school || ""}
                            onChange={handleChange}
                        />
                        <CustomCheckboxInput
                            label="Check the box if copies of transcripts or report cards were provided"
                            id="transcript_reportcard"
                            name="transcript_reportcard"
                            checked={formData.transcript_reportcard}
                            onChange={handleChange}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomCheckboxInput
                            label="Same as Guardian Info"
                            id="sameEmergencyAsGuardian"
                            name="sameEmergencyAsGuardian"
                            checked={sameEmergencyAsGuardian}
                            onChange={(e) => setSameEmergencyAsGuardian(e.target.checked)}
                        />

                        <CustomInput
                            label="Emergency Contact Name"
                            id="emergency_contact_name"
                            placeholder="(Required)"
                            name="emergency_contact_name"
                            value={formData.emergency_contact_name || ""}
                            onChange={handleChange}
                            required
                        />
                        <CustomSelect
                            label="Select Relationship"
                            id="emergency_contact_relationship"
                            name="emergency_contact_relationship"
                            value={formData.emergency_contact_relationship || ""}
                            onChange={handleChange}
                            required
                            options={[
                                { label: "Mother", value: "Mother" },
                                { label: "Father", value: "Father" },
                                { label: "Brother", value: "Brother" },
                                { label: "Sister", value: "Sister" },
                                { label: "Aunty", value: "Aunty" },
                                { label: "Uncle", value: "Uncle" },
                                { label: "Grand Mother", value: "Grand Mother" },
                                { label: "Grand Father", value: "Grand Father" },
                                { label: "Other", value: "Other" },
                            ]}
                            placeholder="Select Relationship"
                        />

                        <CustomInput
                            label="Emergency Contact Phone"
                            id="emergency_contact_phone"
                            placeholder="(Required)"
                            name="emergency_contact_phone"
                            value={formData.emergency_contact_phone || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                );
            case 5:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomTextarea
                            label="Health Condition (Write notes if student have a health condition)"
                            id="health_condition"
                            name="health_condition"
                            value={formData.health_condition || ""}
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Doctor's Name"
                            id="doctors_name"
                            placeholder="(Optional)"
                            name="doctors_name"
                            value={formData.doctors_name || ""}
                            onChange={handleChange}
                        />
                        <CustomPhoneInput
                            label="Doctor's Phone Number (Optional)"
                            id="doctors_phone"
                            name="doctors_phone"
                            value={formData.doctors_phone || ''}
                            onChange={handleChange}
                            countryCode={countryCode}
                            onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                        />
                    </div>
                );
            case 6:
                return (
                    <ConsentDeclaration
                        checked={formData.guardian_agreed_to_terms}
                        onChange={handleChange}
                    />
                );
            case 7:

                return (
                    <div className="space-y-6">
                        <FeesAndResourcesSection
                            formData={formData}
                            handleChange={handleChange}
                            feeList={feeList}
                            feeLoading={feeLoading}
                            resourceList={resourceList}
                            resourceLoading={resourceLoading} applyScholarship={false} scholarshipAmount={0} />
                    </div>
                );
            case 8:
                return (
                    <RegistrationSummary
                        formData={formData}
                        feeList={feeList}
                        resourceList={resourceList}
                    />
                );
            default:
                return null;
        }
    };
    interface Fee {
        amount?: number;
    }

    interface Resource {
        amount?: number;
    }

    function calculateTotalFee(selectedFees: Fee[], selectedResources: Resource[], scholarshipPercentage: number): number {
        const feesTotal = selectedFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
        const resourcesTotal = selectedResources.reduce((sum, res) => sum + (res.amount || 0), 0);
        const grossTotal = feesTotal + resourcesTotal;
        const discount = (grossTotal * scholarshipPercentage) / 100;
        return grossTotal - discount;
      }
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setIsSubmitting(true);
        // setSubmitStatus(null);
        console.log("To be submitted:", formData);
    
        try {
            const totalFee = calculateTotalFee(
                formData.selectedFees.map((feeId) => feeList.find((fee) => fee._id === feeId)!).filter(Boolean) as Fee[],
                formData.selectedResources.map((resourceId) => resourceList.find((resource) => resource._id === resourceId)!).filter(Boolean) as Resource[],
                formData.scholarshipPercentage || 0
              );
              
              const studentData = {

                school_id: searchParams.get("schoolId") || "",
                class_id: formData.class_id || "",
              
                first_name: formData.firstName,
                last_name: formData.lastName,
                middle_name: formData.middleName || "",
                date_of_birth: formData.dateOfBirth || "",
                nationality: formData.nationality || "Cameroonian",
                gender: formData.gender || "",
                place_of_birth: formData.place_of_birth || "",
                address: formData.address || "",
                phone: formData.phone || "",
              
                guardian_name: formData.guardian_name || "",
                guardian_phone: formData.guardian_phone || "",
                guardian_address: formData.guardian_address || "",
                guardian_email: formData.guardian_email || "",
                guardian_relationship: formData.guardian_relationship as "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other" | undefined,
                guardian_occupation: formData.guardian_occupation || "",
              
                emergency_contact_name: formData.emergency_contact_name || "",
                emergency_contact_phone: formData.emergency_contact_phone || "",
                emergency_contact_relationship: formData.emergency_contact_relationship as "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other" | undefined,
              
                previous_school: formData.previous_school || "",
                transcript_reportcard: formData.transcript_reportcard || false,
              
                health_condition: formData.health_condition || "",
                doctors_name: formData.doctors_name || "",
                doctors_phone: formData.doctors_phone || "",
              
                selectedFees: formData.selectedFees || [],
                selectedResources: formData.selectedResources || [],
                paymentMode: formData.paymentMode || "full",
                installments: formData.installments || 1,
                installmentDates: formData.installmentDates || [new Date().toISOString().split("T")[0]],
                applyScholarship: formData.applyScholarship || false,
                scholarshipAmount: formData.scholarshipAmount || 0,
                scholarshipPercentage: formData.scholarshipPercentage || 0,
              
                fees: totalFee,
                guardian_agreed_to_terms: formData.guardian_agreed_to_terms || false,
                enrollement_date: new Date().toISOString(),
                status: formData.status || "not enrolled",
              };
              
            const data = await createStudent(studentData);
            // Do something with `student` or show success message
            console.log("create student data",data)
            if (data) {
                const numberOfInstallments = formData.installments || 1;
                const amountPerInstallment = Number((totalFee / numberOfInstallments).toFixed(2));
              
                // Helper to generate dates if not provided
                const generateInstallmentDates = (count: number): Date[] => {
                  const dates: Date[] = [];
                  const today = new Date();
              
                  for (let i = 0; i < count; i++) {
                    const dueDate = new Date(today);
                    dueDate.setMonth(today.getMonth() + i); // Spread over next few months
                    dates.push(dueDate);
                  }
              
                  return dates;
                };
              
                // Use provided dates or generate them
                const installmentDates: Date[] =
                  Array.isArray(formData.installmentDates) && formData.installmentDates.length === numberOfInstallments
                    ? formData.installmentDates.map((d: any) => new Date(d))
                    : generateInstallmentDates(numberOfInstallments);
              
                const installments =
                  formData.paymentMode === "installment"
                    ? installmentDates.map((dueDate, index) => ({
                        amount: amountPerInstallment,
                        dueDate: dueDate.toISOString().split("T")[0],
                        paid: index === 0, // Only first installment is paid
                      }))
                    : [];
              
                const feePaymentData = {
                  student_id: data._id,
                  school_id: searchParams.get("schoolId") || "",
                  class_id: formData.class_id || "",
                  academic_year: acadamicYear,
              
                  selectedFees: formData.selectedFees || [],
                  selectedResources: formData.selectedResources || [],
              
                  paymentMode: formData.paymentMode || "full",
                  totalAmount: totalFee,
              
                  installments,
                };
              
                const paymentData = await createFeePayment(feePaymentData);
                if(paymentData){
                    alert("Added successfuly")
                }
              }

        } catch (error) {
            console.error("Error creating student:", error);
            setSubmitStatus("failure");
    
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while creating the invitation.";
    
            setNotificationMessage(errorMessage);
            setNotificationType("error");
            setIsNotificationCard(true);
        } finally {
            // Optional cleanup
        }
    }, [formData]);
    

    return (
        <div>
            <StepIndicator steps={steps} currentStep={currentStep} />
            <form className="p-4 shadow-md rounded-md" onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h2>
                {renderStepContent()}
                <div className="mt-6 gap-6 flex">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-4 py-2 border border-gray-500 text-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </motion.button>

                    {currentStep < steps.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            type="button"
                            onClick={handleNext}
                            className="px-4 py-2 border border-gray-500 text-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            type="submit"
                            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 flex items-center gap-2">
                            Confirm Details & Payment
                        </motion.button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function ViewParentPage() {

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
        nationality: 'Cameroonian',
        gender: "",
        place_of_birth: "",
        address: "",
        phone: "",
        guardian_phone: "",
        guardian_name: "",
        guardian_address: "",
        guardian_occupation: "",
        guardian_email: "",
        guardian_relationship: "",
        previous_school: "",
        class_id: "",
        guardian_agreed_to_terms: false,
        transcript_reportcard: false,
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relationship: "",
        health_condition: "",
        doctors_name: "",
        doctors_phone: "",
        selectedFees: [],
        selectedResources: [],
        paymentMode: "full",
        installments: 1,
        installmentDates: [new Date().toISOString().split("T")[0]],
        applyScholarship: false,
        scholarshipAmount: 0,
        scholarshipPercentage: 0, // Ensure default value is always provided
        status:"not enrolled"
    });

    const [countryCode, setCountryCode] = useState("+237");
    const [currentStep, setCurrentStep] = useState(0);

    const [isNotificationCard, setIsNotificationCard] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error" | "info" | "warning">("success");
    const [sameAddressAsChild, setSameAddressAsChild] = useState(false);
    const [sameEmergencyAsGuardian, setSameEmergencyAsGuardian] = useState(false);
    // ✅ Add validateStep here
    const validateStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    formData.firstName?.trim() &&
                    formData.lastName?.trim() &&
                    formData.dateOfBirth?.trim() &&
                    formData.nationality?.trim() &&
                    formData.gender?.trim()
                );

            case 1:
                return true;

            case 2:
                return (
                    formData.guardian_name?.trim() &&
                    formData.guardian_relationship?.trim() &&
                    formData.guardian_address?.trim() &&
                    formData.guardian_phone?.trim()
                );

            case 3:
                return !!formData.class_id;

            case 4:
                return (
                    formData.emergency_contact_name?.trim() &&
                    formData.emergency_contact_relationship?.trim() &&
                    formData.emergency_contact_phone?.trim()
                );

            case 5:
                return true;

            case 6:
                return formData.guardian_agreed_to_terms === true;

            case 7:
            case 8:
                return true;

            default:
                return false;
        }
    };
    // Prefill parent address if same as child
    useEffect(() => {
        if (sameAddressAsChild) {
            setFormData((prev) => ({
                ...prev,
                guardian_address: prev.address || "", // student address -> guardian address
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                guardian_address: "", // clear guardian address when unchecked
            }));
        }
    }, [sameAddressAsChild]);
    // Prefill emergency contact from guardian info
    useEffect(() => {
        if (sameEmergencyAsGuardian) {
            setFormData((prev) => ({
                ...prev,
                emergency_contact_name: prev.guardian_name || "",
                emergency_contact_relationship: prev.guardian_relationship || "",
                emergency_contact_phone: prev.guardian_phone || "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                emergency_contact_name: "",
                emergency_contact_relationship: "",
                emergency_contact_phone: "",
            }));
        }
    }, [sameEmergencyAsGuardian]);

    const handleChange = useCallback((e: React.ChangeEvent<any>) => {
        const { name, type, value, checked } = e.target;

        if (name === "installmentDates") {
            setFormData((prev) => ({
                ...prev,
                installmentDates: value,
            }));
        } else if (name === "installments") {
            const count = parseInt(value, 10);
            const today = new Date();
            const newDates = Array.from({ length: count }, (_, i) => {
                const date = new Date(today);
                date.setMonth(today.getMonth() + i);
                return date.toISOString().split("T")[0];
            });

            setFormData((prev) => ({
                ...prev,
                installments: count,
                installmentDates: newDates,
            }));
        }
        if ((name === "selectedFees" || name === "selectedResources") && type === "checkbox") {
            setFormData((prev) => {
                const updated = checked
                    ? [...prev[name as "selectedFees" | "selectedResources"], value]
                    : prev[name as "selectedFees" | "selectedResources"].filter((id) => id !== value);

                return {
                    ...prev,
                    [name]: updated,
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    }, []);

    // const handleNext = useCallback(() => {
    //     if (!validateStep()) {
    //         setNotificationMessage("Please fill all required fields before proceeding.");
    //         setIsNotificationCard(true)
    //         setNotificationType('error')
    //         return;
    //       }
    //     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    // }, []);
    const handleNext = useCallback(() => {
        if (!validateStep()) {
            setNotificationMessage("Please fill all required fields before proceeding.");
            setIsNotificationCard(true);
            setNotificationType('error');
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, [formData, currentStep]);
    const handleBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    return (
        <SuperLayout
            navigation={{
                icon: GraduationCap,
                title: "Student Registration",
                baseHref: "/super-admin/students"
            }}
            showGoPro={true}
            onLogout={() => console.log("Logout")}
        >
            {isNotificationCard && (
                <NotificationCard
                    title="Notification"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#15803d" strokeWidth="1.5" />
                            <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#15803d" strokeWidth="1.5" />
                        </svg>
                    }
                    message={notificationMessage}
                    onClose={() => setIsNotificationCard(false)}
                    type={notificationType}
                    isVisible={isNotificationCard}
                    isFixed={true}
                />
            )}
            <RegistrationContent
                steps={steps}
                currentStep={currentStep}
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                handleBack={handleBack}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                sameAddressAsChild={sameAddressAsChild}
                setSameAddressAsChild={setSameAddressAsChild}
                sameEmergencyAsGuardian={sameEmergencyAsGuardian}
                setSameEmergencyAsGuardian={setSameEmergencyAsGuardian}
                setIsNotificationCard={setIsNotificationCard}
                setNotificationMessage={setNotificationMessage}
                setNotificationType={setNotificationType}
            />
        </SuperLayout>
    );
}
