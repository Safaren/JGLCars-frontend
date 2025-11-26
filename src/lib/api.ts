 // JGLCars-frontend/src/lib/api.ts

/*"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
console.log("🔥 FRONTEND API BASE:", API);

/* ============================================================
   FETCH BASE — con JSON seguro + credenciales
============================================================ 
async function apiFetch(path: string, options: any = {}) {
  const url = `${API}${path}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const isAuthRequest =
    options.credentials === "include" ||
    path.startsWith("/auth") ||
    path.startsWith("/perfil") ||
    path.startsWith("/admin");

  const res = await fetch(url, {
    //credentials: "include", // 🔥 NECESARIO EN PRODUCCIÓN
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("❌ Respuesta no JSON:", text);
    throw new Error("El servidor devolvió HTML en lugar de JSON");
  }

  if (!res.ok) {
    console.error("❌ ERROR API", json);
    throw new Error(json.error || "Error API");
  }

  return json;
}

/* ============================================================
   AUTH
============================================================ 
export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include", // 🔥 NECESARIO
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("❌ Respuesta NO JSON en login:", text);
    throw new Error("Respuesta no válida desde /auth/login");
  }

  return json;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/* ============================================================
   COCHES
============================================================ 
export async function getCars() {
  return apiFetch(`/cars`);
}

export async function addCar(data: any) {
  return apiFetch(`/cars`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCar(id: number, data: any) {
  return apiFetch(`/cars/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCar(id: number) {
  return apiFetch(`/cars/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

/* ============================================================
   PIEZAS
============================================================ 
export async function getPiezas() {
  return apiFetch(`/piezas`, );
}

export async function addPieza(data: any) {
  return apiFetch(`/piezas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updatePieza(id: number, data: any) {
  return apiFetch(`/piezas/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePieza(id: number) {
  return apiFetch(`/piezas/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function getPieza(id: number) {
  return apiFetch(`/piezas/${id}`, { credentials: "include" });
}
*/

"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
console.log("🔥 FRONTEND API BASE:", API);

/* ============================================================
   DETECTAR SI UNA RUTA ES PRIVADA O PÚBLICA
============================================================ */
function isProtectedRoute(path: string) {
  return (
    path.startsWith("/auth") ||
    path.startsWith("/cars") && (path.includes("POST") || path.includes("PUT") || path.includes("DELETE")) ||
    path.startsWith("/piezas") && (path.includes("POST") || path.includes("PUT") || path.includes("DELETE")) ||
    path.startsWith("/admin") ||
    path.startsWith("/contacto") && false  // contacto es PÚBLICO
  );
}

/* ============================================================
   FETCH BASE PRO — con JSON seguro + manejo robusto de errores
============================================================ */
async function apiFetch(path: string, options: any = {}) {
  const url = `${API}${path}`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Detectar si la ruta es privada
  const protectedRequest =
    options.protected === true ||
    path.startsWith("/auth") ||
    path.startsWith("/cars/") && options.method !== "GET" ||
    path.startsWith("/piezas/") && options.method !== "GET" ||
    path.includes("favoritos");

  const res = await fetch(url, {
    ...options,
    credentials: protectedRequest ? "include" : "omit",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  let json;

  try {
    json = JSON.parse(text);
  } catch {
    console.error("❌ backend devolvió HTML", text);
    throw new Error("Error CORS o servidor");
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
    credentials: "include",
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
   COCHES (PÚBLICO GET /cars)
============================================================ */
export async function getCars() {
 return apiFetch(`/cars`, { method: "GET" });
}

export async function addCar(data: any) {
  return apiFetch(`/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCar(id: number, data: any) {
  return apiFetch(`/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCar(id: number) {
  return apiFetch(`/cars/${id}`, {
    method: "DELETE",
  });
}

/* ============================================================
   PIEZAS
============================================================ */
export async function getPiezas() {
  return apiFetch(`/piezas`);
}

export async function addPieza(data: any) {
  return apiFetch(`/piezas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updatePieza(id: number, data: any) {
  return apiFetch(`/piezas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePieza(id: number) {
  return apiFetch(`/piezas/${id}`, {
    method: "DELETE",
  });
}

export async function getPieza(id: number) {
  return apiFetch(`/piezas/${id}`);
}
