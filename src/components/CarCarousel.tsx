"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SimpleCarouselProps {
  images: string[];
  interval?: number;
  showThumbnails?: boolean;
  carId?: number; // ⭐ NUEVO
}

export default function SimpleCarousel({
  images,
  interval = 3000,
  showThumbnails = true,
  carId,
}: SimpleCarouselProps) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const startX = useRef<number | null>(null);
  const minSwipe = 50;

  useEffect(() => setIndex(0), [images]);

  useEffect(() => {
    if (!images.length || hovering) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(t);
  }, [images, interval, hovering]);

  const goPrev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const diff = e.changedTouches[0].clientX - startX.current;

    if (diff > minSwipe) goPrev();
    else if (diff < -minSwipe) goNext();

    startX.current = null;
  };

  const handleClick = () => {
    if (carId) {
      router.push(`/coches/${carId}`);
    }
  };

  if (!images.length)
    return <div className="w-full h-72 bg-gray-200" />;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* SLIDER */}
      <div
        className="group relative w-full rounded-xl overflow-hidden shadow-lg bg-black"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className="relative w-full h-[45vh] min-h-[220px] cursor-pointer"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`slide-${i}`}
              fill
              className={`absolute inset-0 object-contain transition-opacity duration-700 ${
                index === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* FLECHA PREV */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="
            hidden sm:flex
            absolute left-4 top-1/2 -translate-y-1/2
            w-14 h-14 rounded-full bg-lineal-to-br from-black/40 to-black/10
            backdrop-blur-md border border-white/20 text-white
            items-center justify-center shadow-xl opacity-0 group-hover:opacity-100
            transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_#3b82f6] hover:-translate-x-2
          "
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 12l6.29 6.29A1 1 0 0 1 15.5 19z" />
          </svg>
        </button>

        {/* FLECHA NEXT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="
            hidden sm:flex
            absolute right-4 top-1/2 -translate-y-1/2
            w-14 h-14 rounded-full bg-lineal-to-br from-black/40 to-black/10
            backdrop-blur-md border border-white/20 text-white
            items-center justify-center shadow-xl opacity-0 group-hover:opacity-100
            transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_#3b82f6] hover:translate-x-2
          "
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1 0 1.42l-7 7a1 1 0 1 1-1.4-1.42L14.09 12 7.79 5.71A1 1 0 0 1 8.5 5z" />
          </svg>
        </button>

        {/* DOTS */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-white scale-110" : "bg-white/40"
              } transition`}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS */}
      {showThumbnails && (
        <div className="flex gap-2 justify-center flex-wrap">
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-16 h-16 rounded-md overflow-hidden border cursor-pointer ${
                index === i ? "border-blue-500" : "border-gray-400"
              }`}
            >
              <img
                src={src}
                className="w-full h-full object-cover"
                alt={`thumb-${i}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
