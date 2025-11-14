"use client";

import { useEffect, useState } from "react";
import { Pieza } from "@/lib/api";

interface Props {
  initialData?: Partial<Pieza>;
  // 👇 acepta que la función puede devolver una Pieza o nada
  onSave: (data: Partial<Pieza>) => Promise<Pieza | void>;
  onCancel: () => void;
}

export default function PiezaForm({ initialData, onSave, onCancel }: Props) {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [precio, setPrecio] = useState(initialData?.precio?.toString() || "");
  const [carId, setCarId] = useState(initialData?.carId?.toString() || "");
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🔄 Cargar fotos existentes (si editas una pieza)
  useEffect(() => {
    if (initialData?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/fotos-pieza/${initialData.id}`)
        .then((r) => r.json())
        .then(setExistingFotos)
        .catch(console.error);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const uploadImages = async (piezaId: number) => {
    if (files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fotos-pieza/${piezaId}`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error subiendo imágenes:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const piezaData: Partial<Pieza> = {
      descripcion,
      precio: parseFloat(precio),
      carId: Number(carId),
    };

    const saved = await onSave(piezaData); // puede ser Pieza o void
    if (saved && "id" in saved) {
      await uploadImages(saved.id);
    }
  };

  const handleDeleteFoto = async (id: number) => {
    if (!confirm("¿Eliminar esta foto?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fotos-pieza/${id}`, {
      method: "DELETE",
    });
    setExistingFotos(existingFotos.filter((f) => f.id !== id));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4 max-w-xl"
    >
      <input
        type="text"
        placeholder="Descripción"
        className="w-full border p-2 rounded"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio (€)"
        className="w-full border p-2 rounded"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="ID del coche asociado"
        className="w-full border p-2 rounded"
        value={carId}
        onChange={(e) => setCarId(e.target.value)}
        required
      />

      <div>
        <label className="block text-gray-700 mb-1 font-semibold">
          Galería de fotos:
        </label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        {preview.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {existingFotos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {existingFotos.map((foto) => (
              <div key={foto.id} className="relative group">
                <img
                  src={foto.url}
                  className="w-24 h-24 object-cover rounded border"
                  alt="foto pieza"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteFoto(foto.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <p className="text-blue-600 text-sm mt-2">Subiendo fotos...</p>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
