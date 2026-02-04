"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getCarsPaginated } from "@/api/getCarsPaginated";
import { CarForFrontend } from "@/types/CarForFrontend";
import { motion } from "framer-motion";

interface CarCarruselPanelProps {
  onSelectCar?: (car: CarForFrontend) => void;
}

export default function CarCarruselPanel({ onSelectCar }: CarCarruselPanelProps) {
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carouselMode, setCarouselMode] = useState<"custom" | "auto">("custom");
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL;

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-500">Carrusel de inicio</h2>

        {/* TOGGLE MODO CARRUSEL */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-md border-2 border-gray-300">
          <button
            onClick={async () => {
              try {
                const res = await fetch(`${API}/cars/carrusel-mode`, {
                  method: "PUT",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mode: "custom" }),
                });
                if (!res.ok) {
                  const errorText = await res.text();
                  console.error("❌ Error fetch custom:", res.status, res.statusText, errorText);
                  throw new Error(`Error cambiando modo: ${res.status} ${res.statusText} - ${errorText}`);
                }
                setCarouselMode("custom");
                // Recargar coches para reflejar cambios
                setPage(1);
                setCars([]);
                setHasMore(true);
              } catch (err) {
                console.error(err);
                setCarouselMode("custom");
              }
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition transform ${carouselMode === "custom"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Personalizado
          </button>
          <div className="text-gray-400">|</div>
          <button
            onClick={async () => {
              try {
                const res = await fetch(`${API}/cars/carrusel-mode`, {
                  method: "PUT",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mode: "auto" }),
                });
                if (!res.ok) {
                  const errorText = await res.text();
                  console.error("❌ Error fetch auto:", res.status, res.statusText, errorText);
                  throw new Error(`Error cambiando modo: ${res.status} ${res.statusText} - ${errorText}`);
                }
                setCarouselMode("auto");
                // Recargar coches para reflejar cambios
                setPage(1);
                setCars([]);
                setHasMore(true);
              } catch (err) {
                console.error(err);
                setCarouselMode("auto");
              }
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition transform ${carouselMode === "auto"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Automático
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-blue-800 font-medium">
          {carouselMode === "custom"
            ? "📸 Modo carrusel 1 foto por coche."
            : "🔄 Modo detalles carrusel miniaturas por cada coche"}
        </p>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <motion.div
            key={car.id}
            onClick={() => onSelectCar?.(car)}
            whileHover={{ scale: 1.02 }}
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

            {/* Mostrar estado */}
            <div className="mt-3 pt-3 border-t-2 border-gray-200 text-xs">
              {carouselMode === "custom" && (
                <>
                  {car.carruselFotos && car.carruselFotos.length > 0 ? (
                    <p className="text-green-600 font-semibold">
                      ✓ {car.carruselFotos.length} foto(s) seleccionada(s)
                    </p>
                  ) : (
                    <p className="text-gray-500">Sin fotos seleccionadas</p>
                  )}
                </>
              )}
              {carouselMode === "auto" && (
                <>
                  {car.destacado ? (
                    <p className="text-green-600 font-semibold">✓ Destacado</p>
                  ) : (
                    <p className="text-gray-500">No destacado</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
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
