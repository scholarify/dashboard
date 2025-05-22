"use client";
import React, { useState } from "react";
import { Wallet, School, Users, LayoutDashboard, Presentation, GraduationCap, Settings, BookOpen, DollarSign, UserPlus } from "lucide-react";
import Divider from "../../widgets/Divider";
import SearchBox from "../../widgets/SearchBox";
import SidebarButton from "../SideNavButton";
import Avatar from "../Avatar";
import Logo from "../../widgets/Logo";
import GoPro from "../GoPro";
import NavigationBar from "../NavigationBar";
import { Menu, X } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

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

const SchoolLayout: React.FC<DashboardLayoutProps> = ({
  navigation,
  showGoPro = true,
  onLogout,
  children,
}) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const avatar = {
    avatarUrl: user?.avatar || "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
    name: user?.name || "School Admin",
    role: user?.role || "admin",
  };
  const BASE_URL = "/school-admin";

  const sidebarNav = [
    { icon: LayoutDashboard, name: "Dashboard", href: `${BASE_URL}/dashboard` },
    { icon: School, name: "School", href: `${BASE_URL}/school` },
    { icon: Presentation, name: "Classes", href: `${BASE_URL}/classes` },
    { icon: GraduationCap, name: "Students", href: `${BASE_URL}/students` },
    { icon: Users, name: "Teachers", href: `${BASE_URL}/teachers` },
    { icon: BookOpen, name: "Resources", href: `${BASE_URL}/resources` },
    { icon: DollarSign, name: "Fees", href: `${BASE_URL}/fees` },
    { icon: UserPlus, name: "Parents", href: `${BASE_URL}/parents` },
  ];
    const settingsLink = {
    icon: Settings,
    name: "Settings",
    href: `${BASE_URL}/settings`
    };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden sm:p-4">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 bg-foreground text-background rounded-lg fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`flex w-[290px] flex-col h-full border border-stroke p-2 rounded-lg fixed inset-y-0 left-0 z-40 bg-background transition-transform md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            {showGoPro && <GoPro visible />}
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

        {/* Main Content */}
        <div className="px-6 py-2 w-full">
          <NavigationBar
            icon={navigation.icon}
            baseHref={navigation.baseHref}
            title={navigation.title}
            onLogout={onLogout}
          />
          <div>{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SchoolLayout;
