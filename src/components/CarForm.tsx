"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  initialData?: any;
  onSave: (data: any) => Promise<any>;
  onCancel: () => void;
}

export default function CarForm({ initialData, onSave, onCancel }: Props) {

  const router = useRouter();

  const [marca, setMarca] = useState(initialData?.marca || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [precio, setPrecio] = useState(initialData?.precio || "");
  const [combustible, setCombustible] = useState(initialData?.combustible || "");
  const [anoFabricacion, setAnoFabricacion] = useState(initialData?.anoFabricacion || "");
  const [color, setColor] = useState(initialData?.color || "");

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Cargar fotos en modo edición
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`/api/fotos-car/${initialData.id}`)
      .then(r => r.json())
      .then(f => {
        if (Array.isArray(f)) setExistingFotos(f);
      })
      .catch(console.error);
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const arr = Array.from(e.target.files || []);
    setFiles(arr);
    setPreview(arr.map(f => URL.createObjectURL(f)));
  };

  const uploadImages = async (carId: number) => {
    if (files.length === 0) return;

    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    const formData = new FormData();
    files.forEach(f => formData.append("files", f));

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

    const carData = {
      marca,
      model,
      precio: Number(precio),
      combustible,
      anoFabricacion: Number(anoFabricacion),
      color,
    };

    const saved = await onSave(carData);
console.log("🟩 Resultado onSave:", saved);
    if (!saved || !saved.id) {
      console.error("❌ ERROR: onSave no devolvió ID", saved);
      alert("Error interno: no se recibió ID del coche.");
      return;
    }

    await uploadImages(saved.id);

      toast.success("Coche guardado correctamente 🚗✨");

  // 👉 Volver al panel en 2s
  setTimeout(() => {
    onCancel(); // vuelve a la lista REAL desde AdminPage

  }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <input className="border p-2 w-full" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Modelo" value={model} onChange={e => setModel(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Combustible" value={combustible} onChange={e => setCombustible(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Año" type="number" value={anoFabricacion} onChange={e => setAnoFabricacion(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Color" value={color} onChange={e => setColor(e.target.value)} />

      <label className="font-bold">Imágenes</label>
      <input type="file" multiple onChange={handleFileChange} />

      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {preview.map((src, i) => (
            <img key={i} src={src} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      {existingFotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {existingFotos.map(f => (
            <img key={f.id} src={f.url} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
      <button type="button" onClick={onCancel} className="ml-2 border px-4 py-2 rounded">
        Cancelar
      </button>
    </form>
  );
}
