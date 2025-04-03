"use client";
import React, { useState } from "react";
import { Wallet, School, Users, LayoutDashboard, Presentation, GraduationCap, Settings } from "lucide-react";
import Divider from "../../widgets/Divider";
import SearchBox from "../../widgets/SearchBox";
import SidebarButton from "../SideNavButton";
import Avatar from "../Avatar";
import Logo from "../../widgets/Logo";
import GoPro from "../GoPro";
import NavigationBar from "../NavigationBar";
import { Menu, X } from "lucide-react";
import Breadcrumbs from "../BreadCrums";

interface DashboardLayoutProps {
  navigation: {
    icon: React.ElementType;
    baseHref: string;
    title: string;
  };
  showGoPro?: boolean;
  onLogout: () => void;
  children: React.ReactNode;
}

const SuperLayout: React.FC<DashboardLayoutProps> = ({
  navigation,
  showGoPro = true,
  onLogout,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const avatar = {
    avatarUrl:
      "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    name: "John Doe",
    role: "Super Admin",
  };
  const BASE_URL = "/super-admin";

  const sidebarNav = [
    { icon: LayoutDashboard, name: "Dashboard", href: `${BASE_URL}/dashboard` },
    { icon: School, name: "Schools", href: `${BASE_URL}/schools` },
    { icon: Users, name: "Users", href: `${BASE_URL}/users` },
    { icon: Wallet, name: "Subscription", href: `${BASE_URL}/subscription` },
    { icon: Presentation, name: "Classes", href: `${BASE_URL}/classes` },
    { icon: GraduationCap, name: "Students", href: `${BASE_URL}/students` },
  ];
    const settingsLink = { 
    icon: Settings, 
    name: "Settings", 
    href: `${BASE_URL}/settings` 
    };


  return (
    <div className="flex h-screen sm:p-4">
      
      {/* Sidebar */}
      <div
        className={`flex w-[290px] flex-col h-full border border-stroke shadow-md shadow-foreground p-2 rounded-lg fixed inset-y-0 left-0 z-40 bg-background transition-transform lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-3 overflow-auto">
          <div className="flex flex-col items-center gap-2 my-4">
            <Logo />
            <Divider />
          </div>

          <SearchBox />
          <div className="flex flex-col gap-1">
            {sidebarNav.map((item) => (
              <SidebarButton
                key={item.name}
                icon={item.icon}
                name={item.name}
                href={item.href}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3">
          {showGoPro && <GoPro visible={false} />}
          <SidebarButton
            icon={settingsLink.icon}
            name={settingsLink.name}
            href={settingsLink.href}
          />
          <Divider />
          <Avatar
            avatarUrl={avatar.avatarUrl}
            name={avatar.name}
            role={avatar.role}
            onLogout={onLogout}
          />
        </div>
      </div>
      {/* overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black  z-30 transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none z-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      {/* Main Content */}
      <div className="sm:px-6 px-2 py-2 w-full flex flex-col gap-4 ">
        <NavigationBar
          icon={navigation.icon}
          baseHref={navigation.baseHref}
          title={navigation.title}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex lg:hidden flex-col gap-2">
          <Breadcrumbs baseHref={navigation.baseHref} icon={navigation.icon} />
          <p className="text-2xl font-semibold text-foreground">{navigation.title}</p>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default SuperLayout;
