"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { InvitationCreateSchema } from "@/app/models/Invitation";
import CustomInput from "@/components/inputs/CustomInput";
import CustomPhoneInput from "@/components/inputs/CustomPhoneInput";
import { getSchools } from "@/app/services/SchoolServices";
import { getStudents } from "@/app/services/StudentServices";
import { StudentSchema } from "@/app/models/StudentModel";
import { SchoolSchema } from "@/app/models/SchoolModel";

interface CreateInvitationModalProps {
    onClose: () => void;
    onSave: (invitationData: InvitationCreateSchema) => void;
}

const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<Required<Pick<InvitationCreateSchema, "email" | "phone" | "name" | "childrenIds" | "token" | "status" | "school_ids">>>({
        email: "",
        phone: "",
        name: "",
        school_ids: [],
        childrenIds: [],
        token: "",
        status: "pending",
    });

    const [countryCode, setCountryCode] = useState("+237");
    const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchSchoolTerm, setSearchSchoolTerm] = useState("");
    const [schools, setSchools] = useState<SchoolSchema[]>([]);
    const [children, setChildren] = useState<StudentSchema[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    
    // Fetch schools and students
    useEffect(() => {
        getSchools()
            .then((data) => setSchools(data))
            .catch((error) => console.error("Error fetching schools:", error));

        getStudents()
            .then((data) => {
                const studentsWithId = data.map((student: any) => ({
                    ...student,
                    id: student.id || student._id, // 🔥 ensure id exists
                }));
                setChildren(studentsWithId);
            })
            .catch((error) => console.error("Error fetching children:", error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const toggleChildSelection = (childId: string, isChecked: boolean) => {
        setFormData((prev) => {
            const updatedChildren = isChecked
                ? [...prev.childrenIds, childId]
                : prev.childrenIds.filter((id) => id !== childId);

            return {
                ...prev,
                childrenIds: Array.from(new Set(updatedChildren)), // No duplicates
            };
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowChildrenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:mx-6 md:mx-0 relative flex flex-col md:flex-row">

                {/* Left Image */}
                <div className="hidden md:block md:w-1/2 h-full">
                    <img
                        src="/assets/images/parent.png"
                        alt="Parent Invite"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">Send Invitation</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <CustomInput
                            label="Full Name"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <CustomInput
                            label="Email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <CustomPhoneInput
                            label="Phone Number"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            countryCode={countryCode}
                            onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                            required
                        />

                        {/* Children Dropdown */}
                        <div className="mb-4 flex flex-col relative">
                            <label className="text-sm font-semibold mb-1">Children</label>
                            <div
                                onClick={() => setShowChildrenDropdown((prev) => !prev)}
                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 bg-white dark:text-white cursor-pointer flex items-center justify-between"
                            >
                                <span>
                                    {formData.childrenIds.length > 0
                                        ? children
                                            .filter(child => formData.childrenIds.includes(child.id as string))
                                            .map(child => child.name)
                                            .join(", ")
                                        : "Select children"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>

                            {showChildrenDropdown && (
                                <div ref={dropdownRef} className="absolute z-10 bg-white dark:bg-gray-700 mt-1 rounded-md border max-h-48 overflow-y-auto p-2 shadow-lg w-[calc(100%-2px)] left-0">
                                    <input
                                        type="text"
                                        placeholder="Search children..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full mb-2 px-2 py-1 border rounded-md text-sm dark:bg-gray-600"
                                    />
                                    {children
                                        .filter((child) =>
                                            child.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((child) => (
                                            <label
                                                key={child.id as string}
                                                className="flex items-center gap-2 px-2 py-1 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.childrenIds.includes(child.id as string)}
                                                    onChange={(e) => toggleChildSelection(child.id as string, e.target.checked)}
                                                />
                                                {child.name}
                                            </label>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Schools Dropdown */}
                        <div className="mb-4 flex flex-col relative">
                            <label className="text-sm font-semibold mb-1">School(s)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search schools..."
                                    value={searchSchoolTerm}
                                    onChange={(e) => setSearchSchoolTerm(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 bg-white dark:text-white mb-2 focus:outline-none"
                                />
                                <select
                                    multiple
                                    name="school_ids"
                                    value={formData.school_ids}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                                        setFormData((prev) => ({
                                            ...prev,
                                            school_ids: selectedOptions,
                                        }));
                                    }}
                                    className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 bg-white dark:text-white focus:ring-teal-500"
                                >
                                    {schools
                                        .filter((school) =>
                                            school.name.toLowerCase().includes(searchSchoolTerm.toLowerCase())
                                        )
                                        .map((school) => (
                                            <option key={school._id} value={school._id}>
                                                {school.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
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
                                Send Invitation
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default CreateInvitationModal;
