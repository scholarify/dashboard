"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { UserUpdateSchema } from "@/app/models/UserModel";
import CustomInput from "@/components/inputs/CustomInput";
import CustomPhoneInput from "@/components/inputs/CustomPhoneInput";
import { SchoolSchema } from "@/app/models/SchoolModel";

interface UpdateUserModalProps {
    onClose: () => void;
    onSave: (userData: UserUpdateSchema) => void;
    roles: string[];
    schools: SchoolSchema[];
    initialData?: UserUpdateSchema;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
    onClose,
    onSave,
    roles,
    schools,
    initialData,
}) => {
    // Default form data with phone as an empty string to ensure it's always a string
    const [formData, setFormData] = useState<UserUpdateSchema>({
        user_id: "", // Required for updating
        name: "",
        email: "",
        role: "admin",
        password: "",
        phone: "", // Initialized as empty string
        address: "",
        school_ids: [],
    });

    const [countryCode, setCountryCode] = useState("+237");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

    useEffect(() => {
        if (initialData) {
            const rawPhone = initialData.phone?.replace(/\s|-/g, "") || "";
            const code = rawPhone.match(/^\+\d{1,3}/)?.[0] || "+237";
            const number = rawPhone.replace(code, "");

            setFormData({
                user_id: initialData.user_id || "",
                name: initialData.name || "",
                email: initialData.email || "",
                password: initialData.password || "",
                role: initialData.role,
                phone: number || "", // Ensure phone is a string (fallback to empty string)
                address: initialData.address || "",
                school_ids: initialData.school_ids || [],
            });

            setCountryCode(code);
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            phone: `${countryCode}${formData.phone}`,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            password: formData.password,
            address: formData.address,
            school_ids: formData.school_ids || [],
        });
        onClose();
    };

    const filteredSchools = (schools || [])
        .filter((school) =>
            school.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 2);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                        {initialData ? "Edit User" : "Add New User"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <CustomInput
                        label="Full Name"
                        id="fullName"
                        name="name"
                        value={formData.name || ""} // Ensure it's a string
                        onChange={handleChange}
                        required
                    />

                    <CustomInput
                        label="Email"
                        id="email"
                        name="email"
                        value={formData.email || ""} // Ensure it's a string
                        onChange={handleChange}
                        required
                    />

                    <CustomInput
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password || ""} // Ensure it's a string
                        onChange={handleChange}
                        required={!initialData} // Only required if not editing
                    />

                    {/* Phone */}
                    <CustomPhoneInput
                        label="Phone Number"
                        id="phone"
                        name="phone"
                        value={formData.phone || ""} // Ensure it's a string
                        onChange={handleChange}
                        countryCode={countryCode}
                        onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                        required
                    />

                    {/* Address */}
                    <CustomInput
                        label="Address"
                        id="address"
                        name="address"
                        value={formData.address || ""} // Ensure it's a string
                        onChange={handleChange}
                        required
                    />

                    {/* School and Role (Flex Row) */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        {/* Role Dropdown */}
                        <div className="flex-1">
                            <label className="block text-sm mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role || ""} // Ensure it's a string
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
                                required
                            >
                                <option value="">Select role</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* School (Searchable Checkboxes Dropdown) */}
                        <div className="relative flex-1">
                            <label className="block text-sm mb-1">Schools</label>
                            <div
                                onClick={() => setShowSchoolDropdown((prev) => !prev)}
                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 bg-white dark:text-white cursor-pointer flex items-center justify-between"
                            >
                                <span>
                                    {(formData.school_ids?.length ?? 0) > 0
                                        ? schools
                                            .filter((school) => formData.school_ids?.includes(school._id))
                                            .map((school) => school.name)
                                            .join(", ")
                                        : "Select schools"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>

                            {showSchoolDropdown && (
                                <div className="absolute z-10 bg-white dark:bg-gray-700 w-full mt-1 rounded-md border max-h-48 overflow-y-auto p-2 shadow-lg">
                                    <input
                                        type="text"
                                        placeholder="Search school..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full mb-2 px-2 py-1 border rounded-md text-sm dark:bg-gray-600"
                                    />

                                    {filteredSchools.length > 0 ? (
                                        filteredSchools.map((school) => (
                                            <label
                                                key={school._id}
                                                className="flex items-center gap-2 px-2 py-1 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={(formData.school_ids ?? []).includes(school._id)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            school_ids: isChecked
                                                                ? [...(prev.school_ids ?? []), school._id] // Ensure school_ids is always an array
                                                                : (prev.school_ids ?? []).filter((id) => id !== school._id), // Fallback to empty array if undefined
                                                        }));
                                                    }}
                                                />
                                                {school.name}
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No schools found</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserModal;
