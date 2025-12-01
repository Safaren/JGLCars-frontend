// src/components/CarCarruselConfig.tsx

"use client";

import { useState, useMemo } from "react";

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
  // Estado inicial seguro
  const [destacado, setDestacado] = useState<boolean>(car.destacado ?? false);
  const [seleccionadas, setSeleccionadas] = useState<string[]>(
    Array.isArray(car.carruselFotos) ? car.carruselFotos : []
  );
  const [error, setError] = useState<string | null>(null);

  // Calcular previsualización ordenada
  const preview = useMemo(() => seleccionadas.slice(0, 3), [seleccionadas]);

  // -------------------------
  //   Seleccionar imagen
  // -------------------------
  const toggleFoto = (url: string) => {
    setError(null); // limpiar errores

    setSeleccionadas((prev) => {
      // Si estaba seleccionada → quitar
      if (prev.includes(url)) {
        return prev.filter((f) => f !== url);
      }

      // Si no estaba seleccionada → añadir
      if (prev.length >= 3) {
        setError("Solo puedes seleccionar un máximo de 3 imágenes");
        return prev;
      }

      return [...prev, url];
    });
  };

  // -------------------------
  //   Guardar cambios
  // -------------------------
  const handleSave = async () => {
    await onSave({
      destacado,
      carruselFotos: seleccionadas,
    });
  };

  // -------------------------
  //   Limpiar selección
  // -------------------------
  const clearSelection = () => {
    setSeleccionadas([]);
    setError(null);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-8 border max-w-3xl mx-auto">

      {/* Título */}
      <h2 className="text-2xl font-bold text-blue-700">
        Carrusel — Coche #{car.id}
      </h2>

      {/* DESTACADO */}
      <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
        <input
          type="checkbox"
          id={`dest-${car.id}`}
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
          className="w-5 h-5 accent-blue-600"
        />
        <label htmlFor={`dest-${car.id}`} className="text-lg font-medium">
          Mostrar este coche como <b>destacado</b> en la portada
        </label>
      </div>

      {/* CONTADOR */}
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-medium">
          Imágenes seleccionadas:{" "}
          <span className="text-blue-600">{seleccionadas.length}</span> / 3
        </p>

        {seleccionadas.length > 0 && (
          <button
            onClick={clearSelection}
            className="text-sm text-red-600 hover:underline"
          >
            Limpiar selección
          </button>
        )}
      </div>

      {/* ERRORES */}
      {error && (
        <p className="text-red-600 text-center font-semibold">{error}</p>
      )}

      {/* PREVISUALIZACIÓN DEL CARRUSEL */}
      {preview.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Vista previa:</h3>
          <div className="flex gap-3">
            {preview.map((url) => (
              <img
                key={url}
                src={url}
                className="w-28 h-20 object-cover rounded-lg border shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* LISTA DE FOTOS */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Imágenes disponibles:</h3>

        {car.imagenes?.length === 0 && (
          <p className="text-gray-500 italic">Este coche no tiene imágenes.</p>
        )}

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {car.imagenes?.map((imagen) => {
            const url = imagen.url;
            const isSelected = seleccionadas.includes(url);

            return (
              <button
                key={url}
                onClick={() => toggleFoto(url)}
                className={`relative rounded-lg overflow-hidden border shadow transition transform hover:scale-[1.03]
                  ${isSelected ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"}
                `}
              >
                <img
                  src={url}
                  alt="imagen del coche"
                  className="w-full h-28 object-cover"
                />

                {/* Overlay selección */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-700 bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg drop-shadow">SELECCIONADA</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4">
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
