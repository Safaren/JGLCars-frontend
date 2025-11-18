"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CarCarousel({
  images,
  interval = 3000,
}: {
  images: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  // 🔹 Reiniciar el índice si cambian las imágenes recibidas
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // 🔹 Cambiar imagen automáticamente cada X tiempo
  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  // 🔹 Si no hay imágenes, muestra un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-600">No hay imágenes</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-xl shadow-lg">
      <Image
        key={images[index]} // forza animación al cambiar URL
        src={images[index]}
        alt="Coche"
        fill
        priority
        className="object-cover transition-opacity duration-700"
      />

      {/* Indicadores inferiores */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index
                ? "bg-white shadow-md"
                : "bg-white/50 backdrop-blur-sm"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
