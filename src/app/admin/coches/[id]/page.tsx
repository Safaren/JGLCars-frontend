"use client";

import { useEffect, useState } from "react";
import GalleryLightbox from "@/components/GalleryLightbox";

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="text-center mt-10">Cargando coche...</p>;
  if (!car) return <p className="text-center mt-10">Coche no encontrado</p>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        {car.marca} {car.model}
      </h1>
      <p className="mb-4 text-gray-700">
        {car.combustible} | {car.color} | {car.anoFabricacion}
      </p>

      <GalleryLightbox images={car.imagenes?.map((i: any) => i.url) || []} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Precio: {car.precio} €</h2>
        <p className="text-gray-600">
          Potencia: {car.potencia} CV | Cilindrada: {car.cilindrada} L
        </p>
      </div>
    </div>
  );
}
