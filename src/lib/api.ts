// lib/api.ts
// =======================================================
// API Client basado al 100% en cookies httpOnly
// SIN localStorage
// SIN Authorization headers
// compatible con Next.js 16 + Turbopack
// =======================================================

const API = process.env.NEXT_PUBLIC_API_URL;

// ------------------------------------------
// Helper de peticiones con cookies y JSON
// ------------------------------------------
async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // 🔥 clave para enviar cookies httpOnly
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ------------------------------------------
// GET TODOS LOS COCHES
// ------------------------------------------
export async function getCars() {
  return await request(`${API}/cars`);
}

// ------------------------------------------
// GET UN COCHE POR ID
// ------------------------------------------
export async function getCar(id: number) {
  return await request(`${API}/cars/${id}`);
}

// ------------------------------------------
// CREAR COCHE
// ------------------------------------------
export async function addCar(data: any) {
  return await request(`${API}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ------------------------------------------
// ACTUALIZAR COCHE
// ------------------------------------------
export async function updateCar(id: number, data: any) {
  return await request(`${API}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ------------------------------------------
// ELIMINAR COCHE
// ------------------------------------------
export async function deleteCar(id: number) {
  return await request(`${API}/cars/${id}`, {
    method: "DELETE",
  });
}

// =======================================================
// FOTOS Y CARRUSEL
// =======================================================

// ACTUALIZAR CONFIGURACIÓN DEL CARRUSEL
export async function updateCarrusel(id: number, data: any) {
  return await request(`${API}/cars/carrusel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// REORDENAR FOTOS
export async function reorderImages(id: number, orderedImages: string[]) {
  return await request(`${API}/fotos-car/reorder/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedImages }),
  });
}

// SUBIR FOTOS
export async function uploadImages(id: number, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  return await fetch(`${API}/fotos-car/${id}`, {
    method: "POST",
    credentials: "include", // 🔥 enviar cookies
    body: fd,
  });
}
