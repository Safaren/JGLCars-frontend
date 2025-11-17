

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://jlgcars-api.onrender.com/api";

export interface Imagen {
  id: number;
  url: string;
  carId: number;
}

export interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  color: string;
  combustible: string;
  anoFabricacion: number;
  imagenes?: Imagen[];
}

export async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${API_URL}/cars`, {
      // ❗ Los Server Components NO mandan cookies
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("❌ Error API getCars:", res.status);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("❌ Error getCars:", err);
    return [];
  }
}

