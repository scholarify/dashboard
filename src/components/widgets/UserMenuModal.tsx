"use client";

import React, { use, useEffect, useState } from "react";
import { Sun, Moon, LogOut, Monitor, Settings } from "lucide-react";
import DarkModeToggle from "./DarkMode";

interface UserMenuModalProps {
    avatarUrl?: string;
    userName: string;
    onSignOut: () => void;
    onToggleTheme: () => void;
    isDarkMode: boolean;
}

const UserMenuModal: React.FC<UserMenuModalProps> = ({
    avatarUrl,
    userName,
    onSignOut,
    onToggleTheme,
    isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  // Fermer le modal lorsque l'utilisateur clique en dehors
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      setIsOpen(false);
    }
  };


  return (
    <div className="relative">
      {/* Avatar (bouton pour ouvrir le modal) */}
      <button
        onClick={toggleModal}
        className="flex items-center space-x-2 focus:outline-none w-max"
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
          {avatarUrl?
          <img src={avatarUrl} alt={userName} className="w-full h-full rounded-full object-fit" />
          : userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-foreground">{userName}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-100 text-gray-800 ring-white dark:bg-gray-800 dark:text-white ring-1 dark:ring-black ring-opacity-5 z-50"
            onMouseLeave={handleClickOutside}
        >
          <div className="py-1">
            {/* Nom de l'utilisateur */}
            <div className="px-4 py-2 text-sm border-b dark:border-gray-700 border-gray-300">
              {userName}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between px-1  py-1 text-sm  border-b dark:border-gray-700 border-gray-300">
                <DarkModeToggle>
                </DarkModeToggle>
            </div>

            

            <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer">
              <span>Settings</span>
              <Settings size={20} />
            </div>

            <div
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer border-t dark:border-gray-700 border-gray-300"
            >
              <LogOut size={16} className="mr-2" />
              <span>Sign out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuModal;