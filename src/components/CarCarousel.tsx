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
  interval = 3500,
  marca,
  model,
  combustible,
  carId,
}: Props) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);

  // Reiniciar si cambian imágenes
  useEffect(() => setIndex(0), [images]);

  // Autoplay con pausa en hover
  useEffect(() => {
    if (!images.length || hovering) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval, hovering]);

  const goPrev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () =>
    setIndex((i) => (i + 1) % images.length);

  // Swipe táctil
  const onTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) goPrev();
    else if (diff < -50) goNext();

    touchStartX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-600">Sin imágenes</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* CONTENEDOR PRINCIPAL (altura dinámica) */}
      <div
        ref={containerRef}
        className="
          relative w-full rounded-xl overflow-hidden shadow-2xl
          bg-black
          transition-all duration-500
        "
        style={{ height: "auto" }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* SLIDES */}
        <div className="relative w-full h-[65vh] max-h-[800px] min-h-[300px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`
                absolute inset-0 transition-opacity duration-700
                ${i === index ? "opacity-100" : "opacity-0"}
              `}
            >
              <Image
                src={img}
                alt="Foto del coche"
                fill
                priority={i === index}
                className="
                  object-contain
                  transition-transform duration-700
                "
              />
            </div>
          ))}
        </div>

        {/* TEXTO INFERIOR */}
        {(marca || model || combustible) && (
          <div className="
            absolute bottom-4 right-4 
            bg-black/60 backdrop-blur-md
            text-white px-4 py-2 rounded-lg shadow-lg
          ">
            <p className="text-lg font-bold">{marca} {model}</p>
            <p className="text-sm opacity-70">{combustible}</p>
          </div>
        )}

        {/* BOTÓN PREV */}
        <button
          onClick={goPrev}
          className="
            hidden sm:flex
            absolute left-4 top-1/2 -translate-y-1/2
            w-11 h-11 rounded-full 
            bg-white/20 hover:bg-white/40 
            text-white text-3xl font-bold
            backdrop-blur-md
            items-center justify-center
            transition opacity-0 group-hover:opacity-100
          "
        >
          ‹
        </button>

        {/* BOTÓN NEXT */}
        <button
          onClick={goNext}
          className="
            hidden sm:flex
            absolute right-4 top-1/2 -translate-y-1/2
            w-11 h-11 rounded-full 
            bg-white/20 hover:bg-white/40 
            text-white text-3xl font-bold
            backdrop-blur-md
            items-center justify-center
            transition opacity-0 group-hover:opacity-100
          "
        >
          ›
        </button>

        {/* PUNTOS DE NAVEGACIÓN */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${i === index ? "bg-white scale-110 shadow-md" : "bg-white/40"}
              `}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`
              relative w-28 h-20 rounded-md overflow-hidden cursor-pointer
              border-2 transition
              ${i === index ? "border-blue-600" : "border-transparent"}
            `}
          >
            <Image
              src={img}
              alt="Miniatura coche"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
