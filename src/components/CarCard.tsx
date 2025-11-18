"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  color: string;
  anoFabricacion?: number;
  combustible?: string;
  imagenes?: { url: string }[];
}

export default function CarCard({ car }: { car: Car }) {
  const img = car.imagenes?.[0]?.url || "/no-image.jpg";

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
      <Link href={`/coches/${car.id}`}>
        {/* IMAGEN */}
        <div className="relative w-full h-56 bg-gray-100">
          <Image
            src={img}
            alt={`${car.marca} ${car.model}`}
            fill
            className="object-cover"
          />

          {/* Etiqueta año */}
          {car.anoFabricacion && (
            <span className="
              absolute top-2 left-2 bg-black/70 text-white 
              px-3 py-1 rounded-full text-xs font-semibold
            ">
              {car.anoFabricacion}
            </span>
          )}
        </div>

        {/* INFO */}
        <div className="p-4 space-y-1">
          <h3 className="text-lg font-bold text-gray-800">
            {car.marca} {car.model}
          </h3>

          <p className="text-gray-500 text-sm">
            Color: <span className="text-gray-700">{car.color}</span>
          </p>

          {car.combustible && (
            <p className="text-gray-500 text-sm">
              Combustible:{" "}
              <span className="text-gray-700">{car.combustible}</span>
            </p>
          )}

          {/* PRECIO */}
          <p className="text-blue-600 font-bold text-xl mt-2">
            {car.precio.toLocaleString()} €
          </p>
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
