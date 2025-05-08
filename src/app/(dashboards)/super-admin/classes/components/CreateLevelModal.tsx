"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import CustomInput from "@/components/inputs/CustomInput";
import { ClassLevelCreateSchema } from "@/app/models/ClassLevel";
import SubmissionFeedback from "@/components/widgets/SubmissionFeedback";
import { motion } from "framer-motion";
import CircularLoader from "@/components/widgets/CircularLoader";

interface CreateLevelModalProps {
  onClose: () => void;
  onSave: (data: ClassLevelCreateSchema) => void;
  schoolId: string;
  initialData?: ClassLevelCreateSchema;
  submitStatus: "success" | "failure" | null;
  isSubmitting: boolean;
}

const CreateLevelModal: React.FC<CreateLevelModalProps> = ({
  onClose,
  onSave,
  schoolId,
  initialData,
  submitStatus,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<ClassLevelCreateSchema>({
    name: "",
    school_id: schoolId,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Class Level name is required.");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit Class Level" : "Add New Class Level"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {submitStatus ? (
          <SubmissionFeedback status={submitStatus}
            message={
              submitStatus === "success"
                ? "Invitation has been sent Successfully!"
                : "There was an error sending this invitation. Try again and if this persist contact support!"
            } />
        ) : (
          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Class Level Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="submit"
                className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 flex items-center gap-2"
                disabled={isSubmitting}
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
        )}
      </div>
    </div>
  );
};

export default CreateLevelModal;
