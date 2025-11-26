"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import CarCarousel from "@/components/CarCarousel";
import { getCars } from "@/lib/api";
import { CarForFrontend } from "@/types/CarForFrontend";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [carouselData, setCarouselData] = useState<any[]>([]);

  // 1. Cargar coches
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch {
        setCars([]);
      }
    };
    load();
  }, []);

  // 2. Generar datos del carrusel con toda la información de cada imagen
  useEffect(() => {
    if (cars.length === 0) return;

    const destacados = cars.filter((c) => c.destacado);

    const lista = destacados.flatMap((c) =>
      c.carruselFotos.map((url) => ({
        url,
        carId: c.id,
        marca: c.marca,
        model: c.model,
        combustible: c.combustible,
        precio: c.precio,
        anoFabricacion: c.anoFabricacion,
      }))
    );

    setCarouselData(lista);
  }, [cars]);

  return (
    <main className="min-h-screen px-6 lg:px-16 mt-20">

      {/* Carrusel con todos los datos */}
      <CarCarousel
        images={carouselData.map((d) => d.url)}
        marca={carouselData[0]?.marca}
        model={carouselData[0]?.model}
        combustible={carouselData[0]?.combustible}
        precio={carouselData[0]?.precio}
        anoFabricacion={carouselData[0]?.anoFabricacion}
        carId={carouselData[0]?.carId}
        interval={3000}
      />

      <h2 className="text-3xl text-neutral-50 font-bold mb-6 text-center mt-10">
        Coches de ocasión disponibles
      </h2>

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
