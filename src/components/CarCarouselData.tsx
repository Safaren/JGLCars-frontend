"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
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

  // TOUCH CONTROL
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 30;

  // HINTS
  const [showHints, setShowHints] = useState(true);
  const [hintX, setHintX] = useState<number | null>(null);
  const [hintY, setHintY] = useState<number | null>(null);
  const [hintDirection, setHintDirection] = useState<"left" | "right" | null>(
    null
  );

  const hintRef = useRef<HTMLDivElement | null>(null);

  if (slides.length === 0) return null;

  const startCycle = (stepFn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(stepFn, interval);
  };

  const resetAndRestart = (stepFn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    lastShownRef.current = false;
    setFotoIndex(0);

    timerRef.current = window.setTimeout(stepFn, interval);
  };

  // 🔥 EFECTO PRINCIPAL (cambia foto / coche)
  useEffect(() => {
    const fotos = slides[index]?.fotos ?? [];

    const step = () => {
      if (hovering.current) {
        return startCycle(step);
      }

      if (fotos.length === 0) {
        setIndex((i) => (i + 1) % slides.length);
        return resetAndRestart(step);
      }

      setFotoIndex((prev) => {
        const last = fotos.length - 1;

        if (prev < last) {
          lastShownRef.current = false;
          startCycle(step);
          return prev + 1;
        }

        if (!lastShownRef.current) {
          lastShownRef.current = true;
          startCycle(step);
          return prev;
        }

        lastShownRef.current = false;
        setIndex((i) => (i + 1) % slides.length);
        setTimeout(() => resetAndRestart(step), 0);
        return 0;
      });
    };

    resetAndRestart(step);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current as number);
        timerRef.current = null;
      }
    };
  }, [index, slides, interval]);

  const goPrev = () =>
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((i) => (i + 1) % slides.length);
  const goToCar = (id: number) => router.push(`/coches/${id}`);

  const slide = slides[index];
  const fotos = slide.fotos;

  // 🟦 OCULTAR HINTS AL PRIMER TOUCH O CLICK
  useEffect(() => {
    const hide = () => setShowHints(false);

    window.addEventListener("touchstart", hide, { once: true });
    window.addEventListener("mousedown", hide, { once: true });

    const t = setTimeout(hide, 4000);

    return () => {
      window.removeEventListener("touchstart", hide);
      window.removeEventListener("mousedown", hide);
      clearTimeout(t);
    };
  }, []);

  // ⭐ AUTOCENTRADO REAL DEL HINT
  useLayoutEffect(() => {
    if (!showHints || !hintRef.current || hintX === null || hintY === null)
      return;

    const el = hintRef.current;
    const rect = el.getBoundingClientRect();

    el.style.transform = `translate(-${rect.width / 2}px, -${
      rect.height * 0.35
    }px)`;
  }, [showHints, hintX, hintY]);

  return (
    <>
      <div
        className="relative w-full h-[70vh] max-h-[850px] min-h-[350px] overflow-hidden rounded-2xl shadow-2xl group"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
        onTouchStart={(e) => {
          setShowHints(true);
          setTouchStart(e.touches[0].clientX);
          setTouchEnd(null);

          const touch = e.touches[0];
          setHintX(touch.clientX);
          setHintY(touch.clientY);
        }}
        onTouchMove={(e) => {
          const x = e.touches[0].clientX;
          setTouchEnd(x);

          if (!touchStart) return;

          const diff = touchStart - x;
          setHintDirection(diff > 0 ? "right" : "left");
        }}
        onTouchEnd={() => {
          if (touchStart !== null && touchEnd !== null) {
            const diff = touchStart - touchEnd;

            if (Math.abs(diff) > SWIPE_THRESHOLD) {
              if (diff > 0) goNext();
              else goPrev();

              setShowHints(true);
              setTimeout(() => setShowHints(false), 800);
            }
          }

          setTouchStart(null);
          setTouchEnd(null);
        }}
      >
        {/* IMÁGENES */}
        {fotos.map((url, i) => {
          const active = fotoIndex === i;
          return (
            <div
              key={url + i}
              onClick={(e) => {
                if (touchStart !== null && touchEnd !== null) {
                  const diff = touchStart - touchEnd;
                  if (Math.abs(diff) > SWIPE_THRESHOLD) {
                    e.preventDefault();
                    return;
                  }
                }
                goToCar(slide.carId);
              }}
              className={`absolute inset-0 transition-all duration-700 ${
                active
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
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

        {/* ⭐ HINT DINÁMICO EXACTAMENTE EN EL DEDO */}
        {showHints && hintX !== null && hintY !== null && (
          <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
            <div
              ref={hintRef}
              className="absolute flex flex-col items-center gap-2 hint-appear"
              data-dir={hintDirection ?? "right"}
              style={{
                left: hintX,
                top: hintY,
                position: "absolute",
              }}
            >
              {/* Flecha */}
              <div>
                {hintDirection === "left" ? (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18l-7-6 7-6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.45"
                    />
                  </svg>
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 5l7 7-7 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.45"
                    />
                  </svg>
                )}
              </div>

              {/* Icono TAP */}
              <div className="opacity-90">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/6">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flecha izquierda (PC) */}
        <button
          onClick={goPrev}
          className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 
          w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white 
          items-center justify-center shadow-xl
          opacity-0 group-hover:opacity-100 
          transition-all duration-300 hover:scale-110
          hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]
          z-20"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 12l6.29 6.29A1 1 0 0 1 15.5 19z" />
          </svg>
        </button>

        {/* Flecha derecha (PC) */}
        <button
          onClick={goNext}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 
          w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white 
          items-center justify-center shadow-xl
          opacity-0 group-hover:opacity-100 
          transition-all duration-300 hover:scale-110
          hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]
          z-20"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1 0 1.42l-7 7a1 1 0 1 1-1.4-1.42L14.09 12 7.79 5.71A1 1 0 0 1 8.5 5z" />
          </svg>
        </button>
      </div>

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
              className={`w-20 h-14 rounded-lg overflow-hidden shadow-md transition-all ${
                fotoIndex === i
                  ? "scale-110 border-blue-400 border-2"
                  : "opacity-60"
              }`}
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
