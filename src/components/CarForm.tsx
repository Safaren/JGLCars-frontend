"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { CarInput } from "@/types";
import { CarForFrontend } from "@/types/CarForFrontend";

interface Props {
  initialData?: CarForFrontend | null;
  onSave: (data: CarInput) => Promise<any>;
  onCancel: () => void;
}

export default function CarForm({ initialData, onSave, onCancel }: Props) {
  // Campos
  const [marca, setMarca] = useState(initialData?.marca ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [precio, setPrecio] = useState(initialData?.precio ? String(initialData.precio) : "");
  const [combustible, setCombustible] = useState(initialData?.combustible ?? "");
  const [anoFabricacion, setAnoFabricacion] = useState(initialData?.anoFabricacion ? String(initialData.anoFabricacion) : "");
  const [color, setColor] = useState(initialData?.color ?? "");

  // Imágenes
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<{ id: number; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Drag & drop
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

  // DRAG START
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  // DROP
  const handleDrop = (index: number) => {
    if (dragIndex === null) return;

    const reordered = [...existingFotos];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);

    setExistingFotos(reordered);
    setDragIndex(null);
  };

  // Cargar imágenes existentes
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`${API}/fotos-car/${initialData.id}`)
      .then((r) => r.json())
      .then((fotos) => {
        if (Array.isArray(fotos)) {
          setExistingFotos(fotos);
        }
      })
      .catch(console.error);
  }, [initialData]);

  // Eliminar imagen existente
  const handleDeleteFoto = async (id: number) => {
    if (!confirm("¿Eliminar esta foto?")) return;

    try {
      await fetch(`${API}/fotos-car/${id}`, { method: "DELETE" });
      setExistingFotos((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Error eliminando foto:", err);
    }
  };

  // Nuevas imágenes seleccionadas
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  // Subir nuevas imágenes
  const uploadImages = async (carId: number) => {
    if (files.length === 0) return;

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

  // GUARDAR
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

    // 1. Guardar los datos
    const saved = await onSave(carData);

    if (!saved || !saved.id) {
      alert("Error interno: no se recibió ID del coche.");
      return;
    }

    // 2. REORDENAR imágenes existentes
    if (existingFotos.length > 0) {
      await fetch(`${API}/fotos-car/reorder/${saved.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedImages: existingFotos.map((f) => f.url),
        }),
      });
    }

    // 3. SUBIR nuevas imágenes
    await uploadImages(saved.id);

    toast.success("Coche guardado correctamente 🚗✨");
    setTimeout(() => onCancel(), 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      {/* Campos */}
      <input className="border p-2 w-full" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Precio (€)" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Combustible" value={combustible} onChange={(e) => setCombustible(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Año fabricación" type="number" value={anoFabricacion} onChange={(e) => setAnoFabricacion(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />

      {/* Subida */}
      <label className="font-bold">Imágenes</label>
      <input type="file" multiple onChange={handleFileChange} />

      {/* PREVIEWS nuevas */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {preview.map((src, index) => (
            <div key={index} className="relative group w-20 h-20 rounded overflow-hidden">
              <img src={src} className="w-full h-full object-cover pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setPreview((prev) => prev.filter((_, i) => i !== index));
                  setFiles((prev) => prev.filter((_, i) => i !== index));
                }}
                className="absolute top-1 right-1 z-20 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 pointer-events-auto shadow-md"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EXISTENTES con drag & drop */}
      {existingFotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {existingFotos.map((foto, index) => (
            <div
              key={foto.id}
              className="relative group w-20 h-20 rounded overflow-hidden border"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              <img src={foto.url} className="w-full h-full object-cover pointer-events-none" />
              <button
                type="button"
                onClick={() => handleDeleteFoto(foto.id)}
                className="absolute top-1 right-1 z-20 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 pointer-events-auto shadow-md"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botones */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={uploading}>
        Guardar
      </button>
      <button type="button" onClick={onCancel} className="ml-2 border px-4 py-2 rounded">
        Cancelar
      </button>
    </form>
  );
}
