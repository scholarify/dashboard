"use client";
import React, { useState } from "react";
import Divider from "../widgets/Divider";
import SearchBox from "../widgets/SearchBox";
import SidebarButton from "./SideNavButton";
import Avatar from "./Avatar";
import Logo from "../widgets/Logo";
import GoPro from "./GoPro";
import NavigationBar from "./NavigationBar";
import { Menu, X } from "lucide-react";

interface SidebarNavItem {
  icon: React.ElementType;
  name: string;
  href: string;
}

interface DashboardLayoutProps {
  sidebarNav: SidebarNavItem[]; // Array of sidebar items
  settingsLink: SidebarNavItem; // Settings button
  navigation: {
    icon: React.ElementType;
    baseHref: string;
    title:string;
  };
  showGoPro?: boolean; // Toggle for GoPro component
  onLogout: () => void; // Logout function
  children: React.ReactNode; // Page content
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarNav,
  settingsLink,
  navigation,
  showGoPro = true,
  onLogout,
  children,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const avatar = {
        avatarUrl: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
        name: "John Doe",
        role: "Super Admin"
      };

  return (
    <div className="flex h-screen p-4">

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden p-2 bg-foreground text-background rounded-lg fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div      className={`flex w-[290px] flex-col h-full border border-stroke p-2 rounded-lg fixed inset-y-0 left-0 z-40 bg-background transition-transform md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-2 my-4">
            <Logo />
            <Divider />
          </div>

          <SearchBox />
          <div className="flex flex-col gap-1">
            {sidebarNav.map((item) => (
              <SidebarButton key={item.name} icon={item.icon} name={item.name} href={item.href} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3">
          {showGoPro && <GoPro visible />}
          <SidebarButton icon={settingsLink.icon} name={settingsLink.name} href={settingsLink.href} />
          <Divider />
          <Avatar avatarUrl={avatar.avatarUrl} name={avatar.name} role={avatar.role} onLogout={onLogout} />
        </div>

      </div>

      {/* Main Content */}
      <div className="px-6 py-2 w-full">
        <NavigationBar icon={navigation.icon} baseHref={navigation.baseHref} title={navigation.title} onLogout={onLogout}/>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
