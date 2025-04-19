"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ClassLevelSchema } from "@/app/models/ClassLevel";
import CustomInput from "@/components/inputs/CustomInput";
import { ClassSchema } from "@/app/models/ClassModel";

interface UpdateClassModalProps {
  onClose: () => void;
  onSave: (data: ClassSchema) => void;
  initialData?: ClassSchema;
  classLevels: ClassLevelSchema[];  // Full list of class levels passed as prop
}

const UpdateClassModal: React.FC<UpdateClassModalProps> = ({
  onClose,
  onSave,
  initialData,
  classLevels,
}) => {
  const [formData, setFormData] = useState<ClassSchema>({
    _id: "",
    class_id: "",
    name: "",
    class_code: "",
    class_level: "",
    school_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        class_id: initialData.class_id,
        name: initialData.name,
        class_code: initialData.class_code,
        class_level: initialData.class_level,  // Set initial class level from initialData
        school_id: initialData.school_id,
      });
    }
  }, [initialData]);
  console.log("classLevel:", classLevels);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);  // Save the form data
    onClose();  // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Update Class</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Class Name */}
          <CustomInput
            label="Class Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Class Code */}
          <CustomInput
            label="Class Code"
            id="class_code"
            name="class_code"
            value={formData.class_code}
            onChange={handleChange}
            required
          />

          {/* Class Level Dropdown */}
          <div className="mb-4">
            <label htmlFor="class_level" className="block text-sm mb-1">
              Class Level
            </label>
            <select
              name="class_level"
              id="class_level"
              value={formData.class_level}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            >
              <option value="">Select level</option>
              {classLevels.map((level) => (
                <option key={level._id} value={level._id}>
                  {level.name}
                </option>
              ))}
            </select>
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

export default UpdateClassModal;
