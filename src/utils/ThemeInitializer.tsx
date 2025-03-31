"use client";
import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null; // This component only runs once to apply theme
}
