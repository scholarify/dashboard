"use client"; // Nécessaire si utilisé dans un contexte avec des hooks comme onChange

import { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          type={isPassword ? (showPassword ? "text" : "password") : type}
          onChange={handleChange}
          className={`w-full ${prefixIcon ? 'pl-10' : 'pl-3'} ${isPassword ? 'pr-12' : 'pr-3'} py-2 border rounded-[20px] focus:outline-none focus:ring-1 focus:ring-[#17B890] dark:bg-gray-900 dark:text-white text-gray-700 ${
            error ? 'border-red-500' : 'dark:border-gray-500 border-gray-300'
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {/* Séparateur vertical */}
            <div className="h-[60%] w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

            {/* Bouton pour afficher/masquer le mot de passe */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="pr-3 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              )}
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}