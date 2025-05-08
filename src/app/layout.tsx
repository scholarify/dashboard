import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import ThemeInitializer from "@/utils/ThemeInitializer";
import { AuthProvider } from "./services/AuthContext";

export const metadata: Metadata = {
  title: "Scholarify Admin",
  description: "Admin dashboard for Scholarify",
};
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "700"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bricolage.className}>
        <ThemeInitializer />
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
