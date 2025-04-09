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
          className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="+237">CMR +237</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+33">🇫🇷 +33</option>
          <option value="+1">🇺🇸 +1</option>
        </select>
        <input
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="000 000 0000"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal"
          required={required}
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;