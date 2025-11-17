let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function getCsrfHeader() {
  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

export async function fetchWithRefresh(url: string, options: any = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...getCsrfHeader(),
    },
  });

  if (res.status !== 401) return res;

  // Si el token ha expirado → intentar refresh
  const refresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refresh.ok) throw new Error("No se pudo refrescar token");

  const data = await refresh.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);

  // Repetimos la petición original
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...getCsrfHeader(),
    },
  });
}
