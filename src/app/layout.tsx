
// src/app/layout.tsx

import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
