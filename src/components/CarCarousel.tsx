"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CarCarousel({
  images,
  interval = 4000,
}: {
  images: string[];
  interval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Autoplay ---
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  useEffect(() => {
    if (isPaused) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, interval);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
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
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  // --- Calcular ancho del contenedor ---
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full mx-auto rounded-xl shadow-xl
                 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carrusel */}
      <motion.div
        className="flex h-full"
        animate={{ x: -currentIndex * containerWidth }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: `${images.length * containerWidth}px` }}
      >
        {images.map((src, index) => (
          <div key={index} className="h-full" style={{ width: containerWidth }}>
            <Image
              src={src}
              alt={`img-${index}`}
              width={containerWidth}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Flechas escritorio */}
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

      {/* Puntitos */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition
              ${i === currentIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
