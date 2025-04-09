import React from "react";

interface CustomTextareaProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  rows = 3,
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal ${className}`}
      />
    </div>
  );
};

export default CustomTextarea;