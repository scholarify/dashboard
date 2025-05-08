"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  baseLabel?: string;
  baseHref?: string;
  icon?: React.ElementType;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  baseHref = "/",
  icon: Icon,
  className = "",
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathSegments = pathname.split("/").filter(Boolean);
  const adjustedSegments = pathSegments.slice(1); // Skip first if needed

  const queryString = searchParams.toString();
  const query = queryString ? `?${queryString}` : "";

  return (
    <nav
      className={`flex items-center text-sm text-gray-600 dark:text-gray-300 ${className} p-2 border border-gray-300 rounded-md w-max`}
    >
      <Link
        href={`${baseHref}${query}`}
        className="flex items-center gap-1 text-foreground transition"
      >
        {Icon && <Icon className="w-4 h-4" />}
      </Link>

      {adjustedSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 2).join("/") + query;

        return (
          <span key={href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-foreground" />
            <Link
              href={href}
              className="capitalize text-foreground transition border border-foreground rounded-full p-1"
            >
              {decodeURIComponent(segment)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
