"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
  images: string[];
  thumbSize?: number;
}

export default function GalleryLightbox({ images, thumbSize = 120 }: GalleryLightboxProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = () => setSelected(null);
  const next = () => setSelected((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  const prev = () => setSelected((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (images.length === 0)
    return <p className="text-gray-500 italic">Sin imágenes disponibles</p>;

  return (
    <>
      {/* Miniaturas */}
      <div className="flex flex-wrap gap-3 justify-center">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`imagen-${i}`}
            className="cursor-pointer rounded-lg shadow-sm hover:shadow-lg transition"
            style={{ width: thumbSize, height: thumbSize, objectFit: "cover" }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Imagen ampliada */}
            <motion.img
              key={selected}
              src={images[selected]}
              alt="ampliada"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            />

            {/* Botones */}
            <button
              onClick={close}
              className="absolute top-6 right-6 text-white hover:text-red-400"
            >
              <X size={32} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-6 text-white hover:text-blue-400"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-6 text-white hover:text-blue-400"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
