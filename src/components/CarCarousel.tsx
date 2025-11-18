"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  images: string[];
  interval?: number;
  marca?: string;
  model?: string;
  combustible?: string;
  carId?: number;
}

export default function CarCarousel({
  images,
  interval = 3000,
  marca,
  model,
  combustible,
  carId,
}: Props) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const router = useRouter();

  const touchStartX = useRef<number | null>(null);

  // Reiniciar al recibir nuevas imágenes
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // Autoplay (pausado en hover)
  useEffect(() => {
    if (!images.length || hovering) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, hovering]);

  const goNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe móvil
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 50) goPrev();
    else if (diff < -50) goNext();

    touchStartX.current = null;
  };

  // Click → abrir página del coche
  const openCar = () => {
    if (carId) router.push(`/admin/coches/${carId}`);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-600">No hay imágenes</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-xl group select-none"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={openCar}
      >
        {/* IMAGEN PRINCIPAL */}
        <Image
          key={images[index]}
          src={images[index]}
          alt="Imagen de coche"
          fill
          priority
          className="object-cover transition-opacity duration-700 cursor-pointer"
        />

        {/* TEXTO: marca, modelo, combustible */}
        {(marca || model || combustible) && (
          <div
            className="
            absolute bottom-3 right-3 
            bg-black/60 text-white px-4 py-2 
            rounded-lg shadow-lg text-right 
            backdrop-blur-sm
          "
          >
            <p className="font-bold text-lg">{marca} {model}</p>
            <p className="text-sm opacity-90">{combustible}</p>
          </div>
        )}

        {/* BOTÓN PREV */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="
          absolute left-3 top-1/2 -translate-y-1/2 
          bg-black/50 hover:bg-black/70 text-white 
          w-10 h-10 rounded-full flex items-center justify-center 
          opacity-0 group-hover:opacity-100 transition
        "
        >
          ‹
        </button>

        {/* BOTÓN NEXT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="
          absolute right-3 top-1/2 -translate-y-1/2 
          bg-black/50 hover:bg-black/70 text-white 
          w-10 h-10 rounded-full flex items-center justify-center 
          opacity-0 group-hover:opacity-100 transition
        "
        >
          ›
        </button>

        {/* INDICADORES (puntos) */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`
              w-3 h-3 rounded-full transition-all
              ${i === index ? "bg-white shadow-md scale-110" : "bg-white/40"}
            `}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`
              relative w-24 h-16 rounded-md overflow-hidden cursor-pointer
              border-2 transition-all
              ${i === index ? "border-blue-500" : "border-transparent"}
            `}
          >
            <Image
              src={img}
              alt="Miniatura"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
