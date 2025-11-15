// src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────

export interface Pieza {
  id: number;
  descripcion: string;
  precio: number;
  carId: number;
  car?: {
    id: number;
    marca: string;
    model: string;
  };
  fotos?: FotoPieza[];
}

export interface FotoPieza {
  id: number;
  parteCoche: string;
  numero: number;
  piezaId: number;
  url?: string;
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
  defectos?: any[];
  piezas?: Pieza[];
}

export interface Imagen {
  id: number;
  url: string;
  carId: number;
}

// ─────────────────────────────────────────
// CSRF
// ─────────────────────────────────────────
function getCsrfHeader() {
  if (typeof window === "undefined") return {};
  const csrf = localStorage.getItem("csrfToken");
  return csrf ? { "X-CSRF-Token": csrf } : {};
}

// ─────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────
async function fetchWithRefresh(url: string, options: any) {
  const res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    const refresh = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      return fetch(url, { ...options, credentials: "include" });
    }
  }

  return res;
}

// ─────────────────────────────────────────
//  AUTENTICACIÓN
// ─────────────────────────────────────────

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Error en login");

  return res.json();
}

export async function register(data: any) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error en registro");
  return res.json();
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

// ─────────────────────────────────────────
// 🚗 COCHES
// ─────────────────────────────────────────

export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${API_URL}/api/cars`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error al obtener coches");
  return res.json();
}

export async function addCar(data: Partial<Car>): Promise<Car> {
  const res = await fetchWithRefresh(`${API_URL}/api/cars`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear coche");
  return res.json();
}

export async function updateCar(id: number, data: Partial<Car>): Promise<Car> {
  const res = await fetchWithRefresh(`${API_URL}/api/cars/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar coche");
  return res.json();
}

export async function deleteCar(id: number) {
  const res = await fetchWithRefresh(`${API_URL}/api/cars/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...getCsrfHeader() },
  });

  if (!res.ok) throw new Error("Error al eliminar coche");
  return res.json();
}

// ─────────────────────────────────────────
// ⚙️ PIEZAS
// ─────────────────────────────────────────

export async function getPiezas(): Promise<Pieza[]> {
  const res = await fetch(`${API_URL}/api/piezas`);
  if (!res.ok) throw new Error("Error al obtener piezas");
  return res.json();
}

export async function addPieza(data: Partial<Pieza>): Promise<Pieza> {
  const res = await fetchWithRefresh(`${API_URL}/api/piezas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear pieza");
  return res.json();
}

export async function updatePieza(id: number, data: Partial<Pieza>): Promise<Pieza> {
  const res = await fetchWithRefresh(`${API_URL}/api/piezas/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar pieza");
  return res.json();
}

export async function deletePieza(id: number) {
  const res = await fetchWithRefresh(`${API_URL}/api/piezas/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...getCsrfHeader() },
  });

  if (!res.ok) throw new Error("Error al eliminar pieza");
  return res.json();
}
