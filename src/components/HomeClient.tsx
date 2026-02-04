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

  // Construir carrusel: si hay coches con `carruselFotos` seleccionadas usamos modo personalizado
  const customSelected = cars.filter(
    (c) =>
      (c.carruselMode === "custom" || c.carruselMode === undefined) &&
      Array.isArray(c.carruselFotos) &&
      c.carruselFotos.length > 0
  );

  // Si hay selección personalizada, construimos slides donde cada coche lleva su foto seleccionada
  const carouselCars =
    customSelected.length > 0
      ? // crear 'fake' cars donde carruselFotos contiene main + siguientes coches seleccionados
        customSelected.map((c, idx, arr) => {
          const main = c.carruselFotos![0];
          const nextImgs: string[] = [];
          const want = Math.min(3, arr.length - 1);
          for (let i = 1; i <= want; i++) {
            const next = arr[(idx + i) % arr.length];
            nextImgs.push(next.carruselFotos![0]);
          }
          return {
            ...c,
            carruselFotos: [main, ...nextImgs],
          } as typeof c;
        })
      : cars.filter((c) => Boolean(c.destacado));

  return (
    <main className="min-h-screen px-6 lg:px-16 mt-20">

      {/* 🔵 CARRUSEL GLOBAL */}
      {carouselCars.length > 0 && (
        <div className="mb-16">
          <CarCarouselGlobal
            cars={carouselCars}
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
