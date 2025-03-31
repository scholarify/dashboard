"use client";
import React from "react";
import SearchBox from "../widgets/SearchBox";
import { Bell, Settings } from "lucide-react";
import DarkModeToggle from "../widgets/DarkMode";
import AvatarImage from "../widgets/AvatarImage";

export default function NavigationBar() {
  return (
    <div className="w-full flex items-center justify-between">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 dark:text-gray-400">Breadcrumbs</p>
        <p className="text-lg font-semibold text-foreground">Dashboard</p>
      </div>

      {/* Right: Actions (Search, Notifications, Dark Mode, Settings, Profile) */}
      <div className="flex items-center gap-2">
        <SearchBox />

        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-foreground transition">
          <Bell className="w-6 h-6" />
        </button>

        <DarkModeToggle />

        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-foreground transition">
          <Settings className="w-6 h-6" />
        </button>

        <button>
            <AvatarImage
            src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
            />
        </button>

      </div>
    </div>
  );
}
