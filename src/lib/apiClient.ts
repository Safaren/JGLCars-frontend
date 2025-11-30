    "use client";

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

    // ─────────────────────────────────────────
    // CSRF
    // ─────────────────────────────────────────
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

    // ─────────────────────────────────────────
    // REFRESH TOKEN
    // ─────────────────────────────────────────
    export async function fetchWithRefresh(path: string, options: any = {}) {
    const url = path.startsWith("http") ? path : `${API}${path}`;

    let res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
        ...(options.headers || {}),
        ...getCsrfHeader(),
        }
    });

    if (res.status !== 401) return res;

    // token expirado → intenta refrescar
    const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    });

    if (!refreshRes.ok) throw new Error("No se pudo refrescar token");

    const data = await refreshRes.json();
    if (data.csrfToken) setCsrfToken(data.csrfToken);

    // repetimos petición
    return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
        ...(options.headers || {}),
        ...getCsrfHeader(),
        }
    });
    }

    // ─────────────────────────────────────────
    // AUTENTICACIÓN
    // ─────────────────────────────────────────

    export async function login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
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
    await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    }

    // ─────────────────────────────────────────
    // COCHES (solo admin)
    // ─────────────────────────────────────────

    export async function getCarsAdmin() {
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
        method: "DELETE"
    });
    return res.json();
    }


