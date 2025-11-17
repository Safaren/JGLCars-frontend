let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function getCsrfHeader() {
  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

export async function fetchWithRefresh(url: string, options: any = {}) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  async function doFetch() {
    return fetch(api + url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        ...getCsrfHeader(),
      },
    });
  }

  let res = await doFetch();

  if (res.status !== 401) return res;

  // REFRESH SIN CSRF
  const refresh = await fetch(api + "/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refresh.ok) throw new Error("No se pudo refrescar token");

  const data = await refresh.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);

  return doFetch();
}
