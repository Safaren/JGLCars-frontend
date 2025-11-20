// src/app/coches/[id]/CarPageClient.tsx  (o donde lo tengas ubicado)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";

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

export default function CarPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErr(null);

      try {
        // Usamos ruta relativa para que pase por el proxy /api (si lo tienes configurado)
        const res = await fetch(`/api/cars/${encodeURIComponent(id)}`);

        if (res.status === 404) {
          // redirigimos a la página 404 del sitio (cliente)
          router.replace("/404");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          console.error("Error fetching car:", res.status, text);
          if (!mounted) return;
          setErr("No se pudo cargar el coche. Intenta de nuevo.");
          return;
        }

        const data = await res.json();
        if (!mounted) return;
        setCar(data);
      } catch (error) {
        console.error("Error cargando coche:", error);
        if (!mounted) return;
        setErr("Error de red al cargar el coche.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Cargando coche...
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center text-red-600 text-lg mt-20">
        {err}
      </div>
    );
  }

  if (!car) {
    // Si no hay coche (y no se redirigió), mostramos mensaje
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Coche no encontrado.
      </div>
    );
  }

  const images = car.imagenes?.map((i) => i.url) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 mb-32">
      <CarCarousel images={images} />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {car.marca} {car.model}
          </h1>

          <p className="text-blue-600 text-3xl font-bold mt-3">
            {car.precio.toLocaleString()} €
          </p>

          <div className="mt-8 space-y-3">
            <p><strong>Color:</strong> {car.color}</p>
            <p><strong>Combustible:</strong> {car.combustible}</p>
            {car.anoFabricacion && <p><strong>Año:</strong> {car.anoFabricacion}</p>}
            {car.potencia && <p><strong>Potencia:</strong> {car.potencia} CV</p>}
            {car.consumo && <p><strong>Consumo:</strong> {car.consumo} L/100km</p>}
            {car.cilindrada && <p><strong>Cilindrada:</strong> {car.cilindrada} cc</p>}
          </div>

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
            className="mt-10 bg-blue-600 text-white text-xl px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            Me interesa
          </motion.button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.slice(0, 8).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${car.marca} ${car.model} foto ${i + 1}`}
              className="rounded-lg object-cover w-full h-28 border shadow-sm"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
