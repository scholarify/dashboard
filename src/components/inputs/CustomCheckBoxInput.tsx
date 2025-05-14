import React from "react";

interface CustomCheckboxInputProps {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const CustomCheckboxInput: React.FC<CustomCheckboxInputProps> = ({
  label,
  id,
  name,
  checked,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        className="h-4 w-4 text-teal-600 focus:ring-teal border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
  );
};

export default CustomCheckboxInput;
