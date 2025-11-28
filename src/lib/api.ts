"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
console.log("🔥 FRONTEND API BASE:", API);

/* ============================================================
   FUNCION PARA DETECTAR RUTAS PROTEGIDAS
============================================================ */
function isProtected(method: string, path: string) {
  // Rutas públicas
  if (method === "GET" && path.startsWith("/cars")) return false;
  if (method === "GET" && path.startsWith("/piezas")) return false;

  // Todo lo demás es privado
  return true;
}

/* ============================================================
   FETCH BASE PRO — SIEMPRE DEVUELVE JSON Y TOKEN CUANDO TOCA
============================================================ */
async function apiFetch(path: string, options: any = {}) {
  const url = `${API}${path}`;
  const method = options.method || "GET";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Determinar si la ruta es privada
  const protectedRequest =
    options.protected === true || isProtected(method, path);

  const res = await fetch(url, {
    ...options,
    credentials: protectedRequest ? "include" : "omit",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      ...(protectedRequest && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  const text = await res.text();
  let json;

  try {
    json = JSON.parse(text);
  } catch {
    console.error("❌ backend devolvió HTML:", text);
    throw new Error("Error CORS o el servidor no devolvió JSON válido");
  }

  if (!res.ok) {
    console.error("❌ ERROR API", json);
    throw new Error(json.error || "Error API");
  }

  return json;
}

/* ============================================================
   AUTH
============================================================ */
export async function login(email: string, password: string) {
  return apiFetch(`/auth/login`, {
    method: "POST",
    protected: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/* ============================================================
   COCHES
============================================================ */
export async function getCars() {
  return apiFetch(`/cars`, {
    method: "GET",
  });
}

export async function addCar(data: any) {
  return apiFetch(`/cars`, {
    method: "POST",
    protected: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCar(id: number, data: any) {
  return apiFetch(`/cars/${id}`, {
    method: "PUT",
    protected: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCar(id: number) {
  return apiFetch(`/cars/${id}`, {
    method: "DELETE",
    protected: true,
  });
}

/* ============================================================
   PIEZAS
============================================================ */
export async function getPiezas() {
  return apiFetch(`/piezas`, {
    method: "GET",
  });
}

export async function addPieza(data: any) {
  return apiFetch(`/piezas`, {
    method: "POST",
    protected: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updatePieza(id: number, data: any) {
  return apiFetch(`/piezas/${id}`, {
    method: "PUT",
    protected: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePieza(id: number) {
  return apiFetch(`/piezas/${id}`, {
    method: "DELETE",
    protected: true,
  });
}

export async function getPieza(id: number) {
  return apiFetch(`/piezas/${id}`, {
    method: "GET",
  });
}
