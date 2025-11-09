const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getCars() {
  const res = await fetch(`${API_URL}/cars`);
  if (!res.ok) throw new Error("Error al obtener coches");
  return res.json();
}

export async function getCarById(id: number) {
  const res = await fetch(`${API_URL}/cars/${id}`);
  if (!res.ok) throw new Error("Error al obtener el coche");
  return res.json();
}
