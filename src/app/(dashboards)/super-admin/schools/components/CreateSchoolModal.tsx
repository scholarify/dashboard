"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CreateSchoolProps {
  onClose: () => void;
  onSave: (schoolData: SchoolData) => void;
  initialData?: SchoolData; // Ajout des données initiales pour l'édition
}

interface SchoolData {
  schoolName: string;
  email: string;
  address: string;
  website: string;
  principalName: string;
  creationDate?: string;
  phoneNumber: string;
  description: string;
}

const CreateSchoolModal: React.FC<CreateSchoolProps> = ({ onClose, onSave, initialData }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState<SchoolData>(
    initialData || {
      schoolName: "",
      email: "",
      address: "",
      website: "",
      principalName: "",
      creationDate: "",
      phoneNumber: "",
      description: "",
    }
  );

  // État pour le code pays
  const [countryCode, setCountryCode] = useState("+44");

  // Pré-remplir le code pays et le numéro de téléphone si initialData est fourni
  useEffect(() => {
    if (initialData?.phoneNumber) {
      const phone = initialData.phoneNumber;
      const code = phone.match(/^\+\d+/)?.[0] || "+44";
      const number = phone.replace(code, "");
      setCountryCode(code);
      setFormData((prev) => ({ ...prev, phoneNumber: number }));
    }
  }, [initialData]);

  // Gérer les changements dans les champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, phoneNumber: `${countryCode}${formData.phoneNumber}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="max-h-svh overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit School" : "Add New School"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* School Name */}
          <div className="mb-4">
            <label htmlFor="schoolName" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Website */}
          <div className="mb-4">
            <label htmlFor="website" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          {/* Principal Name */}
          <div className="mb-4">
            <label htmlFor="principalName" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Principal Name
            </label>
            <input
              type="text"
              id="principalName"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Created At */}
            <div className="mb-4">
                <label htmlFor="creationDate" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Creation Date
                </label>
                <input
                type="date"
                id="creationDate"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
                />
            </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="+44">🇬🇧 +44</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="000 000 0000"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
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