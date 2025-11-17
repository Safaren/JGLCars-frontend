import { fetchWithRefresh, getCsrfHeader, setCsrfToken } from "./fetchWithRefresh";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);
  return data;
}

export async function getCars() {
  const res = await fetchWithRefresh(`/cars`);
  return res.json();
}

export async function addCar(data: any) {
  const res = await fetchWithRefresh(`/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCar(id: number, data: any) {
  const res = await fetchWithRefresh(`/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getCsrfHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCar(id: number) {
  const res = await fetchWithRefresh(`/cars/${id}`, {
    method: "DELETE",
    headers: getCsrfHeader(),
  });
  return res.json();
}
