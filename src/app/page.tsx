"use client";

import ProtectedRoute from "@/components/utils/ProtectedRoute";
import CircularLoader from "@/components/widgets/CircularLoader";
import { useRouter } from "next/navigation";
import useAuth from "./hooks/useAuth";


export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  if (!isAuthenticated && !loading) {
    setTimeout(() => {
      router.push("/login");  
    }, 3000);
  }
  setTimeout(() => {
    router.push("/super-admin/dashboard");
  }, 3000);
  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <div className="flex flex-col justify-center max-w-[600px] mx-auto  dark:bg-gray-900 dark:text-white h-screen items-center">
          <img src="/assets/logo.png" alt="" srcSet="" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to the Dashboard</h1>
        <div className="flex justify-center items-center h-auto w-full  top-0 left-0 z-50 p-5">
            <CircularLoader size={32} color="teal" />
          </div>
      </div>
    </ProtectedRoute>
  );
}
