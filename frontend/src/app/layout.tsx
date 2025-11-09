import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "JLGCars | Coches de Ocasión",
  description: "Concesionario de coches de segunda mano y piezas - JLGCars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-20 max-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
