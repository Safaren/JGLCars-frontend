// src/lib/apiServer.ts

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ───────────────────────────────
// TIPOS
// ───────────────────────────────
export interface Imagen {
  id: number;
  url: string;
  carId: number;
}

export interface Car {
  id: number;
  marca: string;
  model: string;
  consumo: number;
  combustible: string;
  anoFabricacion: number;
  cilindrada: number;
  precio: number;
  potencia: number;
  color: string;
  matricula: string;
  tipoVenta: "COCHE" | "PIEZAS";
  imagenes?: Imagen[];
}

// ───────────────────────────────
// GET — SIN AUTENTICACIÓN
// ───────────────────────────────

export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${API}/cars`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getCarById(id: number): Promise<Car | null> {
  const res = await fetch(`${API}/cars/${id}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;

  return res.json();
}
