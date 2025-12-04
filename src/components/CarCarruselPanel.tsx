// src/components/CarCarruselPanel.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import CarCarruselConfig from "@/components/CarCarruselConfig";
import { getCars } from "@/lib/api";
import { CarForFrontend } from "@/types/CarForFrontend";

export default function CarCarruselPanel() {
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingCar, setEditingCar] = useState<CarForFrontend | null>(null);
  const [search, setSearch] = useState("");

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  const uniqueCars = Array.from(new Map(cars.map(c => [c.id, c])).values());

  // Cargar coches paginados
  async function loadCars() {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await getCars(page);

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
      } else {
        setCars(prev => {
          const merged = [...prev, ...data];
          return Array.from(new Map(merged.map(c => [c.id, c])).values());
        });
      }
    } catch (err) {
      console.error("Error cargando coches:", err);
    }

    setLoading(false);
  }

  // Cargar al cambiar page
  useEffect(() => {
    loadCars();
  }, [page]);

  // IntersectionObserver (corregido)
  useEffect(() => {
    if (!observerRef.current) return;

    // limpiar observer previo
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observerInstance.current.observe(observerRef.current);

    return () => {
      observerInstance.current?.disconnect();
    };
  }, [hasMore, loading]); // ← ¡corregido!

  // Filtrado
  const filteredCars = uniqueCars.filter(car => {
    const term = search.toLowerCase();
    return (
      car.marca?.toLowerCase().includes(term) ||
      car.model?.toLowerCase().includes(term) ||
      String(car.id).includes(term)
    );
  });

  return (
    <div className="space-y-8">

      <input
        type="text"
        placeholder="Buscar por marca, modelo o ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg shadow-sm"
      />

      {editingCar ? (
        <div>
          <button
            onClick={() => setEditingCar(null)}
            className="mb-4 text-blue-600 underline"
          >
            ← Volver
          </button>

          <CarCarruselConfig
            car={editingCar}
            onSave={(data) => {
              console.log("Guardando miniaturas del coche", editingCar.id, data);
              setEditingCar(null);
            }}
            onCancel={() => setEditingCar(null)}
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredCars.map(car => (
              <button
                key={car.id}
                onClick={() => setEditingCar(car)}
                className="w-full p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-semibold">{car.marca} {car.model}</p>
                  <p className="text-sm text-gray-500">ID: {car.id}</p>
                </div>

                <p className="text-blue-600 font-bold">
                  {car.precio?.toLocaleString()} €
                </p>
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center text-gray-500 mt-4">Cargando más coches...</p>
          )}

          <div ref={observerRef} className="h-10" />
        </>
      )}
    </div>
  );
}
