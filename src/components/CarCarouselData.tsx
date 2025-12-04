"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { CarForFrontend } from "@/types/CarForFrontend";
import { FieldConfig } from "@/types/FieldConfig";


interface Props {
  cars: CarForFrontend[];
  interval?: number;
  showThumbnails?: boolean;
  carId: number;
  images: string[];
  fieldConfig: Record<string, FieldConfig>;
}

export default function CarCarouselGlobal({
  cars,
  interval = 4500,
  showThumbnails = true,
}: Props) {
  const router = useRouter();

  if (!Array.isArray(cars) || cars.length === 0) {
    return null;
  }

  // PREPARAR SLIDES
  const slides = cars.map((car) => {
    const fotos =
      Array.isArray(car.carruselFotos) && car.carruselFotos.length > 0
        ? car.carruselFotos
        : (car.imagenes ?? []).map((img) => img.url);

    return {
      carId: car.id,
      fotos,
      marca: car.marca,
      model: car.model,
      precio: car.precio,
      combustible: car.combustible,
      anoFabricacion: car.anoFabricacion,
    };
  });

  const [index, setIndex] = useState(0);
  const [fotoIndex, setFotoIndex] = useState(0);
  const hovering = useRef(false);

  // AUTO-ROTACIÓN DE COCHES
  useEffect(() => {
    if (slides.length === 0) return;

    const t = setInterval(() => {
      if (!hovering.current) {
        setIndex((prev) => (prev + 1) % slides.length);
        setFotoIndex(0);
      }
    }, interval);

    return () => clearInterval(t);
  }, [slides.length, interval]);

  // AUTO-ROTACIÓN DE MINIATURAS
  useEffect(() => {
    const fotos = slides[index].fotos;
    if (fotos.length <= 1) return;

    const t = setInterval(() => {
      if (!hovering.current) {
        setFotoIndex((f) => (f + 1) % fotos.length);
      }
    }, 2500);

    return () => clearInterval(t);
  }, [index, slides]);

  const goPrev = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    setFotoIndex(0);
  };

  const goNext = () => {
    setIndex((i) => (i + 1) % slides.length);
    setFotoIndex(0);
  };

  const goToCar = (id: number) => {
    router.push(`/coches/${id}`);
  };

  const slide = slides[index];
  const fotos = slide.fotos;

  return (
    <>
      {/* CARRUSEL PRINCIPAL */}
      <div
        className="relative w-full h-[70vh] max-h-[850px] min-h-[350px] overflow-hidden rounded-2xl shadow-2xl group"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        {/* SLIDES */}
        {fotos.map((url, i) => {
          const active = fotoIndex === i;
          return (
            <div
              key={url}
              onClick={() => goToCar(slide.carId)}
              className={`absolute inset-0 transition-all duration-[900] ease-[cubic-bezier(.45,.05,.55,.95)] 
                ${active ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}
              `}
            >
              {/* Imagen */}
              <Image
                src={url}
                alt={`${slide.marca} ${slide.model}`}
                fill
                className="object-cover brightness-[0.80]"
                priority={i === 0}
              />

              {/* Texto */}
              <div className="absolute bottom-12 left-12 text-white drop-shadow-lg">
                <h2 className="text-4xl font-extrabold">
                  {slide.marca} {slide.model}
                </h2>
                <p className="text-xl mt-1 opacity-90">{slide.combustible}</p>
                <p className="text-3xl font-bold mt-2 text-blue-300">
                  {slide.precio?.toLocaleString()} €
                </p>
              </div>
            </div>
          );
        })}

        {/* FLECHA IZQ */}
        <button
          onClick={goPrev}
          className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 12l6.29 6.29A1 1 0 0 1 15.5 19z" />
          </svg>
        </button>

        {/* FLECHA DER */}
        <button
          onClick={goNext}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md text-white items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1 0 1.42l-7 7a1 1 0 1 1-1.4-1.42L14.09 12 7.79 5.71A1 1 0 0 1 8.5 5z" />
          </svg>
        </button>

        {/* DOTS (entre coches) */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setFotoIndex(0);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === i ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS DEBAJO DEL CARRUSEL */}
      {showThumbnails && fotos.length > 1 && (
        <div className="w-full flex justify-center gap-3 mt-5">
          {fotos.map((url, i) => (
            <button
              key={url}
              onClick={() => setFotoIndex(i)}
              className={`w-20 h-14 overflow-hidden rounded-lg border shadow-md transition-all
                ${fotoIndex === i ? "scale-110 border-blue-400" : "opacity-60"}
              `}
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
