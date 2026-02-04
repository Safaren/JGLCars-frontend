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
  carruselMode?: string;
  imagenes?: CarImage[];
}

interface Props {
  car: Car;
  onSave: (data: { destacado: boolean; carruselFotos: string[]; carruselMode: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function CarCarruselConfig({ car, onSave, onCancel }: Props) {
  // Estado inicial seguro
  const [carruselMode, setCarruselMode] = useState<"custom" | "auto">(
    (car.carruselMode as "custom" | "auto") ?? "custom"
  );
  const [destacado, setDestacado] = useState<boolean>(car.destacado ?? false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string>(
    Array.isArray(car.carruselFotos) && car.carruselFotos.length > 0
      ? car.carruselFotos[0]
      : ""
  );
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

    if (carruselMode === "custom") {
      // En modo custom solo 1 foto
      setFotoSeleccionada(fotoSeleccionada === url ? "" : url);
    } else {
      // En modo auto hasta 3 fotos
      setSeleccionadas((prev) => {
        if (prev.includes(url)) {
          return prev.filter((f) => f !== url);
        }
        if (prev.length >= 3) {
          setError("Solo puedes seleccionar un máximo de 3 imágenes");
          return prev;
        }
        return [...prev, url];
      });
    }
  };

  // -------------------------
  //   Guardar cambios
  // -------------------------
  

  // -------------------------
  //   Guardar cambios
  // -------------------------
  const handleSave = async () => {
    const fotosAGuardar = carruselMode === "custom" ? 
      (fotoSeleccionada ? [fotoSeleccionada] : []) 
      : seleccionadas;
    
    await onSave({
      destacado,
      carruselFotos: fotosAGuardar,
      carruselMode,
    });
  };

  // -------------------------
  //   Limpiar selección
  // -------------------------
  const clearSelection = () => {
    if (carruselMode === "custom") {
      setFotoSeleccionada("");
    } else {
      setSeleccionadas([]);
    }
    setError(null);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-8 border max-w-3xl mx-auto">
{/* Botón volver si viene del panel */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-blue-600 underline mb-3"
        >
          ← Volver
        </button>
      )}

      {/* Título */}
      <h2 className="text-2xl font-bold text-blue-700">
        Carrusel — Coche #{car.id}
      </h2>

      {/* SELECTOR DE MODO */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
        <p className="text-sm font-semibold text-gray-700 mb-3">Modo de carrusel:</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCarruselMode("custom");
              setError(null);
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
              carruselMode === "custom"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
            }`}
          >
            📸 Una foto (personalizado)
          </button>
          <button
            onClick={() => {
              setCarruselMode("auto");
              setError(null);
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
              carruselMode === "auto"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
            }`}
          >
            🔄 Todas las fotos (automático)
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {carruselMode === "custom"
            ? "Selecciona 1 foto que representará a este coche en el carrusel de inicio"
            : "El coche mostrará todas sus imágenes en el carrusel de inicio"}
        </p>
      </div>

      {/* DESTACADO - Solo para modo automático */}
      {carruselMode === "auto" && (
        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
          <input
            type="checkbox"
            id={`dest-${car.id}`}
            checked={destacado}
            onChange={(e) => setDestacado(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
          <label htmlFor={`dest-${car.id}`} className="text-lg font-medium">
            Mostrar como <b>destacado</b> en portada
          </label>
        </div>
      )}

      {/* CONTADOR */}
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-medium">
          Imágenes seleccionadas:{" "}
          <span className="text-blue-600">
            {carruselMode === "custom" ? (fotoSeleccionada ? 1 : 0) : seleccionadas.length}
          </span>{" "}
          / {carruselMode === "custom" ? 1 : 3}
        </p>

        {(carruselMode === "custom" ? fotoSeleccionada : seleccionadas.length > 0) && (
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
      {carruselMode === "custom" && fotoSeleccionada && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Foto seleccionada:</h3>
          <img
            src={fotoSeleccionada}
            className="w-48 h-40 object-cover rounded-lg border-2 border-blue-400 shadow"
          />
        </div>
      )}

      {carruselMode === "auto" && preview.length > 0 && (
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
            const isSelected = carruselMode === "custom" ? fotoSeleccionada === url : seleccionadas.includes(url);

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
                    <span className="text-white font-bold text-lg drop-shadow">
                      {carruselMode === "custom" ? "✓" : "SELECCIONADA"}
                    </span>
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
