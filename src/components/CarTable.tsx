"use client";

import { Car } from "@/types";

interface Props {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
}

export default function CarTable({ cars, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Foto</th>
            <th className="px-3 py-2">Marca / Modelo</th>
            <th className="px-3 py-2">Año</th>
            <th className="px-3 py-2">Color</th>
            <th className="px-3 py-2">Precio</th>
            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 w-24">
                {car.imagenes?.[0] ? (
                  <img
                    src={car.imagenes[0].url}
                    alt={`${car.marca} ${car.model}`}
                    className="w-20 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                    Sin foto
                  </div>
                )}
              </td>

              <td className="px-3 py-2">
                <div className="font-semibold">{car.marca} {car.model}</div>
              </td>

              <td className="px-3 py-2">{car.anoFabricacion || "-"}</td>
              <td className="px-3 py-2">{car.color}</td>
              <td className="px-3 py-2 font-bold">
                {car.precio.toLocaleString()} €
              </td>

              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(car)}
                    className="px-3 py-1 rounded bg-yellow-400 text-white text-sm hover:brightness-90"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(car.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:brightness-90"
                  >
                    Borrar
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {cars.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No hay coches.</p>
      )}
    </div>
  );
}
