"use client";

interface Props {
  piezas: any[];
  onEdit: (pieza: any) => void;
  onDelete: (id: number) => void;
}

export default function PiezaTable({ piezas, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white rounded-lg shadow">
      <thead className="bg-blue-600 text-white">
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
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.id}</td>
            <td className="p-2">{p.descripcion}</td>
            <td className="p-2">{p.precio.toFixed(2)}</td>
            <td className="p-2">{p.car?.marca} {p.car?.model} (ID {p.carId})</td>
            <td className="p-2 text-center">
              <button
                onClick={() => onEdit(p)}
                className="text-blue-600 hover:underline mr-3"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(p.id)}
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
