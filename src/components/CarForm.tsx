// src/components/CarForm.tsx

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loadFieldConfig } from "@/config/carFields";
import type { CarInput } from "@/types";
import type { CarForFrontend } from "@/types/CarForFrontend";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface Props {
  initialData?: CarForFrontend | null;
  onSave: (data: CarInput) => Promise<any>;
  onCancel: () => void;
}

export default function CarForm({ initialData, onSave, onCancel }: Props) {
  const FIELD_CONFIG = loadFieldConfig();
  const editableFields = Object.entries(FIELD_CONFIG).filter(
    ([_, cfg]) => cfg.editable
  );

  const [form, setForm] = useState<any>(initialData || {});

  const [existingFotos, setExistingFotos] = useState<
    { id: number; url: string }[]
  >([]);
  const [newFotos, setNewFotos] = useState<
    { id: string; url: string; file: File }[]
  >([]);

  const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  // --------------------------------------------
  // Función para añadir TOKEN automáticamente
  // --------------------------------------------
  const authHeaders = (extra: any = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return {
      Authorization: `Bearer ${token}`,
      ...extra,
    };
  };

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Cargar imágenes existentes
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`${API}/fotos-car/${initialData.id}`, {
      credentials: "include",
      mode: "cors",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((fotos) =>
        setExistingFotos(Array.isArray(fotos) ? fotos : [])
      )
      .catch(() => {
        console.error("Error cargando imágenes existentes");
      });
  }, [initialData]);

  // Cargar nuevas fotos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    const mapped = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));

    setNewFotos((prev) => [...prev, ...mapped]);
  };

  // Sortable EXISTING
  function SortableImage({
    foto,
  }: {
    foto: { id: number; url: string };
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: foto.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    };

    return (
      <div className="relative group w-20 h-20 select-none">
        {/* BOTÓN BORRAR */}
        <button
          type="button"
          draggable={false}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setExistingFotos((prev) => prev.filter((f) => f.id !== foto.id));
          }}
          className="
            absolute top-0 right-0
            w-8 h-8 flex items-center justify-center
            bg-red-600 text-white
            rounded-bl-full
            opacity-0 group-hover:opacity-100
            transition
          "
          style={{ transform: "translate(40%, -40%)" }}
        >
          ✕
        </button>

        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          className="w-full h-full rounded overflow-hidden border"
        >
          <img
            src={foto.url}
            alt="foto"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>
    );
  }

  // UI fotos nuevas
  function PreviewImage({
    foto,
  }: {
    foto: { id: string; url: string; file: File };
  }) {
    return (
      <div className="relative group w-20 h-20 select-none">
        <button
          type="button"
          onClick={() =>
            setNewFotos((prev) => prev.filter((f) => f.id !== foto.id))
          }
          className="
            absolute top-0 right-0
            w-8 h-8 flex items-center justify-center
            bg-red-600 text-white
            rounded-bl-full
            opacity-0 group-hover:opacity-100
            transition
          "
          style={{ transform: "translate(40%, -40%)" }}
        >
          ✕
        </button>

        <div className="w-full h-full rounded overflow-hidden border">
          <img src={foto.url} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  // --------------------------------------------
  // SUBMIT
  // --------------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const saved = await onSave(form);

    if (!saved?.id) {
      toast.error("Error al guardar");
      return;
    }

    const id = saved.id;

    try {
      // Reordenar existentes
      if (existingFotos.length > 0) {
        const reorderRes = await fetch(`${API}/fotos-car/reorder/${id}`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedImages: existingFotos.map((f) => f.url),
          }),
        });

        if (!reorderRes.ok) {
          const errorData = await reorderRes.json().catch(() => ({}));
          throw new Error(errorData.error || "Error al reordenar imágenes");
        }
      }

      // Subir nuevas
      if (newFotos.length > 0) {
        const fd = new FormData();
        newFotos.forEach((f) => fd.append("files", f.file));

        const uploadRes = await fetch(`${API}/fotos-car/${id}`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          cache: "no-store",
          // No ponemos Content-Type para FormData (fetch lo gestiona automáticamente)
          body: fd,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          console.error("Error al subir las imágenes", errorData);
          throw new Error(errorData.error || "Error al subir imágenes");
        }
      }

      toast.success("Coche guardado correctamente");
      onCancel();
    } catch (err: any) {
      console.error("Error guardando imágenes:", err);
      toast.error(err.message || "Error al guardar las imágenes");
    }
  };

  // Reordenar imágenes existentes
  const handleDragEnd = ({ active, over }: any) => {
    if (!over || active.id === over.id) return;

    const oldIndex = existingFotos.findIndex((f) => f.id === active.id);
    const newIndex = existingFotos.findIndex((f) => f.id === over.id);

    setExistingFotos((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      {/* === CAMPOS DEL FORM === */}
      {editableFields.map(([key, cfg]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="font-semibold">{cfg.label}</label>

          {/* Videos */}
          {key === "videos" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 rounded flex-1"
                  value={form.__newVideo ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, __newVideo: e.target.value })
                  }
                  placeholder="Pega URL de YouTube"
                />

                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-2 rounded"
                  onClick={() => {
                    if (!form.__newVideo?.trim()) return;
                    setForm({
                      ...form,
                      videos: [
                        ...(form.videos ?? []),
                        form.__newVideo.trim(),
                      ],
                      __newVideo: "",
                    });
                  }}
                >
                  Añadir
                </button>
              </div>

              {form.videos?.map((v: string, i: number) => (
                <div
                  key={i}
                  className="flex gap-3 items-center border p-2 rounded"
                >
                  <input
                    type="text"
                    value={v}
                    onChange={(e) => {
                      const arr = [...form.videos];
                      arr[i] = e.target.value;
                      setForm({ ...form, videos: arr });
                    }}
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...form.videos];
                      arr.splice(i, 1);
                      setForm({ ...form, videos: arr });
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Select */}
          {key !== "videos" && cfg.type === "select" && (
            <select
              value={form[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar...</option>
              {cfg.options?.map((o) =>
                typeof o === "string" ? (
                  <option key={o}>{o}</option>
                ) : (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                )
              )}
            </select>
          )}

          {/* Text / Number */}
          {(cfg.type === "text" ||
            (cfg.type === "number" && key !== "videos")) && (
            <input
              type={cfg.type}
              className="border p-2 rounded"
              value={form[key] ?? ""}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          )}

          {/* Fecha */}
          {cfg.type === "date" && (
            <input
              type="date"
              className="border p-2 rounded"
              value={form[key]?.substring(0, 10) ?? ""}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          )}
          {/* Booleanos */}
            {cfg.type === "boolean" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>{cfg.label}</span>
              </label>
            )}

        </div>
      ))}

      {/* SUBIR NUEVAS FOTOS */}
      <div>
        <label className="font-bold">Imágenes</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      {/* PREVIEW NUEVAS */}
      {newFotos.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Nuevas imágenes</p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {newFotos.map((f) => (
              <PreviewImage key={f.id} foto={f} />
            ))}
          </div>
        </div>
      )}

      {/* EXISTENTES ORDENABLES */}
      {existingFotos.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Imágenes existentes</p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={existingFotos.map((f) => f.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3 mt-2">
                {existingFotos.map((f) => (
                  <SortableImage key={f.id} foto={f} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
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
