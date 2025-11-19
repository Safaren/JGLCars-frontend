"use client";

const API_BASE = "/api";

// ============================================================
// CSRF TOKEN
// ============================================================
let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("csrfToken", token);
  }
}

export function getCsrfHeader() {
  if (!csrfToken && typeof window !== "undefined") {
    csrfToken = localStorage.getItem("csrfToken");
  }
  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

// ============================================================
// FETCH BASE
// ============================================================
async function fetchBase(path: string, options: any = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...getCsrfHeader(),
    },
  });
}

// ============================================================
// FETCH WITH REFRESH
// ============================================================
export async function fetchWithRefresh(path: string, options: any = {}) {
  let res = await fetchBase(path, options);

  if (res.status !== 401) return res;

  const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) throw new Error("No se pudo refrescar token");

  const data = await refreshRes.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);

  return fetchBase(path, options);
}

// ============================================================
// AUTH
// ============================================================
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);

  return data;
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

// ============================================================
// COCHES
// ============================================================
export async function getCars() {
  const res = await fetchWithRefresh(`/cars`);
  return res.json();
}

export async function addCar(data: any) {
  const res = await fetchWithRefresh(`/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCar(id: number, data: any) {
  const res = await fetchWithRefresh(`/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCar(id: number) {
  const res = await fetchWithRefresh(`/cars/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// ============================================================
// PIEZAS
// ============================================================
export async function getPiezas() {
  const res = await fetchWithRefresh(`/piezas`);
  return res.json();
}

export async function addPieza(data: any) {
  const res = await fetchWithRefresh(`/piezas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePieza(id: number, data: any) {
  const res = await fetchWithRefresh(`/piezas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePieza(id: number) {
  const res = await fetchWithRefresh(`/piezas/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getPieza(id: number) {
  const res = await fetchWithRefresh(`/piezas/${id}`);
  return res.json();
}
