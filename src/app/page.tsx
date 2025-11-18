// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import CarCarousel from "@/components/CarCarousel";
import { getCars, Car } from "@/lib/apiServer";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  // 1. Cargar coches
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err) {
        console.error("Error al cargar coches:", err);
        setCars([]);
      }
    };

    load();
  }, []);

  // 2. Cada vez que cambia de coche → generar 3 imágenes aleatorias
  useEffect(() => {
    if (cars.length === 0) return;

    const car = cars[currentCarIndex];
    const imgs = car.imagenes?.map(i => i.url) || [];

    // Elegir 3 aleatorias
    const shuffled = imgs.sort(() => Math.random() - 0.5);
    setCarouselImages(shuffled.slice(0, 3));

  }, [currentCarIndex, cars]);

  // 3. Rotar coches después de mostrar 3 imágenes (intervalo del carrusel × 3)
  useEffect(() => {
    if (cars.length === 0) return;

    const interval = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % cars.length);
    }, 3000 * 3); // 3 imágenes × 3 segundos = 9s por coche

    return () => clearInterval(interval);
  }, [cars]);

  return (
    <main className="min-h-screen px-6 lg:px-16">

      {/* Carrusel dinámico */}
      <CarCarousel images={carouselImages} interval={3000} />

      <h2 className="text-3xl font-bold mb-6 text-center">
        Coches de ocasión disponibles 🚗
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
        {cars.length > 0 ? (
          cars.map((car) => <CarCard key={car.id} car={car} />)
        ) : (
          <p className="text-gray-500">No hay coches disponibles en este momento.</p>
        )}
      </div>
    </main>
  );
}
