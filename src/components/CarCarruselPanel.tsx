"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getCarsPaginated } from "@/api/getCarsPaginated";
import { CarForFrontend } from "@/types/CarForFrontend";

interface CarCarruselPanelProps {
  onSelectCar?: (car: CarForFrontend) => void;
}

export default function CarCarruselPanel({ onSelectCar }: CarCarruselPanelProps) {
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // ================================
  // 🔵 Cargar página con paginación
  // ================================
  const loadPage = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    const result = await getCarsPaginated(page);
    const newCars = result.cars ?? [];
    const nextPageHasMore = result.hasMore;

    setCars((prev) => {
      const ids = new Set(prev.map((x) => x.id));
      const filtered = newCars.filter((c: CarForFrontend) => !ids.has(c.id));

      return [...prev, ...filtered];
    });

    setHasMore(Boolean(nextPageHasMore));
    setLoading(false);
  }, [page, hasMore, loading]);

  // ================================
  // 🔵 Ejecutar carga cuando cambie "page"
  // ================================
  useEffect(() => {
    // Evitamos "setState inside effect" ejecutando en tick siguiente
    Promise.resolve().then(() => void loadPage());
  }, [loadPage]);

  // ================================
  // 🔵 Observador infinito
  // ================================
  useEffect(() => {
    const node = loadingRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // ================================
  // 🔵 Render
  // ================================
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-blue-100">Carrusel admin</h2>

      {/* LISTADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            onClick={() => onSelectCar?.(car)}
            className="
              border p-4 rounded-xl bg-white shadow 
              cursor-pointer hover:bg-blue-50 transition
            "
          >
            <p className="font-semibold">
              {car.marca} {car.model}
            </p>

            {car.precio && car.tipoVenta !== "PIEZAS" && (
              <p className="text-lg font-bold text-blue-600 mt-2">
                {car.precio.toLocaleString()} €
              </p>
            )}

            {car.tipoVenta === "PIEZAS" && (
              <p className="text-sm mt-2 font-semibold text-red-600">
                Venta por piezas
              </p>
            )}
          </div>
        ))}
      </div>

      {/* LOADING + OBSERVER */}
      <div ref={loadingRef} className="text-center py-6 text-gray-600">
        {loading && "Cargando más coches..."}
        {!loading && hasMore && "Desplázate para cargar más"}
        {!hasMore && "No hay más coches"}
      </div>
    </div>
  );
}
