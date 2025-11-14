  // src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Tipos principales
 */

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

/**
 * Utilidad: cabecera CSRF
 */
function getCsrfHeader() {
  if (typeof window === "undefined") return {};
  const csrf = localStorage.getItem("csrfToken");
  return csrf ? { "X-CSRF-Token": csrf } : {};
}

/**
 * Interceptor para refrescar tokens
 */
async function fetchWithRefresh(url: string, options: any) {
  const res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      return fetch(url, { ...options, credentials: "include" });
    }
  }

  return res;
}

/**
 * =====================
 * 🚗 COCHES
 * =====================
 */

export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${API_URL}/cars`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener coches");
  return res.json() as Promise<Car[]>;
}

export async function addCar(carData: Partial<Car>): Promise<Car> {
  const res = await fetchWithRefresh(`${API_URL}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(carData),
  });
  if (!res.ok) throw new Error("Error al crear coche");
  return res.json() as Promise<Car>;
}

export async function updateCar(id: number, carData: Partial<Car>): Promise<Car> {
  const res = await fetchWithRefresh(`${API_URL}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(carData),
  });
  if (!res.ok) throw new Error("Error al actualizar coche");
  return res.json() as Promise<Car>;
}

export async function deleteCar(id: number): Promise<{ message: string }> {
  const res = await fetchWithRefresh(`${API_URL}/cars/${id}`, {
    method: "DELETE",
    headers: { ...getCsrfHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar coche");
  return res.json();
}

/**
 * =====================
 * ⚙️ PIEZAS
 * =====================
 */

export async function getPiezas(): Promise<Pieza[]> {
  const res = await fetch(`${API_URL}/piezas`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener piezas");
  return res.json() as Promise<Pieza[]>;
}

export async function addPieza(data: Partial<Pieza>): Promise<Pieza> {
  const res = await fetchWithRefresh(`${API_URL}/piezas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear pieza");
  return res.json() as Promise<Pieza>;
}

export async function updatePieza(id: number, data: Partial<Pieza>): Promise<Pieza> {
  const res = await fetchWithRefresh(`${API_URL}/piezas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar pieza");
  return res.json() as Promise<Pieza>;
}

export async function deletePieza(id: number): Promise<{ message: string }> {
  const res = await fetchWithRefresh(`${API_URL}/piezas/${id}`, {
    method: "DELETE",
    headers: { ...getCsrfHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar pieza");
  return res.json();
}
