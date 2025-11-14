"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  color: string;
  imagenes?: { url: string }[];
}

export default function CarCard({ car }: { car: Car }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
    >
      <Link href={`/coches/${car.id}`}>
        <div className="relative h-48 bg-gray-200">
          {car.imagenes?.length ? (
            <img
              src={car.imagenes[0].url}
              alt={`${car.marca} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg">
            {car.marca} {car.model}
          </h3>
          <p className="text-sm text-gray-600">Color: {car.color}</p>
          <p className="text-blue-600 font-bold mt-2">
            {car.precio.toLocaleString()} €
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
