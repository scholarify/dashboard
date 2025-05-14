import React, { useEffect, useRef, useState } from "react";

const NATIONALITIES = ["Cameroonian", "Nigerian", "Ghanaian", "Kenyan"];

interface Props {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export default function NationalitySelect({
  value,
  onChange,
  defaultValue = "Cameroonian",
}: Props) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState(NATIONALITIES);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value || defaultValue);
  }, [value, defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    const filtered = NATIONALITIES.filter((n) =>
      n.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setShowDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nationality
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Select or type nationality"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-sm max-h-40 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(option)} // ← Works before blur fires
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
