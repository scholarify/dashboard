import React from "react";

interface CustomInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean; // Assuming you want to keep it enabled; change as needed
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
  disabled = false, // Assuming you want to keep it enabled; change as needed
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal 
          ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50' : ''} 
          ${className}`}        
        required={required}
        disabled={disabled} // Assuming you want to keep it enabled; change as needed
      />
    </div>
  );
};

export default CustomInput;