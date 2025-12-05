export async function getCarsPaginated(page = 1, limit = 12) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(
    `${API_URL}/cars?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("❌ Error de API getCarsPaginated:", res.status);
    return { cars: [], hasMore: false };
  }

  const data = await res.json();

  // Backend devuelve: { items, page, total, hasMore }
  return {
    cars: Array.isArray(data.items) ? data.items : [],
    hasMore: Boolean(data.hasMore),
  };
}
