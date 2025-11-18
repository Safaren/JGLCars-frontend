import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
  openGraph: defaultMetadata.openGraph,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        
        {/* NAVBAR GLOBAL */}
        <NavBar />

        {/* CONTENIDO */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        {/* FOOTER GLOBAL */}
        <Footer />
      </body>
    </html>
  );
}
