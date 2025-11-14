"use client";

import { Pieza } from "@/lib/api";

interface Props {
  piezas: Pieza[];
  onEdit: (pieza: Pieza) => void;
  onDelete: (id: number) => void;
}

export default function PiezaTable({ piezas, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white rounded-lg shadow">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Descripción</th>
          <th className="p-2 text-left">Precio (€)</th>
          <th className="p-2 text-left">Coche asociado</th>
          <th className="p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {piezas.map((p) => (
          <tr key={p.id} className="border-t hover:bg-gray-50">
            <td className="p-2">{p.id}</td>
            <td className="p-2">{p.descripcion}</td>
            <td className="p-2">{p.precio.toFixed(2)}</td>
            <td className="p-2">{p.carId ? `ID ${p.carId}` : "No asociado"}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => onEdit(p)}
                className="text-green-700 hover:underline mr-3"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(p.id!)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
