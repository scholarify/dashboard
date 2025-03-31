"use client"; // Nécessaire si utilisé dans un contexte avec des hooks comme onChange

import { ChangeEvent, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixIcon?: React.ReactNode; // Pour passer une icône SVG ou autre
  error?: string; // Pour afficher un message d'erreur
}

export default function Input({
  label,
  prefixIcon,
  error,
  type = "text",
  className = "",
  onChange,
  ...props
}: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {prefixIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            {prefixIcon}
          </span>
        )}
        <input
          type={type}
          onChange={handleChange}
          className={`w-full ${prefixIcon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-[20px] focus:outline-none focus:ring-1 focus:ring-[#17B890] dark:bg-gray-900 dark:text-white text-gray-700 ${
            error ? 'border-red-500' : 'dark:border-gray-500 border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}