"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  baseLabel?: string; // Default: "Home"
  baseHref?: string; // Default: "/"
  icon?: React.ElementType; // Optional custom icon for base
  className?: string; // Custom styles for breadcrumbs
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  baseHref = "/",
  icon: Icon,
  className = "",
}) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Skip the first segment (e.g., "super-admin")
  const adjustedSegments = pathSegments.slice(1);

  return (
    <nav className={`flex items-center text-sm text-gray-600 dark:text-gray-300 ${className} p-2 border border-gray-300 rounded-md`}>
      {/* Base Link */}
      <Link href={baseHref} className="flex items-center gap-1 text-foreground transition">
        {Icon && <Icon className="w-4 h-4" />}
      </Link>

      {/* Dynamic Segments */}
      {adjustedSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 2).join("/");

        return (
          <span key={href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-foreground" />
            <Link href={href} className="capitalize text-foreground transition border border-foreground rounded-full p-1">
              {decodeURIComponent(segment)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
