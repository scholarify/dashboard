"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarButtonProps {
  icon: any;
  name: string;
  href: string;
}

const SidebarButton = ({ icon: Icon, name, href }: SidebarButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href); 

  return (
    <Link
      href={href}
      className={`text-sm flex items-center w-full px-4 py-2 rounded-lg transition-all 
                 hover:text-background hover:bg-foreground hover:shadow-lg
                 ${isActive ? "bg-foreground bg- text-background shadow-lg" : "text-foreground"}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>{name}</span>
    </Link>
  );
};

export default SidebarButton;
