import Link from "next/link";
import type { Pieza } from "@/lib/types";

interface PiezaCardProps {
  pieza: Pieza;
}

export default function PiezaCard({ pieza }: PiezaCardProps) {
  const foto = pieza.fotos?.[0]?.url;

  return (
    <Link href={`/admin/piezas/${pieza.id}`}>
      <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="h-40 bg-gray-200 flex items-center justify-center">
          {foto ? (
            <img src={foto} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">Sin imagen</span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold">{pieza.descripcion}</h3>
          <p className="text-sm text-gray-500">ID: {pieza.id}</p>
          <p className="text-blue-600 font-bold mt-2">
            {pieza.precio} €
          </p>
        </div>
      </div>
    </Link>
  );
}
