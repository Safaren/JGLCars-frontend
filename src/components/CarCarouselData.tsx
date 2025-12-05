"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";
import type { CarForFrontend } from "@/types/CarForFrontend";

interface Props {
  cars: CarForFrontend[];
  interval?: number;
  showThumbnails?: boolean;
}

export default function CarCarouselGlobal({
  cars,
  interval = 2500,
  showThumbnails = true,
}: Props) {
  const router = useRouter();

  // PREPARA SLIDES
  const slides = useMemo(() => {
    if (!Array.isArray(cars)) return [];

    return cars.map((car) => {
      const fotos =
        Array.isArray(car.carruselFotos) && car.carruselFotos.length > 0
          ? car.carruselFotos
          : (car.imagenes ?? []).map((img) => img.url);

      return {
        carId: car.id,
        fotos,
        marca: car.marca,
        model: (car as any).model ?? (car as any).modelo ?? "",
        precio: car.precio,
        combustible: car.combustible,
        anoFabricacion: car.anoFabricacion,
        tipoVenta: car.tipoVenta,
      };
    });
  }, [cars]);

  const [index, setIndex] = useState(0);
  const [fotoIndex, setFotoIndex] = useState(0);

  const hovering = useRef(false);
  const lastShownRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  if (slides.length === 0) return null;

  // 🔥 FUNCIÓN CENTRAL: arranca el ciclo de fotos
  const startCycle = (stepFn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(stepFn, interval);
  };

  // 🔥 Reset total cuando cambias de coche
  const resetAndRestart = (stepFn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    lastShownRef.current = false;
    setFotoIndex(0);

    // nuevo ciclo limpio
    timerRef.current = window.setTimeout(stepFn, interval);
  };

  // EFECTO PRINCIPAL
  useEffect(() => {
    const fotos = slides[index]?.fotos ?? [];

    const step = () => {
      if (hovering.current) {
        return startCycle(step);
      }

      // Si el coche no tiene fotos → pasar al siguiente
      if (fotos.length === 0) {
        setIndex((i) => (i + 1) % slides.length);
        return resetAndRestart(step);
      }

      setFotoIndex((prev) => {
        const last = fotos.length - 1;

        // FOTO NORMAL → pasar a la siguiente
        if (prev < last) {
          lastShownRef.current = false;
          startCycle(step);
          return prev + 1;
        }

        // ÚLTIMA FOTO → mostrarla un intervalo entero
        if (!lastShownRef.current) {
          lastShownRef.current = true;
          startCycle(step);
          return prev; // mantener última foto 1 ciclo
        }

        // SEGUNDA VEZ EN ÚLTIMA → cambiar coche
        lastShownRef.current = false;
        setIndex((i) => (i + 1) % slides.length);

        // ARRANCAR CICLO NUEVO LIMPIO
        setTimeout(() => resetAndRestart(step), 0);

        return 0;
      });
    };

    resetAndRestart(step);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, slides, interval]);

  // BOTONES MANUALES
  const goPrev = () => {
    setIndex((i) => {
      const next = (i - 1 + slides.length) % slides.length;
      return next;
    });
  };

  const goNext = () => {
    setIndex((i) => (i + 1) % slides.length);
  };

  const goToCar = (id: number) => {
    router.push(`/coches/${id}`);
  };

  const slide = slides[index];
  const fotos = slide.fotos;

  return (
    <>
      <div
        className="relative w-full h-[70vh] max-h-[850px] min-h-[350px] overflow-hidden rounded-2xl shadow-2xl group"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        {fotos.map((url, i) => {
          const active = fotoIndex === i;
          return (
            <div
              key={url + i}
              onClick={() => goToCar(slide.carId)}
              className={`absolute inset-0 transition-all duration-700 
              ${active ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}
            >
              <Image
                src={url}
                alt={`${slide.marca} ${slide.model}`}
                fill
                className="object-cover brightness-[0.8]"
                priority={i === fotoIndex}
              />
              
              <div className="absolute bottom-12 left-12 text-white drop-shadow-lg">
                <h2 className="text-4xl font-extrabold">
                  {slide.marca} {slide.model}
                </h2>

                <p className="text-xl mt-1 opacity-90">{slide.combustible}</p>

                {slide.tipoVenta === "PIEZAS" ? (
                  <div className="mt-3 px-4 py-1 bg-red-600/90 text-xl font-bold rounded-full inline-block">
                    Venta por piezas
                  </div>
                ) : (
                  <p className="text-3xl font-bold mt-2 text-blue-300">
                    {slide.precio?.toLocaleString()} €
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* BOTÓN IZQUIERDA */}
        <button
          onClick={goPrev}
  className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 
  w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white 
  items-center justify-center shadow-xl
  opacity-0 group-hover:opacity-100 
  transition-all duration-300 hover:scale-110
  hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
        >
          
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 12l6.29 6.29A1 1 0 0 1 15.5 19z" />
          </svg>
        </button>

        {/* BOTÓN DERECHA */}
        <button
          onClick={goNext}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 
  w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white 
  items-center justify-center shadow-xl
  opacity-0 group-hover:opacity-100 
  transition-all duration-300 hover:scale-110
  hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1 0 1.42l-7 7a1 1 0 1 1-1.4-1.42L14.09 12 7.79 5.71A1 1 0 0 1 8.5 5z" />
          </svg>
        </button>

      </div>   {/* ← EL DIV QUE FALTABA AQUÍ */}

      {/* MINIATURAS */}
      {showThumbnails && fotos.length > 1 && (
        <div className="w-full flex justify-center gap-3 mt-5">
          {fotos.map((url, i) => (
            <button
              key={url + "-thumb-" + i}
              onClick={() => {
                setFotoIndex(i);
                lastShownRef.current = false;
              }}
              className={`w-20 h-14 rounded-lg overflow-hidden shadow-md transition-all
              ${fotoIndex === i ? "scale-110 border-blue-400 border-2" : "opacity-60"}`}
            >
              <Image
                src={url}
                alt="thumbnail"
                width={80}
                height={60}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
