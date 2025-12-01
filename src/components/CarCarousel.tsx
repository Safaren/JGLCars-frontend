// src/components/CarCard.tsx

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CarForFrontend } from "@/types/CarForFrontend";
import EtiquetaDGT from "@/components/EtiquetaDGT";

interface FieldConfig {
  label: string;
  visible: boolean;
  editable: boolean;
  type?: string;
  options?: string[];
}

interface CarCardProps {
  car: CarForFrontend; // Aseguramos que car es recibido como prop
  fieldConfig: Record<string, FieldConfig>; // Ahora car tiene la propiedad `fieldConfig`
}

export default function CarCard({ car, fieldConfig }: CarCardProps) {
  const img = car.imagenes?.[0]?.url || "/no-image.jpg";
  const href = `/coches/${car.id}`;

  const [liked, setLiked] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;

    setLiked(true);

    const mensaje = `Me interesa el coche ${car.marca} ${car.model}`;

    setTimeout(() => {
      window.location.href = `/contacto?carId=${car.id}&mensaje=${encodeURIComponent(mensaje)}`;
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 transition cursor-pointer"
    >
      <Link href={href}>
        <div className="relative w-full h-56 bg-gray-100">
          <Image
            src={img}
            alt={`${car.marca ?? ""} ${car.model ?? ""}`}
            fill
            className="object-cover"
          />

          <motion.button
            onClick={handleHeartClick}
            aria-label="Me interesa"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/30 backdrop-blur shadow-lg transition flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              animate={{
                scale: liked ? [1, 1.18, 1] : 1,
                fill: liked ? "#ff6b81" : "transparent",
              }}
              transition={{
                scale: { duration: 0.35, ease: "easeOut" },
                fill: { duration: 3, ease: "linear" },
              }}
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.172 5.172a4.5 4.5 0 016.364 0L12 7.636l2.464-2.464a4.5 4.5 0 116.364 6.364L12 21.364l-8.828-8.828a4.5 4.5 0 010-6.364z"
              />
            </motion.svg>
          </motion.button>

          {car.anoFabricacion && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {car.anoFabricacion}
            </span>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            {car.marca} {car.model}
          </h3>

          <p className="text-blue-600 font-extrabold text-2xl">
            {car.precio?.toLocaleString()} €
          </p>

          <div className="text-gray-700 text-sm flex flex-wrap items-center gap-x-6 mt-2">
            {/* Solo mostrar los campos que estén configurados como visibles */}
            {fieldConfig.potencia?.visible && car.potencia && (
              <span className="flex items-center gap-1">
                <IconPotencia />
                <strong className="text-gray-800">{car.potencia} CV</strong>
              </span>
            )}

            {fieldConfig.combustible?.visible && car.combustible && (
              <span className="flex items-center gap-1">
                <IconCombustible />
                <strong className="text-gray-800">{car.combustible}</strong>
              </span>
            )}

            {fieldConfig.ambiental?.visible && car.ambiental && (
              <span className="flex items-center">
                <EtiquetaDGT tipo={car.ambiental} size={32} />
              </span>
            )}

            {fieldConfig.km?.visible && car.km != null && (
              <span className="flex items-center gap-1">
                <strong className="text-gray-800">
                  {car.km.toLocaleString()} km
                </strong>
              </span>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center bg-blue-600 text-white py-2 rounded-xl mt-2 font-semibold"
          >
            Ver detalles
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
