"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

interface DarkModeToggleProps {
  children?: React.ReactNode;
}

type Theme = "light" | "dark" | "system";

const DarkModeToggle = ({ children }: DarkModeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("system");

  // Appliquer le thème au chargement
  useEffect(() => {
    // Vérifier la préférence sauvegardée dans localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Par défaut, utiliser le mode système
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme("system");
      applyTheme(systemTheme);
    }
  }, []);

  // Fonction pour appliquer le thème
  const applyTheme = (themeToApply: Theme | "light" | "dark") => {
    if (themeToApply === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Gérer le clic sur le bouton Light (Sun)
  const handleLightMode = () => {
    setTheme("light");
    applyTheme("light");
    localStorage.setItem("theme", "light");
  };

  // Gérer le clic sur le bouton Dark (Moon)
  const handleDarkMode = () => {
    setTheme("dark");
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  };

  // Gérer le clic sur le bouton System (Monitor)
  const handleSystemMode = () => {
    setTheme("system");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme = prefersDark ? "dark" : "light";
    applyTheme(systemTheme);
    localStorage.setItem("theme", "system");
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {children}
      {/* Bouton Light (Sun) */}
      <button
        onClick={handleLightMode}
        className={`flex  transition-all cursor-pointer w-1/3 justify-center py-2 rounded-[8px] ${
          theme === "light"
            ? "bg-gray-300 dark:bg-gray-600"
            : "hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <Sun />
      </button>

      {/* Bouton Dark (Moon) */}
      <button
        onClick={handleDarkMode}
        className={`flex  transition-all cursor-pointer w-1/3 justify-center py-2 rounded-[8px] ${
          theme === "dark"
            ? "bg-gray-300 dark:bg-gray-600"
            : "hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <Moon />
      </button>

      {/* Bouton System (Monitor) */}
      <button
        onClick={handleSystemMode}
        className={`flex transition-all cursor-pointer w-1/3 justify-center py-2 rounded-[8px] ${
          theme === "system"
            ? "bg-gray-300 dark:bg-gray-600"
            : "hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <Monitor />
      </button>
    </div>
  );
};

export default DarkModeToggle;