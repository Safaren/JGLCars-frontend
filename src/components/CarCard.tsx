"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CarForFrontend } from "@/types/CarForFrontend";
import EtiquetaDGT from "@/components/EtiquetaDGT";

/* ============================================
   ICONOS MEJORADOS
============================================ */

// 🔧 ICONO POTENCIA (motor / CV)
const IconPotencia = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

// ⛽ ICONO COMBUSTIBLE
const IconCombustible = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 3h12v18H3z" />
    <path d="M16 8l3 3v7a2 2 0 1 1-4 0V8a2 2 0 0 1 4 0" />
  </svg>
);

// 🛣️ ICONO KILÓMETROS
const IconKm = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l4 9H8l4-9zm0 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

/* ============================================
   COMPONENTE PRINCIPAL
============================================ */

export default function CarCard({ car }: { car: CarForFrontend }) {
  const img = car.imagenes?.[0]?.url || "/no-image.jpg";
  const href = `/coches/${car.id}`;

  // ❤️ Estado del corazón
  const [liked, setLiked] = useState(false);

   const handleHeartClick = (e: React.MouseEvent) => {
    // Evita que se abra la ficha del coche
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;

    setLiked(true);

    // Texto pre-relleno para el formulario
    const mensaje = `Me interesa el coche ${car.marca} ${car.model}`;

    // Redirección a los 3 segundos con mensaje pre-cargado
    setTimeout(() => {
      window.location.href = 
        `/contacto?carId=${car.id}&mensaje=${encodeURIComponent(mensaje)}`;
    }, 300);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="
        bg-white rounded-2xl shadow-md hover:shadow-xl
        overflow-hidden border border-gray-100 
        transition cursor-pointer
      "
    >
      <Link href={href}>
        {/* IMAGEN */}
        <div className="relative w-full h-56 bg-gray-100">
          <Image
            src={img}
            alt={`${car.marca ?? ""} ${car.model ?? ""}`}
            fill
            className="object-cover"
          />

          {/* ❤️ CORAZÓN SIEMPRE VISIBLE (botón) */}
          <motion.button
            onClick={handleHeartClick}
            aria-label="Me interesa"
            className="
              absolute top-3 right-3 
              p-2 rounded-full 
              bg-white/30 backdrop-blur 
              shadow-lg transition
              flex items-center justify-center
            "
            // pequeño feedback al tocar
            whileTap={{ scale: 0.95 }}
          >
            {/* SVG corazón: stroke blanco, fill animable vía Framer Motion */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              // animaciones: pop corto y relleno largo (3s)
              animate={{
                scale: liked ? [1, 1.18, 1] : 1,
                fill: liked ? "#ff6b81" : "transparent",
              }}
              transition={{
                scale: { duration: 0.35, ease: "easeOut" },
                fill: { duration: 3, ease: "linear" }, // relleno suave en 3s
              }}
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.172 5.172a4.5 4.5 0 016.364 0L12 
                   7.636l2.464-2.464a4.5 4.5 0 116.364 
                   6.364L12 21.364l-8.828-8.828a4.5 
                   4.5 0 010-6.364z"
              />
            </motion.svg>
          </motion.button>

          {/* Año en óvalo naranja */}
          {car.anoFabricacion && (
            <span
              className="
                absolute top-2 left-2 
                bg-orange-500 text-white 
                px-3 py-1 
                rounded-full 
                text-xs font-bold shadow-md
              "
            >
              {car.anoFabricacion}
            </span>
          )}
        </div>

        {/* INFO */}
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            {car.marca} {car.model}
          </h3>

          <p className="text-blue-600 font-extrabold text-2xl">
            {car.precio?.toLocaleString()} €
          </p>

          {/* Línea de especificaciones */}
          <div className="text-gray-700 text-sm flex flex-wrap items-center gap-x-6 mt-2">
            {car.potencia && (
              <span className="flex items-center gap-1">
                <IconPotencia />
                <strong className="text-gray-800">{car.potencia} CV</strong>
              </span>
            )}

            {car.combustible && (
              <span className="flex items-center gap-1">
                <IconCombustible />
                <strong className="text-gray-800">{car.combustible}</strong>
              </span>
            )}

            {car.ambiental && (
              <span className="flex items-center">
                <EtiquetaDGT tipo={car.ambiental} size={32} />
              </span>
            )}

            {car.km != null && (
              <span className="flex items-center gap-1">
                <strong className="text-gray-800">
                  {car.km.toLocaleString()} km
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* BOTÓN */}
        <div className="px-4 pb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="
              text-center bg-blue-600 text-white 
              py-2 rounded-xl mt-2 font-semibold
            "
          >
            Ver detalles
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
