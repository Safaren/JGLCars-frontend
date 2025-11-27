"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CarouselImage {
  url: string;
  marca: string;
  model: string;
  combustible: string;
  precio: number;
  anoFabricacion: number;
  carId: number;
}

interface Props {
  images: string[];
  interval?: number;
  marca?: string;
  model?: string;
  combustible?: string;
  precio?: number;
  anoFabricacion?: number;
  carId?: number;
  videos?: string[];
}

export default function CarCarousel(props: Props) {
  const router = useRouter();

  const {
    images,
    videos = [],
    interval = 3500,
    marca,
    model,
    combustible,
    precio,
    anoFabricacion,
    carId,
  } = props;

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  // ⭐ Modal vídeo
  const [videoModal, setVideoModal] = useState<string | null>(null);

  // ⭐ SWIPE — refs
  const startX = useRef<number | null>(null);
  const minSwipe = 50;

  useEffect(() => setIndex(0), [images]);

  useEffect(() => {
    if (!images.length || hovering) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval, hovering]);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  // ⭐ MINIATURA video YouTube
  const videoThumb = (url: string) => {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]+)/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : "";
  };

  // ⭐ Mezcla imágenes + vídeos
  const slides = [
    ...images.map((u) => ({ type: "image" as const, url: u })),
    ...videos.map((u) => ({
      type: "video" as const,
      url: u,
      thumb: videoThumb(u),
    })),
  ];

  const clickToCar = () => {
    if (carId) router.push(`/coches/${carId}`);
  };

  // ⭐ SWIPE HANDLERS
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = () => {
    // No necesitamos nada aquí, pero permite extenderlo si haces animación
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;

    const diff = e.changedTouches[0].clientX - startX.current;

    if (diff > minSwipe) {
      goPrev();
    } else if (diff < -minSwipe) {
      goNext();
    }

    startX.current = null;
  };

  if (images.length === 0)
    return <div className="w-full h-72 bg-gray-200"></div>;

  return (
    <div className="w-full flex flex-col gap-4">

      <div
        className="group relative w-full rounded-xl overflow-hidden shadow-2xl bg-black"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* SLIDER IMAGES */}
        <div
          className="relative w-full h-[65vh] max-h-[800px] min-h-[300px] cursor-pointer"
          onClick={clickToCar}
          // ⭐ SWIPE
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="foto coche"
              fill
              className={`absolute inset-0 object-contain transition-opacity duration-700 ${
                index === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* AÑO */}
          {anoFabricacion && (
            <span className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {anoFabricacion}
            </span>
          )}

          {/* PRECIO */}
          {precio && (
            <span className="absolute top-3 right-3 bg-blue-600/80 text-white px-4 py-2 rounded-lg text-lg font-semibold shadow-xl backdrop-blur-sm">
              {precio.toLocaleString()} €
            </span>
          )}

          {/* INFO */}
          {(marca || model || combustible) && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                {marca} {model}
              </p>
              <p className="text-sm opacity-70">{combustible}</p>
            </div>
          )}
        </div>

        {/* FLECHA PREV */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="
            hidden sm:flex
            absolute left-4 top-1/2 -translate-y-1/2
            w-14 h-14
            rounded-full
            bg-lineal from-black/40 to-black/10
            backdrop-blur-md
            border border-white/20
            text-white
            items-center justify-center
            shadow-xl
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            hover:scale-110 hover:shadow-[0_0_15px_#3b82f6]
            hover:-translate-x-2
          "
        >
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 12l6.29 6.29A1 1 0 0 1 15.5 19z"/>
          </svg>
        </button>

        {/* FLECHA NEXT */}
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="
            hidden sm:flex
            absolute right-4 top-1/2 -translate-y-1/2
            w-14 h-14
            rounded-full
            bg-lineal-to-br from-black/40 to-black/10
            backdrop-blur-md
            border border-white/20
            text-white
            items-center justify-center
            shadow-xl
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            hover:scale-110 hover:shadow-[0_0_15px_#3b82f6]
            hover:translate-x-2
          "
        >
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1 0 1.42l-7 7a1 1 0 1 1-1.4-1.42L14.09 12 7.79 5.71A1 1 0 0 1 8.5 5z"/>
          </svg>
        </button>

        {/* PUNTOS */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-white scale-110 shadow-md" : "bg-white/40"
              } transition`}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS */}
      <div className="flex gap-2 justify-center flex-wrap z-20">
        {slides.map((s, i) => (
          <div
            key={i}
            role="button"
            onClick={() => setIndex(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden border cursor-pointer ${
              i === index ? "border-blue-500" : "border-gray-400"
            }`}
          >
            {s.type === "image" ? (
              <img src={s.url} className="w-full h-full object-cover" alt="miniatura" />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={s.thumb || ""}
                  alt="thumb vídeo"
                  className="w-full h-full object-cover"
                  onError={(ev) => {
                    (ev.currentTarget as HTMLImageElement).style.backgroundColor = "#111";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-white text-xl opacity-90">▶</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
