
// src/app/layout.tsx

import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-500 min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
          <Toaster
  position="top-center"
  toastOptions={{
    duration: 2000, // 2 segundos
    style: {
      fontSize: "18px",
      padding: "14px 20px",
      textAlign: "center",
    }
  }}
/>
      </body>
    </html>
  );
}
