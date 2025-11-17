"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CarCarousel({
  images,
  interval = 4000, // tiempo entre imágenes
}: {
  images: string[];
  interval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Autoplay con pausa
  useEffect(() => {
    if (isPaused) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(nextSlide, interval);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, interval]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-xl shadow-xl"
      onMouseEnter={() => setIsPaused(true)}   // pausa al pasar ratón
      onMouseLeave={() => setIsPaused(false)}  // reanuda al quitar ratón
    >
      {/* Contenedor horizontal */}
      <motion.div
        className="flex"
        animate={{ x: -currentIndex * 100 + "%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: `${images.length * 100}%` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <Image
              src={src}
              width={1200}
              height={300}
              alt={`Slide ${i}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>

      {/* Flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>

      {/* Puntitos abajo */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === currentIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
