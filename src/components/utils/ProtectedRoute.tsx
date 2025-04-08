"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import CircularLoader from "../widgets/CircularLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, setRedirectAfterLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Stocker l'URL actuelle pour rediriger après la connexion
      setRedirectAfterLogin(pathname);
      router.push("/login");
    }
  }, [loading, isAuthenticated, router, pathname, setRedirectAfterLogin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
        <CircularLoader size={40} color="teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection est gérée par useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;