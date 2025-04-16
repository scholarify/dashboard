"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface DeleteSchoolModalProps {
  schoolName: string;
  onClose: () => void;
  onDelete: (password: string) => void;
}

const DeleteSchoolModal: React.FC<DeleteSchoolModalProps> = ({
  schoolName,
  onClose,
  onDelete,
}) => {
  const [password, setPassword] = useState("");

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert("Please enter your password to confirm deletion.");
      return;
    }
    onDelete(password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Delete School</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Message de confirmation */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete <strong className="font-semibold text-pink-500">{schoolName}?</strong> This action is irreversible and will delete all associated data.
        </p>

        {/* Champ de mot de passe */}
        <form onSubmit={handleDelete}>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Type password to confirm delete"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-pink-300 dark:border-pink-500 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
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
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteSchoolModal;