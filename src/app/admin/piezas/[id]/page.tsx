"use client";

import { useEffect, useState } from "react";
import GalleryLightbox from "@/components/GalleryLightbox";

export default function PiezaDetailPage({ params }: { params: { id: string } }) {
  const [pieza, setPieza] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/piezas/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPieza(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="text-center mt-10">Cargando pieza...</p>;
  if (!pieza) return <p className="text-center mt-10">Pieza no encontrada</p>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        {pieza.descripcion}
      </h1>
      <p className="text-gray-600 mb-4">
        Precio: {pieza.precio} € | ID Coche: {pieza.carId}
      </p>

      <GalleryLightbox images={pieza.fotos?.map((f: any) => f.url) || []} />
    </div>
  );
}
