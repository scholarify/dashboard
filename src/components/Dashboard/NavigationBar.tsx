"use client";
import React, { useEffect, useState } from "react";
import SearchBox from "../widgets/SearchBox";
import { Bell, Settings, Home, Menu, X } from "lucide-react";
import DarkModeToggle from "../widgets/DarkMode";
import AvatarImage from "../widgets/AvatarImage";
import Breadcrumbs from './BreadCrums'
import UserMenuModal from "../widgets/UserMenuModal";
import useAuth from "@/app/hooks/useAuth";

interface NavigationBarProps {
  icon: any;
  baseHref: string;
  title: string;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void; // Optional function to toggle sidebar
  onLogout: () => void
}
export default function NavigationBar({ icon: Icon, baseHref, title, toggleSidebar, isSidebarOpen, onLogout }: NavigationBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {user,logout} = useAuth();
  // Vérifier le thème au chargement
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Basculer entre mode clair et sombre
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Gérer la déconnexion
  const handleSignOut = () => {
    onLogout();
  };
  return (
    <div className="w-full flex items-center justify-between p-4 bg-glassy">
      {/* Mobile Sidebar Toggle */}
      <button
        id="mobile-sidebar-toggle"
        className="lg:hidden p-2  text-foreground rounded-lg  top-4 left-4 z-30"
        onClick={() => toggleSidebar && toggleSidebar()}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className="hidden lg:flex flex-col gap-2">
        <Breadcrumbs baseHref={baseHref} icon={Icon} />
        <p className="text-2xl font-semibold text-foreground">{title}</p>
      </div>

      {/* Right: Actions (Search, Notifications, Dark Mode, Settings, Profile) */}
      <div className="flex items-center gap-2">
        <SearchBox />

        <button className="hidden lg:flex p-2 text-gray-600 dark:text-gray-300 hover:text-foreground transition">
          <Bell className="w-6 h-6" />
        </button>
        <UserMenuModal
          avatarUrl={user?.avatar || "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"}
          userName= {user?.name || ""}
          onSignOut={logout}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
