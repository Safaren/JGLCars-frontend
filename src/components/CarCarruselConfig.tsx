"use client";

import { useState } from "react";

interface CarImage {
  url: string;
}

interface Car {
  id: number;
  destacado?: boolean;
  carruselFotos?: string[];
  imagenes?: CarImage[];
}

interface Props {
  car: Car;
  onSave: (data: { destacado: boolean; carruselFotos: string[] }) => Promise<void>;
  onCancel?: () => void;
}


export default function CarCarruselConfig({ car, onSave, onCancel }: Props) {
  const [destacado, setDestacado] = useState<boolean>(car.destacado ?? false);
  const [seleccionadas, setSeleccionadas] = useState<string[]>(
    car.carruselFotos ?? []
  );

  const toggleFoto = (url: string) => {
    setSeleccionadas((prev) =>
      prev.includes(url) ? prev.filter((f) => f !== url) : [...prev, url]
    );
  };

  const handleSave = async () => {
    await onSave({
      destacado,
      carruselFotos: seleccionadas,
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-600">
        Configurar carrusel del coche #{car.id}
      </h2>

      {/* DESTACADO */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="destacado"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
          className="w-5 h-5 text-blue-600"
        />
        <label htmlFor="destacado" className="text-lg font-medium">
          Destacar este coche en portada
        </label>
      </div>

      {/* LISTA DE FOTOS */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Seleccionar fotos del carrusel:</h3>

        {car.imagenes?.length === 0 && (
          <p className="text-gray-500 italic">Este coche no tiene imágenes.</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {car.imagenes?.map((imagen) => {
            const selected = seleccionadas.includes(imagen.url);

            return (
              <button
                key={imagen.url}
                onClick={() => toggleFoto(imagen.url)}
                className={`relative group rounded overflow-hidden border ${
                  selected ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
                }`}
              >
                <img
                  src={imagen.url}
                  className="w-full h-28 object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Overlay selección */}
                {selected && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">✔</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4 mt-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
