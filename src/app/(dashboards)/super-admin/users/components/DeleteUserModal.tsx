"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface DeleteUserModalProps {
  userName: string;
  onClose: () => void;
  onDelete: (password: string) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  userName,
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
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Delete User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Confirmation Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete user <strong className="font-semibold text-red-500">{userName}?</strong> This action is irreversible and will permanently remove the user's data.
        </p>

        {/* Password Input */}
        <form onSubmit={handleDelete}>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Type password to confirm delete"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-red-300 dark:border-red-500 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Action Buttons */}
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

export default DeleteUserModal;
