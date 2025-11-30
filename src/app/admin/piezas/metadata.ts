import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gestión de Piezas | Panel Admin",
    description: "Administración de piezas y partes de vehículos.",
  };
}
