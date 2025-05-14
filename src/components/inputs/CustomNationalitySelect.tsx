import React, { useEffect, useRef, useState } from "react";

const NATIONALITIES = ["Cameroonian", "Nigerian", "Ghanaian", "Kenyan"];

interface CustomNationalitySelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const CustomNationalitySelect: React.FC<CustomNationalitySelectProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(NATIONALITIES);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const emitChange = (val: string) => {
    const syntheticEvent = {
      target: {
        name,
        value: val,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    emitChange(val);

    const filtered = NATIONALITIES.filter((n) =>
      n.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    emitChange(option);
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
    <div ref={containerRef} className={`mb-4 relative ${className}`}>
      <label htmlFor={id} className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Select or type nationality"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
        required={required}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-sm max-h-40 overflow-auto custom-scrollbar">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomNationalitySelect;
