"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import CustomInput from "@/components/inputs/CustomInput";
import { ClassSchema } from "@/app/models/ClassModel";
import { ClassLevelSchema } from "@/app/models/ClassLevel";
import { motion } from "framer-motion";
import CircularLoader from "@/components/widgets/CircularLoader";
import SubmissionFeedback from "@/components/widgets/SubmissionFeedback";

interface CreateClassModalProps {
  onClose: () => void;
  onSave: (data: ClassSchema) => void;
  schoolId: string;
  classLevels: ClassLevelSchema[];
  initialData?: ClassSchema;
  submitStatus: "success" | "failure" | null;
  isSubmitting: boolean;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  onClose,
  onSave,
  schoolId,
  classLevels,
  initialData,
  submitStatus,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<ClassSchema>({
    _id: "",
    class_id: "",
    name: "",
    class_code: "",
    class_level: "",
    school_id: schoolId,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.class_code.trim() || !formData.class_level) {
      alert("All fields are required.");
      return;
    }

    onSave({ ...formData, school_id: schoolId });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit Class" : "Add New Class"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {submitStatus ? (
          <SubmissionFeedback status={submitStatus}
            message={
              submitStatus === "success"
                ? "Class has been Created Successfully!"
                : "There was an error Creating this class. Try again and if this persist contact support!"
            } />
        ) : (
          <>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <CustomInput
                label="Class Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Class Code"
                id="class_code"
                name="class_code"
                value={formData.class_code}
                onChange={handleChange}
                required
              />

              <div className="mt-4">
                <label
                  htmlFor="class_level"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Class Level
                </label>
                <select
                  id="class_level"
                  name="class_level"
                  value={formData.class_level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">Select a level</option>
                  {classLevels.map((level) => (
                    <option key={level._id} value={level._id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  type="submit"
                  className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <CircularLoader size={18} color="teal-500" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </motion.button>
              </div>
            </form>

          </>)}
      </div>
    </div>
  );
};

export default CreateClassModal;
