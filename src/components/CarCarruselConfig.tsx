"use client";

import { useState } from "react";

export default function CarCarruselConfig({ car, onSave }) {
  const [destacado, setDestacado] = useState(car.destacado ?? false);
  const [seleccionadas, setSeleccionadas] = useState<string[]>(car.carruselFotos ?? []);

  const toggleImagen = (url: string) => {
    if (seleccionadas.includes(url)) {
      setSeleccionadas(seleccionadas.filter((u) => u !== url));
    } else {
      if (seleccionadas.length >= 3) {
        alert("Solo puedes seleccionar 3 imágenes");
        return;
      }
      setSeleccionadas([...seleccionadas, url]);
    }
  };

  const handleSave = () => {
    onSave({
      destacado,
      carruselFotos: seleccionadas
    });
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white space-y-4">

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="text-lg font-bold">{car.marca} {car.model}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {car.imagenes.map((img) => {
          const isSelected = seleccionadas.includes(img.url);
          return (
            <div
              key={img.url}
              onClick={() => toggleImagen(img.url)}
              className={`
                cursor-pointer rounded-lg border-4 overflow-hidden 
                transition 
                ${isSelected ? "border-orange-500" : "border-transparent"}
              `}
            >
              <img src={img.url} className="w-full h-24 object-cover" />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Guardar
      </button>

    </div>
  );
}
