import React, { useState } from 'react';

interface Resource {
  _id: string;
  name: string;
  type: string;
  price: number;
}

interface ResourceSearchLibraryProps {
  resourceList: Resource[];
  resourceLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { selectedResources: string[] };
}

const ResourceSearchLibrary: React.FC<ResourceSearchLibraryProps> = ({
  resourceList,
  resourceLoading,
  handleChange,
  formData,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const resourceTypes = [
    'All',
    'Textbook',
    'Lab Material',
    'Notebook',
    'Uniform',
    'Stationery',
    'Sports Equipment',
    'Arts & Crafts',
    'Electronics',
    'Exam Material',
    'Miscellaneous',
    'Other',
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const filteredResources = resourceList.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm p-4 bg-white dark:bg-gray-900 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Other School Resources</h3>

      {/* Controls */}
      <div className="overflow-x-auto flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search resources..."
          value={searchText}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* Filter Dropdown */}
        <select
          value={selectedType}
          onChange={handleFilterChange}
          className="w-full md:w-60 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {resourceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Resources List */}
      <div className="max-h-32 overflow-y-auto p-2 space-y-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal custom-scrollbar">
        {resourceLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400" >Loading resources...</p>
        ) : filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div key={res._id} className="flex items-center gap-3 ">
              <input
                type="checkbox"
                id={`res-${res._id}`}
                name="selectedResources"
                value={res._id}
                checked={formData.selectedResources.includes(res._id)}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 accent-teal-600"
              />
              <label
                htmlFor={`res-${res._id}`}
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                {res.name} ({res.type}) —{' '}
                <strong className="text-gray-900 dark:text-white">
                  {res.price.toLocaleString()} XAF
                </strong>
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default ResourceSearchLibrary;
