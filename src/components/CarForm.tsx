"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CarForFrontend } from "@/types/CarForFrontend";
import { useRouter } from "next/navigation";

import type { CarInput } from "@/types";

interface Props {
  initialData?: CarForFrontend | null;
  onSave: (data: CarInput) => Promise<any>;
  onCancel: () => void;
}


export default function CarForm({ initialData, onSave, onCancel }: Props) {
  const router = useRouter();

  // Campos seguros aunque initialData venga null o undefined
  const [marca, setMarca] = useState(initialData?.marca ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [precio, setPrecio] = useState(
    initialData?.precio != null ? String(initialData.precio) : ""
  );
  const [combustible, setCombustible] = useState(initialData?.combustible ?? "");
  const [anoFabricacion, setAnoFabricacion] = useState(
    initialData?.anoFabricacion != null ? String(initialData.anoFabricacion) : ""
  );
  const [color, setColor] = useState(initialData?.color ?? "");

  // Imágenes
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<
    { id: number; url: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  // Cargar fotos del coche en edición
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`/api/fotos-car/${initialData.id}`)
      .then((r) => r.json())
      .then((fotos) => {
        if (Array.isArray(fotos)) setExistingFotos(fotos);
      })
      .catch(console.error);
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  const uploadImages = async (carId: number) => {
    if (files.length === 0) return;

    const API =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    setUploading(true);

    try {
      await fetch(`${API}/fotos-car/${carId}`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error subiendo fotos:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

const carData: CarInput = {
  marca,
  model,
  precio: Number(precio),
  combustible,
  anoFabricacion: Number(anoFabricacion),
  color,
};



    const saved = await onSave(carData);

    if (!saved || !saved.id) {
      console.error("❌ ERROR: onSave no devolvió ID", saved);
      alert("Error interno: no se recibió ID del coche.");
      return;
    }

    await uploadImages(saved.id);

    toast.success("Coche guardado correctamente 🚗✨");

    setTimeout(() => {
      onCancel(); // vuelve a la lista en AdminPage
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Modelo"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Precio (€)"
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Combustible"
        value={combustible}
        onChange={(e) => setCombustible(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Año fabricación"
        type="number"
        value={anoFabricacion}
        onChange={(e) => setAnoFabricacion(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      {/* SUBIDA DE IMÁGENES */}
      <label className="font-bold">Imágenes</label>

      <input type="file" multiple onChange={handleFileChange} />

      {/* Previews nuevas */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {preview.map((src, i) => (
            <img key={i} src={src} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      {/* Fotos existentes */}
      {existingFotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {existingFotos.map((f) => (
            <img key={f.id} src={f.url} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={uploading}
      >
        Guardar
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="ml-2 border px-4 py-2 rounded"
      >
        Cancelar
      </button>
    </form>
  );
}
