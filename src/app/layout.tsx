import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

// SEO global
import { metadata } from "./metadata";
export { metadata };

// Client wrapper (no requiere "use client" aquí)
import ClientWrapper from "./ClientWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>

      <body className="bg-gray-500 min-h-screen flex flex-col text-gray-900 antialiased">

        {/* 🔥 Client-side features (token refresher, toast, etc.) */}
        <ClientWrapper>

          <AuthProvider>
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                fontSize: "18px",
                padding: "14px 20px",
                textAlign: "center",
              },
            }}
          />

        </ClientWrapper>

      </body>
    </html>
  );
}
