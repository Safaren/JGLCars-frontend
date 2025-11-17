"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CarCarousel({
  images,
  interval = 4000,
  desktopMargin = 50, // margen en escritorio
}: {
  images: string[];
  interval?: number;
  desktopMargin?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Autoplay ---
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

 useEffect(() => {
  // Si está en pausa, simplemente limpia y salimos sin devolver nada.
  if (isPaused) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    return;
  }

  // Si NO está en pausa, configuramos el autoplay
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(nextSlide, interval);

  // Cleanup correcto
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [currentIndex, isPaused, interval]);

  // --- Swipe táctil ---
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  // --- Calcular tamaño de pantalla según navbar ---
  useEffect(() => {
    const calculateSize = () => {
      const navbar = document.getElementById("main-navbar");
      const navbarHeight = navbar?.offsetHeight || 70;

      const isMobile = window.innerWidth < 768;

      const margin = isMobile ? 0 : desktopMargin;

      setSize({
        width: window.innerWidth - margin * 2,
        height: window.innerHeight - navbarHeight - margin * 2,
      });
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);

    return () => window.removeEventListener("resize", calculateSize);
  }, [desktopMargin]);

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-xl mx-auto"
      style={{
        width: size.width,
        height: size.height,
        touchAction: "pan-y",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carrusel horizontal */}
      <motion.div
        className="flex h-full"
        animate={{ x: -currentIndex * size.width }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: `${images.length * size.width}px` }}
      >
        {images.map((src, index) => (
          <div key={index} style={{ width: size.width, height: size.height }}>
            <Image
              src={src}
              alt={`img-${index}`}
              width={size.width}
              height={size.height}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Flechas (solo en escritorio) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 
                 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 
                 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
      >
        ❯
      </button>

      {/* Puntitos táctiles */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition 
              ${
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
