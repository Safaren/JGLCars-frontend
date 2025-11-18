"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";
import Link from "next/link";

interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  combustible: string;
  color: string;
  consumo?: number;
  potencia?: number;
  cilindrada?: number;
  anoFabricacion?: number;
  imagenes?: { url: string }[];
}

export default function CarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cars/${params.id}`
        );

        if (!res.ok) {
          return notFound();
        }

        const data = await res.json();
        setCar(data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [params.id]);

  if (!car) {
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Cargando coche...
      </div>
    );
  }

  const images = car.imagenes?.map((i) => i.url) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 mb-32">
      {/* Carrusel */}
      <CarCarousel images={images} />

      {/* INFO */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* IZQUIERDA */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {car.marca} {car.model}
          </h1>

          <p className="text-blue-600 text-3xl font-bold mt-3">
            {car.precio.toLocaleString()} €
          </p>

          {/* ESPECIFICACIONES */}
          <div className="mt-8 space-y-3">
            <p className="text-lg"><strong>Color:</strong> {car.color}</p>
            <p className="text-lg"><strong>Combustible:</strong> {car.combustible}</p>
            {car.anoFabricacion && (
              <p className="text-lg"><strong>Año:</strong> {car.anoFabricacion}</p>
            )}
            {car.potencia && (
              <p className="text-lg"><strong>Potencia:</strong> {car.potencia} CV</p>
            )}
            {car.consumo && (
              <p className="text-lg"><strong>Consumo:</strong> {car.consumo} L/100km</p>
            )}
            {car.cilindrada && (
              <p className="text-lg"><strong>Cilindrada:</strong> {car.cilindrada} cc</p>
            )}
          </div>

          {/* BOTÓN ME INTERESA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              router.push(
                `/contacto?mensaje=${encodeURIComponent(
                  `Estoy interesado en el coche ${car.marca} ${car.model} (ID: ${car.id}).`
                )}`
              )
            }
            className="
              mt-10 bg-blue-600 text-white text-xl px-8 py-3 
              rounded-xl shadow-lg hover:bg-blue-700 transition
            "
          >
            Me interesa
          </motion.button>
        </div>

        {/* DERECHA - GALERÍA PEQUEÑA */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.slice(0, 8).map((img, i) => (
            <img
              key={i}
              src={img}
              className="rounded-lg object-cover w-full h-28 border shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
