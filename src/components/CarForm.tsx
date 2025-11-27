"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loadFieldConfig } from "@/config/carFields";
import type { CarInput } from "@/types";
import type { CarForFrontend } from "@/types/CarForFrontend";

interface Props {
  initialData?: CarForFrontend | null;
  onSave: (data: CarInput) => Promise<any>;
  onCancel: () => void;
}

export default function CarForm({ initialData, onSave, onCancel }: Props) {
  const FIELD_CONFIG = loadFieldConfig();
  const editableFields = Object.entries(FIELD_CONFIG).filter(([_, cfg]) => cfg.editable);

  const [form, setForm] = useState<any>(initialData || {});

  // IMÁGENES
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<{ id: number; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

  // CARGAR IMÁGENES EXISTENTES
  useEffect(() => {
    if (!initialData?.id) return;
    fetch(`${API}/fotos-car/${initialData.id}`)
      .then((r) => r.json())
      .then((fotos) => setExistingFotos(Array.isArray(fotos) ? fotos : []));
  }, [initialData]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const saved = await onSave(form);
        Object.keys(form).forEach((k) => {
        if (form[k] === "" || form[k] === null) delete form[k];
        });
    if (!saved?.id) {
      toast.error("Error al guardar el coche");
      return;
    }

    // Reordenar imágenes
    if (existingFotos.length > 0) {
      await fetch(`${API}/fotos-car/reorder/${saved.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedImages: existingFotos.map((z) => z.url) }),
      });
    }

    // Subir nuevas imágenes
    if (files.length > 0) {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      await fetch(`${API}/fotos-car/${saved.id}`, { method: "POST", body: fd });
    }

    toast.success("Coche guardado correctamente 🚗✨");
    setTimeout(() => onCancel(), 800);
  };

  // Cambiar campo
  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // Drag / Drop
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDrop = (index: number) => {
    if (dragIndex === null) return;
    const arr = [...existingFotos];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(index, 0, moved);
    setExistingFotos(arr);
    setDragIndex(null);
  };

  // FILES
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const arr = Array.from(e.target.files ?? []) as File[];
  setFiles(arr);
  setPreview(arr.map((f) => URL.createObjectURL(f)));
};


  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">

      {/* CAMPOS AUTOMÁTICOS */}
      {editableFields.map(([key, cfg]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="font-semibold">{cfg.label}</label>

{/* ⭐ CAMPO ESPECIAL PARA VIDEOS (ADMIN) */}
{key === "videos" && (
  <div className="space-y-3">

    {/* Inicializar array */}
    {!Array.isArray(form[key]) &&
      updateField(key, Array.isArray(initialData?.videos) ? initialData.videos : [])
    }

    {/* Input para añadir nuevo vídeo */}
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Pega una URL de YouTube"
        className="flex-1 border p-2 rounded"
        value={form.__newVideo ?? ""}
        onChange={(e) => updateField("__newVideo", e.target.value)}
      />

      <button
        type="button"
        className="bg-green-600 text-white px-3 py-2 rounded"
        onClick={() => {
          const val = (form.__newVideo || "").trim();
          if (!val) return;

          const arr = Array.isArray(form[key]) ? [...form[key]] : [];
          arr.push(val);
          updateField(key, arr);
          updateField("__newVideo", "");
        }}
      >
        Añadir
      </button>
    </div>

    {/* Lista de vídeos añadidos */}
    <div className="space-y-2">
      {(form[key] || []).map((url: string, idx: number) => {
        // Detectar ID de YouTube
        const extractId = (u: string) => {
          const m1 = u.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
          return m1 ? m1[1] : "";
        };

        const id = extractId(url);
        const thumb = id
          ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          : null;

        return (
          <div key={idx} className="flex items-center gap-3 border p-2 rounded">

            {/* Miniatura */}
            <div className="w-28 h-16 bg-gray-100 rounded overflow-hidden">
              {thumb ? (
                <img src={thumb} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                  Sin vista previa
                </div>
              )}
            </div>

            {/* Input editable */}
            <input
              type="text"
              className="flex-1 border p-2 rounded"
              value={url}
              onChange={(e) => {
                const arr = [...form[key]];
                arr[idx] = e.target.value;
                updateField(key, arr);
              }}
            />

            {/* Botón eliminar */}
            <button
              type="button"
              onClick={() => {
                const arr = [...form[key]];
                arr.splice(idx, 1);
                updateField(key, arr);
              }}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>

    {/* Ayuda si no hay vídeos */}
    {(!form[key] || form[key].length === 0) && (
      <p className="text-sm text-gray-500">
        No hay vídeos. Añade uno pegando la URL de YouTube arriba.
      </p>
    )}
  </div>
)}




         {/* SELECT — SIEMPRE se renderiza si es tipo select */}
{cfg.type === "select" && (
  <select
    className="border p-2 rounded"
    value={form[key] ?? ""}
    onChange={(e) => updateField(key, e.target.value)}
    disabled={!cfg.options || cfg.options.length === 0}
  >
    {/* Si no hay opciones aún */}
    {!cfg.options || cfg.options.length === 0 ? (
      <option value="">Cargando opciones...</option>
    ) : (
      <>
        <option value="">Seleccionar...</option>

        {cfg.options.map((o) => {
          // Caso 1: opciones tipo string
          if (typeof o === "string") {
            return (
              <option key={o} value={o}>
                {o}
              </option>
            );
          }

          // Caso 2: opciones tipo {label, value}
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </>
    )}
  </select>
)}






          {/* INPUT TEXT / NUMBER */}
          {key !== "videos" && (cfg.type === "text" || cfg.type === "number") && (
            <input
              type={cfg.type}
              className="border p-2 rounded"
              value={form[key] ?? ""}
              onChange={(e) => updateField(key, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* IMÁGENES */}
      <div>
        <label className="font-bold">Imágenes</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      {/* PREVIEW nuevas */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {preview.map((src, i) => (
            <div key={i} className="relative group w-20 h-20 rounded overflow-hidden">
              <img src={src} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreview(preview.filter((_, z) => z !== i));
                  setFiles(files.filter((_, z) => z !== i));
                }}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 rounded-full opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EXISTENTES + DragDrop */}
      {existingFotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {existingFotos.map((foto, index) => (
            <div
              key={foto.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="relative group w-20 h-20 rounded border overflow-hidden"
            >
              <img src={foto.url} className="w-full h-full object-cover" />

              <button
                type="button"
                onClick={() =>
                  setExistingFotos((prev) => prev.filter((f) => f.id !== foto.id))
                }
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 rounded-full opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          Guardar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
