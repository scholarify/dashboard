"use client";
import Link from "next/link";

interface SidebarButtonProps {
  icon: any;
  name: string;
  href: string;
}

const SidebarButton = ({ icon: Icon, name, href }: SidebarButtonProps) => {
  return (
    <Link
      href={href}
      className="text-sm flex items-center w-full px-4 py-2 rounded-lg transition-all 
                 text-foreground hover:text-background 
                 hover:bg-foreground hover:shadow-lg"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="">{name}</span>
    </Link>
  );
};

export default SidebarButton;
