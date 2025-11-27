"use client";

import { useState } from "react";
import { saveFieldConfig, loadFieldConfig } from "@/config/carFields";
import toast from "react-hot-toast";


export default function CarFieldsConfig() {
  const [fields, setFields] = useState(loadFieldConfig());

  const toggle = (k: string, prop: "visible" | "editable") => {
    const updated = {
      ...fields,
      [k]: { ...fields[k], [prop]: !fields[k][prop] },
    };
    setFields(updated);
  };

  const handleSave = () => {
    saveFieldConfig(fields);
    // Disparamos evento para avisar a otros componentes (CarForm, CarTable) que recarguen
    window.dispatchEvent(new Event("car_fields_updated"));

    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Configurar campos</h2>

      {Object.entries(fields).map(([k, cfg]) => (
        <div key={k} className="flex items-center justify-between border-b py-2">
          <span>{cfg.label}</span>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cfg.visible}
                onChange={() => toggle(k, "visible")}
              />
              <span className="text-sm">Visible</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cfg.editable}
                onChange={() => toggle(k, "editable")}
              />
              <span className="text-sm">Editable</span>
            </label>
          </div>
        </div>
      ))}

      <div className="mt-4 flex gap-3 justify-end">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
