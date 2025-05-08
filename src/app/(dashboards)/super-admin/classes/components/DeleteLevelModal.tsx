"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import SubmissionFeedback from "@/components/widgets/SubmissionFeedback";
import { motion } from "framer-motion";
import CircularLoader from "@/components/widgets/CircularLoader";

interface DeleteClassLevelModalProps {
  levelName: string;
  onClose: () => void;
  onDelete: (password: string) => void;
  submitStatus: "success" | "failure" | null;
  isSubmitting: boolean;
}

const DeleteClassLevelModal: React.FC<DeleteClassLevelModalProps> = ({
  levelName,
  onClose,
  onDelete,
  submitStatus,
  isSubmitting,
}) => {
  const [password, setPassword] = useState("");

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert("Please enter your password to confirm deletion.");
      return;
    }
    onDelete(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Delete Class Level</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {submitStatus ? (
          <SubmissionFeedback status={submitStatus}
            message={
              submitStatus === "success"
                ? "Class Level has been sent Successfully!"
                : "There was an error deleting this Level. Try again and if this persist contact support!"
            } />
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete class level{" "}
              <strong className="font-semibold text-red-500">{levelName}</strong>? This action is irreversible.
            </p>

            <form onSubmit={handleDelete}>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-500 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
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
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <CircularLoader size={18} color="teal-500" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </motion.button>
              </div>
            </form>
          </>
        )}
      </div>

    </div>
  );
};

export default DeleteClassLevelModal;
