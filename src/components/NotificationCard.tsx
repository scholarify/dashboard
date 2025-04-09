"use client"; // Nécessaire car on utilise une fonction onClose (interactivité côté client)

import React from 'react';

interface NotificationCardProps {
  title: string;
  message: string;
  icon: React.ReactNode;
  type: string; // "success", "error", "info", "warning"
  isVisible: boolean;
  isFixed?: boolean
  onClose: () => void;
}

export default function NotificationCard({
  title,
  message,
  icon,
  type,
  isVisible,
  isFixed,
  onClose,
}: NotificationCardProps) {
  // Si la notification n'est pas visible, on ne rend rien
  if (!isVisible) return null;

  // Déterminer les styles en fonction du type de notification
  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };
  

  const typeStyle = typeStyles[type as keyof typeof typeStyles] || typeStyles.info; // Par défaut, "info"
  setTimeout(() => {
    onClose();
  }, 5000);
  return (
    <div
      className={`mb-4 top-4 right-4  w-full p-4 rounded-lg  shadow-lg border-l-4 ${typeStyle} flex items-start space-x-3 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
        } ${isFixed ? 'fixed max-w-sm z-50' : ''}`}
    >
      {/* Icône */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Contenu */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>

      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
