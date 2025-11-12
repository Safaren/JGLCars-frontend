"use client";

interface CarTableProps {
  cars: any[];
  onDelete: (id: number) => void;
  onEdit: (car: any) => void;
}

export default function CarTable({ cars, onDelete, onEdit }: CarTableProps) {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-3">Marca</th>
            <th className="py-2 px-3">Modelo</th>
            <th className="py-2 px-3">Año</th>
            <th className="py-2 px-3">Combustible</th>
            <th className="py-2 px-3">Color</th>
            <th className="py-2 px-3">Precio (€)</th>
            <th className="py-2 px-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-2 px-3">{car.marca}</td>
              <td className="py-2 px-3">{car.model}</td>
              <td className="py-2 px-3">{car.anoFabricacion}</td>
              <td className="py-2 px-3">{car.combustible}</td>
              <td className="py-2 px-3">{car.color}</td>
              <td className="py-2 px-3 font-semibold text-blue-700">
                {car.precio.toLocaleString()}
              </td>
              <td className="py-2 px-3 text-right">
                <button
                  onClick={() => onEdit(car)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(car.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cars.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No hay coches registrados</p>
      )}
    </div>
  );
}
