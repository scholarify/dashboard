"use client";
import React from "react";
import SearchBox from "../widgets/SearchBox";
import { Bell, Settings, Home } from "lucide-react";
import DarkModeToggle from "../widgets/DarkMode";
import AvatarImage from "../widgets/AvatarImage";
import Breadcrumbs from './BreadCrums'

interface NavigationBarProps {
  icon: any;
  baseHref: string;
  title: string;
}
export default function NavigationBar({ icon: Icon, baseHref, title }: NavigationBarProps) {
  return (
    <div className="w-full justify-center flex items-center md:justify-between">
      
      <div className="flex flex-col gap-2">
        <Breadcrumbs baseHref={baseHref} icon={Icon} />
        <p className="text-2xl font-semibold text-foreground">{title}</p>
      </div>

      {/* Right: Actions (Search, Notifications, Dark Mode, Settings, Profile) */}
      <div className="flex items-center gap-2">
        <SearchBox />

        <button className="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-foreground transition">
          <Bell className="w-6 h-6" />
        </button>

        <DarkModeToggle />

        <button className="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-foreground transition">
          <Settings className="w-6 h-6" />
        </button>

        <button className="hidden md:flex">
            <AvatarImage
            src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
            />
        </button>

      </div>
    </div>
  );
}
