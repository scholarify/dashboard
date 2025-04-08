"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (userData: UserData) => void;
  roles: string[];
  schools: string[];
  initialData?: UserData;
}

interface UserData {
  name: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  address: string;
  school: string[]; // multiple schools
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
  onSave,
  roles,
  schools,
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
    address: "",
    school: [],
  });

  const [countryCode, setCountryCode] = useState("+44");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, phone: `${countryCode}${formData.phone}` });
    onClose();
  };

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Add New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Phone</label>
            <div className="flex items-center space-x-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal appearance-none bg-transparent"
              >
                <option value="+44">🇬🇧 +44</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="000 000 0000"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
          </div>

          {/* School and Role (Flex Row) */}
          <div className="mb-4 flex flex-wrap gap-4">
            {/* Role Dropdown */}
            <div className="flex-1">
              <label className="block text-sm mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal "
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
                  {formData.school.length > 0
                    ? formData.school.join(", ")
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
                        key={school}
                        className="flex items-center gap-2 px-2 py-1 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={formData.school.includes(school)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              school: isChecked
                                ? [...prev.school, school]
                                : prev.school.filter((s) => s !== school),
                            }));
                          }}
                        />
                        {school}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
