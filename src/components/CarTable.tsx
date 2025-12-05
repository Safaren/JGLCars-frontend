// src/components/CarTable.tsx

"use client";

import { loadFieldConfig } from "@/config/carFields";
import type { CarForFrontend } from "@/types/CarForFrontend";

interface Props {
  cars: CarForFrontend[];
  onEdit: (car: CarForFrontend) => void;
  onDelete: (id: number) => void;
}

export default function CarTable({ cars, onEdit, onDelete }: Props) {
  const FIELD_CONFIG = loadFieldConfig();
 const visibleFields = Object.entries(FIELD_CONFIG).filter(
  ([key, cfg]) => cfg.visible && (key === "marca" || key === "model")
);


  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Foto</th>

            {visibleFields.map(([key, cfg]) => (
              <th key={key} className="px-3 py-2">
                {cfg.label}
              </th>
            ))}

            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 w-24">
                {car.imagenes?.[0]?.url ? (
                  <img
                    src={car.imagenes[0].url}
                    className="w-20 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                    Sin foto
                  </div>
                )}
              </td>

              {visibleFields.map(([key]) => (
                <td key={key} className="px-3 py-2">
                  {(car as any)[key] ?? "-"}

                </td>
              ))}

              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(car)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(car.id!)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
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
        <p className="text-center text-gray-500 mt-4">No hay coches.</p>
      )}
    </div>
  );
}
