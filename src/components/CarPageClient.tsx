"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";
import EtiquetaDGT from "@/components/EtiquetaDGT";

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
  descripcion?: string;
  etiqueta?: string;           // ✅ Faltaba este campo
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
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`);

        if (!res.ok) {
          setErr("No encontrado");
          return;
        }

        const data = await res.json();

        if (
          typeof data.anoFabricacion !== "number" ||
          data.anoFabricacion < 1900
        ) {
          data.anoFabricacion = undefined;
        }

        if (!mounted) return;
        setCar(data);
      } catch (error) {
        console.error(error);
        if (!mounted) return;
        setErr("Error cargando los datos");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Cargando coche...
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center text-red-600 text-xl mt-20">{err}</div>
    );
  }

  if (!car) {
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
          <h1 className="text-4xl font-extrabold text-cyan-500">
            {car.marca} {car.model}
          </h1>

          <p className="text-cyan-400 text-3xl font-bold mt-3">
            {car.precio?.toLocaleString?.() ?? car.precio} €
          </p>

          <div className="mt-8 space-y-3 text-gray-800 text-lg">
            <p>
              <strong className="text-amber-500">Modelo:</strong>
              <span className="text-amber-300"> {car.model}</span>
            </p>

            <p>
              <strong className="text-amber-500">Marca:</strong>
              <span className="text-amber-300"> {car.marca}</span>
            </p>

            {car.anoFabricacion && (
              <p>
                <strong className="text-amber-500">Año:</strong>
                <span className="text-amber-300"> {car.anoFabricacion}</span>
              </p>
            )}

            {car.potencia && (
              <p>
                <strong className="text-amber-500">Potencia:</strong>
                <span className="text-amber-300"> {car.potencia} CV</span>
              </p>
            )}

            {car.consumo && (
              <p>
                <strong className="text-amber-500">Consumo:</strong>
                <span className="text-amber-300">
                  {" "}
                  {car.consumo} L/100km
                </span>
              </p>
            )}

            {car.cilindrada && (
              <p>
                <strong className="text-amber-500">Cilindrada:</strong>
                <span className="text-amber-300"> {car.cilindrada} cc</span>
              </p>
            )}
          </div>

          {/* ✅ ETIQUETA AMBIENTAL CORREGIDA */}
          {car.etiqueta && (
            <div className="flex items-center gap-3 mt-6">
              <h4 className="font-semibold text-gray-700">
                Etiqueta ambiental:
              </h4>
              <EtiquetaDGT tipo={car.etiqueta} size={70} />
            </div>
          )}

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
            className="mt-10 bg-amber-600 text-white text-xl px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            Me interesa
          </motion.button>
        </div>

        <aside className="bg-gray-300 p-4 rounded-xl shadow-md">
          <h2 className="font-bold mb-3 text-gray-700 text-center text-3xl">
            Galería
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.slice(0, 12).map((img, i) => (
              <img
                key={i}
                src={img}
                className="rounded-lg object-cover w-full h-28 border shadow-sm"
              />
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-amber-500 mb-4">
          Descripción del coche
        </h3>

        <p className="text-amber-300 leading-relaxed">
          {car.descripcion ||
            "Este vehículo ha sido revisado y comprobado. Para más información, contáctanos y estaremos encantados de ayudarte."}
        </p>
      </div>
    </section>
  );
}
