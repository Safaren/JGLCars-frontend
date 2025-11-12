const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ✅ Obtener token CSRF almacenado en localStorage
function getCsrfHeader() {
  if (typeof window === "undefined") return {};
  const csrf = localStorage.getItem("csrfToken");
  return csrf ? { "X-CSRF-Token": csrf } : {};
}

// ✅ Interceptor: si el accessToken expira → refrescar y reintentar
async function fetchWithRefresh(url: string, options: any) {
  const res = await fetch(url, { ...options, credentials: "include" });

  // Si expiró el accessToken, pedimos uno nuevo automáticamente
  if (res.status === 401) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      // Reintentar la petición original
      return fetch(url, { ...options, credentials: "include" });
    }
  }

  return res;
}

// ✅ GET coches (público)
export async function getCars() {
  const res = await fetch(`${API_URL}/cars`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener coches");
  return res.json();
}

// ✅ Crear coche
export async function addCar(carData: any) {
  const res = await fetchWithRefresh(`${API_URL}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(carData),
  });

  if (!res.ok) throw new Error("Error al crear coche");
  return res.json();
}

// ✅ Actualizar coche
export async function updateCar(id: number, carData: any) {
  const res = await fetchWithRefresh(`${API_URL}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(carData),
  });

  if (!res.ok) throw new Error("Error al actualizar coche");
  return res.json();
}

// ✅ Eliminar coche
export async function deleteCar(id: number) {
  const res = await fetchWithRefresh(`${API_URL}/cars/${id}`, {
    method: "DELETE",
    headers: { ...getCsrfHeader() },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al eliminar coche");
  return res.json();
}

// ✅ PIEZAS
export async function getPiezas() {
  const res = await fetch(`${API_URL}/piezas`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener piezas");
  return res.json();
}

export async function addPieza(data: any) {
  const res = await fetchWithRefresh(`${API_URL}/piezas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear pieza");
  return res.json();
}

export async function updatePieza(id: number, data: any) {
  const res = await fetchWithRefresh(`${API_URL}/piezas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar pieza");
  return res.json();
}

export async function deletePieza(id: number) {
  const res = await fetchWithRefresh(`${API_URL}/piezas/${id}`, {
    method: "DELETE",
    headers: { ...getCsrfHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar pieza");
  return res.json();
}