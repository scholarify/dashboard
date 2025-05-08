import React from "react";

interface CustomPhoneInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryCode: string;
  onCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean; // Assuming you want to keep it enabled; change as needed
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  required = false,
  disabled = false, // Assuming you want to keep it enabled; change as needed
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <select
          value={countryCode}
          onChange={onCountryCodeChange}
          disabled={disabled}
          className={`appearance-none py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal
            ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50' : 'bg-transparent'}`}
        >
          <option value="+237" className="text-sm">🇨🇲 +237</option> {/* Adjusted CMR */}
          <option value="+44" className="text-sm">🇬🇧 +44</option>
          <option value="+33" className="text-sm">🇫🇷 +33</option>
          <option value="+1" className="text-sm">🇺🇸 +1</option>
        </select>
        <input
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="000 000 0000"
          className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal
            ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50' : ''}`}
          required={required}
          disabled={disabled} // Assuming you want to keep it enabled; change as needed
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;