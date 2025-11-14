"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  images: string[];
  thumbSize?: number;
}

export default function GalleryLightboxMobile({ images, thumbSize = 120 }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const close = () => setSelected(null);
  const paginate = (newDirection: number) => {
    if (selected === null) return;
    const newIndex = (selected + newDirection + images.length) % images.length;
    setDirection(newDirection);
    setSelected(newIndex);
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

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

      {/* Lightbox con carrusel táctil */}
      <AnimatePresence initial={false} custom={direction}>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Cerrar */}
            <button
              onClick={close}
              className="absolute top-6 right-6 text-white hover:text-red-400 z-50"
            >
              <X size={32} />
            </button>

            {/* Contenedor de imagen deslizante */}
            <motion.div
              key={selected}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -1000) paginate(1);
                else if (swipe > 1000) paginate(-1);
              }}
            >
              <img
                src={images[selected]}
                alt="ampliada"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg object-contain"
              />
            </motion.div>

            {/* Indicadores inferiores */}
            <div className="absolute bottom-4 flex gap-2 justify-center w-full">
              {images.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === selected ? "bg-blue-400" : "bg-gray-500"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelected(i)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
