// src/components/HomeClient.tsx
"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import CarCarouselGlobal from "@/components/CarCarouselData";
import { getCars } from "@/lib/api";
import { CarForFrontend } from "@/types/CarForFrontend";

export default function HomeClient({
  initialCars,
}: {
  initialCars?: CarForFrontend[];
}) {
  const [cars, setCars] = useState<CarForFrontend[]>(initialCars || []);

  // Cargar coches si SSR no trajo datos
  useEffect(() => {
    if (initialCars && initialCars.length > 0) return;

    const load = async () => {
      const data = await getCars(); // <-- ahora devuelve un array SIEMPRE
      setCars(data);
    };

    load();
  }, []);

  // Filtrar destacados
  const destacados = cars.filter((c) => Boolean(c.destacado));

  return (
    <main className="min-h-screen px-6 lg:px-16 mt-20">

      {/* 🔵 CARRUSEL GLOBAL */}
      {destacados.length > 0 && (
        <div className="mb-16">
          <CarCarouselGlobal
            cars={destacados}
            interval={4500}
            showThumbnails={true}
          />
        </div>
      )}

      {/* TÍTULO */}
      <h2 className="text-3xl text-neutral-50 font-bold mb-6 text-center mt-10">
        Coches de ocasión disponibles
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
        {cars.length > 0 ? (
          cars.map((car) => <CarCard key={car.id} car={car} />)
        ) : (
          <p className="text-gray-500">
            No hay coches disponibles en este momento.
          </p>
        )}
      </div>
    </main>
  );
}
