
"use client";

import { useEffect, useState } from "react";
import { Pieza } from "@/lib/types";
import { getPiezas } from "@/lib/api";
import PiezaCard from "@/components/PiezaCard"; // lo creamos ahora (tipo CarCard)

export default function PiezasPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);

  useEffect(() => {
    getPiezas().then(setPiezas);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Piezas disponibles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {piezas.map(pieza => (
          <PiezaCard key={pieza.id} pieza={pieza} />
        ))}
      </div>
    </div>
  );
}
