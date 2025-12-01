// lib/api.ts
// API Client con cookies httpOnly — Next.js App Router friendly

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  console.warn("NEXT_PUBLIC_API_URL no está definida. Asegúrate de tenerla en .env");
}

type Opts = RequestInit & { _internal?: boolean };

async function request(url: string, options: Opts = {}) {
  const finalOpts: RequestInit = {
    credentials: "include",
    mode: "cors",
    cache: "no-store",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, finalOpts);

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {
      try {
        msg = await res.text();
      } catch {}
    }
    throw new Error(msg);
  }

  // Intenta parsear JSON, si no -> devuelve null
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// --------------------------------------------------
// Endpoints (usar API que ya contiene /api en tu env)
// --------------------------------------------------

export async function getCars() {
  return await request(`${API}/cars`);
}

export async function getCar(id: number) {
  return await request(`${API}/cars/${id}`);
}

export async function addCar(data: any) {
  return await request(`${API}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCar(id: number, data: any) {
  return await request(`${API}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCar(id: number) {
  return await request(`${API}/cars/${id}`, {
    method: "DELETE",
  });
}

// Carrusel / fotos

export async function updateCarrusel(id: number, data: any) {
  return await request(`${API}/cars/carrusel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function reorderImages(id: number, orderedImages: string[]) {
  return await request(`${API}/fotos-car/reorder/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedImages }),
  });
}

export async function uploadImages(id: number, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  // No ponemos Content-Type (fetch lo gestiona). Mantenemos credentials/mode/cache.
  const res = await fetch(`${API}/fotos-car/${id}`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    cache: "no-store",
    body: fd,
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {
      try {
        msg = await res.text();
      } catch {}
    }
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}
