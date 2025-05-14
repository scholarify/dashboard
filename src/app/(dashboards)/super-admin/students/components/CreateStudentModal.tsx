"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { StudentCreateSchema } from "@/app/models/StudentModel";
import CustomInput from "@/components/inputs/CustomInput";
import CustomDateInput from "@/components/inputs/CustomDateInput";
import SubmissionFeedback from "@/components/widgets/SubmissionFeedback";
import CircularLoader from "@/components/widgets/CircularLoader";
import { motion } from "framer-motion";

interface CreateStudentModalProps {
  onClose: () => void;
  onSave: (studentData: StudentCreateSchema) => Promise<void>;
  initialData?: StudentCreateSchema;
  submitStatus: "success" | "failure" | null;
  isSubmitting: boolean;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ 
  onClose, 
  onSave, 
  initialData,  
  submitStatus,
  isSubmitting 
}) => {
  const [formData, setFormData] = useState<StudentCreateSchema>(
    initialData || {
      guardian_id: [],
      school_id: "",
      name: "",
      date_of_birth: "",
      fees: 0,
      class_id: "",
      age: 0,
      gender: "",
      enrollement_date: "",
      non_compulsory_sbj: [],
      status: "enrolled",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit  = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      fees: Number(formData.fees),
      age: Number(formData.age),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-svh overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-max mx-4 sm:mx-6 md:mx-0 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit Student" : "Add New Student"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {submitStatus ? (
          <SubmissionFeedback 
            status={submitStatus}
            message={
              submitStatus === "success"
                ? "Student has been created successfully!"
                : "There was an error trying to create the student. Try again and if this persists, contact support."
            } 
          />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="sm:grid sm:grid-cols-2 gap-4">
              <CustomInput
                label="Student Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Student ID"
                id="student_id"
                name="student_id"
                value={formData.student_id || ""}
                onChange={handleChange}
              />

              <CustomInput
                label="School ID"
                id="school_id"
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Class ID"
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Guardian IDs (comma separated)"
                id="guardian_id"
                name="guardian_id"
                value={formData.guardian_id.join(",")}
                onChange={(e) => setFormData({ ...formData, guardian_id: e.target.value.split(",") })}
                required
              />

              <CustomInput
                label="Fees"
                id="fees"
                name="fees"
                type="number"
                value={formData.fees.toString()}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Age"
                id="age"
                name="age"
                type="number"
                value={formData.age.toString()}
                onChange={handleChange}
                required
              />

              <CustomInput
                label="Gender"
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
              />

              <CustomDateInput
                label="Date of Birth"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />

              <CustomDateInput
                label="Enrollment Date"
                id="enrollement_date"
                name="enrollement_date"
                value={formData.enrollement_date || ""}
                onChange={handleChange}
              />

              <CustomInput
                label="Non-compulsory Subjects (comma separated)"
                id="non_compulsory_sbj"
                name="non_compulsory_sbj"
                value={(formData.non_compulsory_sbj || []).join(",")}
                onChange={(e) => setFormData({ ...formData, non_compulsory_sbj: e.target.value.split(",") })}
              />

              <CustomInput
                label="Status"
                id="status"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
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

export default CreateStudentModal;
