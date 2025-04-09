"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SchoolSchema } from "@/app/models/SchoolModel";
import CustomInput from "@/components/inputs/CustomInput";
import CustomPhoneInput from "@/components/inputs/CustomPhoneInput";
import CustomTextarea from "@/components/inputs/CustomTextarea";
import CustomDateInput from "@/components/inputs/CustomDateInput";

interface CreateSchoolProps {
  onClose: () => void;
  onSave: (schoolData: SchoolSchema) => void;
  initialData?: SchoolSchema;
}

const CreateSchoolModal: React.FC<CreateSchoolProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<SchoolSchema>(
    initialData || {
      school_id: "",
      name: "",
      email: "",
      address: "",
      website: "",
      principal_name: "",
      established_year: "",
      phone_numer: "",
      description: "",
    }
  );

  const [countryCode, setCountryCode] = useState("+237");

  useEffect(() => {
    if (initialData?.phone_numer) {
      const phone = initialData.phone_numer;
      const code = phone.match(/^\+\d+/)?.[0] || "+237";
      const number = phone.replace(code, "");
      setCountryCode(code);
      setFormData((prev) => ({ ...prev, phone_numer: number }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, phone_numer: `${countryCode}${formData.phone_numer}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-svh overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-max mx-4 sm:mx-6 md:mx-0 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit School" : "Add New School"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-2 gap-4">
            {/* School Name */}
            <CustomInput
              label="School Name"
              id="schoolName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <CustomInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <CustomInput
              label="Address"
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />

            {/* Website */}
            <CustomInput
              label="Website"
              id="website"
              name="website"
              type="url"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="https://"
            />

            {/* Principal Name */}
            <CustomInput
              label="Principal Name"
              id="principalName"
              name="principal_name"
              value={formData.principal_name || ""}
              onChange={handleChange}
              required
            />

            {/* Creation Date */}
            <CustomDateInput
              label="Creation Date"
              id="creationDate"
              name="established_year"
              value={formData.established_year || ""}
              onChange={handleChange}
            />

            {/* Phone Number */}
            <CustomPhoneInput
              label="Phone Number"
              id="phoneNumber"
              name="phone_numer"
              value={formData.phone_numer || ""}
              onChange={handleChange}
              countryCode={countryCode}
              onCountryCodeChange={(e) => setCountryCode(e.target.value)}
              required
            />

            {/* Description */}
            <CustomTextarea
              label="Description"
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchoolModal;