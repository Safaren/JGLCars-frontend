// lib/api.ts
// ==========================================
// API CLIENT con TOKEN SEGURO (Next.js 16 / Turbopack compatible)
// ==========================================

const API = process.env.NEXT_PUBLIC_API_URL;

// ------------------------------------------
// Lee token de forma segura (solo si existe)
// ------------------------------------------
function getLocalToken() {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
  } catch {}

  return null;
}

// ------------------------------------------
// Headers con token automático (fallback)
// ------------------------------------------
function authHeaders(extra: Record<string, any> = {}) {
  const token = getLocalToken();

  return {
    Authorization: token ? `Bearer ${token}` : "",
    ...extra,
  };
}

// ------------------------------------------
// Helper para peticiones
// ------------------------------------------
async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ==========================================
//   AHORA LAS FUNCIONES ACEPTAN TOKEN OPCIONAL
//   (si no lo envías, usa authHeaders() auto)
// ==========================================

// ------------------------------------------
// GET ALL CARS
// ------------------------------------------
export async function getCars(token?: string) {
  return await request(`${API}/cars`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : authHeaders(),
  });
}

// ------------------------------------------
// GET ONE CAR
// ------------------------------------------
export async function getCar(id: number, token?: string) {
  return await request(`${API}/cars/${id}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : authHeaders(),
  });
}

// ------------------------------------------
// ADD CAR
// ------------------------------------------
export async function addCar(data: any, token?: string) {
  return await request(`${API}/cars`, {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : authHeaders({ "Content-Type": "application/json" }),

    body: JSON.stringify(data),
  });
}

// ------------------------------------------
// UPDATE CAR
// ------------------------------------------
export async function updateCar(id: number, data: any, token?: string) {
  return await request(`${API}/cars/${id}`, {
    method: "PUT",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : authHeaders({ "Content-Type": "application/json" }),

    body: JSON.stringify(data),
  });
}

// ------------------------------------------
// DELETE CAR
// ------------------------------------------
export async function deleteCar(id: number, token?: string) {
  return await request(`${API}/cars/${id}`, {
    method: "DELETE",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : authHeaders(),
  });
}

// ==========================================
//  CONFIGURACIÓN CARRUSEL Y FOTOS
// ==========================================

// UPDATE CARRUSEL
export async function updateCarrusel(id: number, data: any, token?: string) {
  return await request(`${API}/cars/carrusel/${id}`, {
    method: "PUT",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : authHeaders({ "Content-Type": "application/json" }),

    body: JSON.stringify(data),
  });
}

// REORDENAR FOTOS
export async function reorderImages(id: number, orderedImages: string[], token?: string) {
  return await request(`${API}/fotos-car/reorder/${id}`, {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : authHeaders({ "Content-Type": "application/json" }),

    body: JSON.stringify({ orderedImages }),
  });
}

// SUBIR FOTOS NUEVAS
export async function uploadImages(id: number, files: File[], token?: string) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  return await fetch(`${API}/fotos-car/${id}`, {
    method: "POST",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : authHeaders(),

    body: fd,
  });
}
