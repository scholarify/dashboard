"use client";

export default function Home() {
  setTimeout(() => {
    window.location.href = '/login';
  }, 3000);
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col justify-center max-w-[600px] mx-auto  dark:bg-gray-900 dark:text-white h-screen items-center">
        <img src="/assets/logo.png" alt="" srcSet="" />
      </div>
    </div>
  );
}
