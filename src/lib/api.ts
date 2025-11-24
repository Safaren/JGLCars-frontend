// JGLCars-frontend/src/lib/api.ts

"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
console.log("🔥 FRONTEND API BASE:", API);


/* ============================================================
   TOKEN
============================================================ */
function getAuthHeader() {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

/* ============================================================
   FETCH BASE — con JSON seguro
============================================================ */
async function apiFetch(path: string, options: any = {}) {
  const url = `${API}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(url, {
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
============================================================ */
export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
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
============================================================ */
export async function getCars() {
  return apiFetch(`/cars`);
}

export async function addCar(data: any) {
  console.log("📤 addCar() — Enviando:", data);

  try {
    const response = await apiFetch(`/cars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("📥 addCar() — Respuesta del servidor:", response);
    return response;

  } catch (error) {
    console.error("❌ addCar() — ERROR:", error);
    return null;
  }
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
