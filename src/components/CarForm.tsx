"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
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
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// ----------------------------
// 🔵 Tipos estrictos añadidos
// ----------------------------
interface ExistingPhoto {
  id: number;
  url: string;
}

interface NewPhoto {
  id: string;
  url: string;
  file: File;
}

interface Props {
  initialData?: CarForFrontend | null;
  onSave: (data: CarInput) => Promise<{ id?: number; error?: string; errors?: Record<string, string> }>;
  onCancel: () => void;
}
type FormState = Partial<CarInput> &
  Partial<CarForFrontend> & {
    __newVideo?: string;
    [key: string]: unknown;
  };
  

export default function CarForm({ initialData, onSave, onCancel }: Props) {
  const FIELD_CONFIG = loadFieldConfig();

  const editableFields = Object.entries(FIELD_CONFIG).filter(
    ([_, cfg]) => cfg.editable
  );

  // ⚠ QUITAMOS ANY
const [form, setForm] = useState<FormState>(
  (initialData as FormState) || {}
);


  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [savedBackendErrors, setSavedBackendErrors] = useState<Record<string, string>>({});

  const [existingFotos, setExistingFotos] = useState<ExistingPhoto[]>([]);
  const [newFotos, setNewFotos] = useState<NewPhoto[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  // Inicializar errores
  useEffect(() => {
    const initialErr: Record<string, boolean> = {};
    Object.keys(FIELD_CONFIG).forEach((k) => (initialErr[k] = false));
    setErrors(initialErr);
  }, []);

  // Token helper — sin ANY
  const authHeaders = (extra: Record<string, unknown> = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return {
      Authorization: `Bearer ${token}`,
      ...extra,
    };
  };

  // Sensores drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Cargar fotos existentes
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`${API}/fotos-car/${initialData.id}`)
      .then((r) => r.json())
      .then((fotos: unknown) => {
        if (Array.isArray(fotos)) {
          setExistingFotos(
            fotos.filter((f) => typeof f.id === "number" && typeof f.url === "string")
          );
        }
      })
      .catch(() => {});
  }, [initialData, API]);
  // ----------------------------
  // 🔵 NUEVAS FOTOS (tipo fijo)
  // ----------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];

    const mapped: NewPhoto[] = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));

    setNewFotos((prev) => [...prev, ...mapped]);
  };

  // ----------------------------
  // 🔵 Validación
  // ----------------------------
  const validate = (fields?: string[]) => {
    const newErr = { ...errors };
    const keys = fields?.length ? fields : Object.keys(FIELD_CONFIG);

    keys.forEach((k) => {
      const cfg = FIELD_CONFIG[k];
      if (!cfg.required) {
        newErr[k] = false;
        return;
      }

      const value = form[k];
      const empty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      newErr[k] = empty;
    });

    setErrors(newErr);
    return !Object.values(newErr).some((v) => v === true);
  };

  const handleBlur = (field: string) => validate([field]);

  // ----------------------------
  // 🔵 SUBMIT SIN ANY
  // ----------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Rellena los campos obligatorios");
      return;
    }

    let saved;
    try {
     saved = await onSave(form as unknown as CarInput);

    } catch {
      toast.error("Error guardando");
      return;
    }

    if (saved?.errors) {
      const backendErr: Record<string, string> = {};
      const newErr = { ...errors };

      Object.entries(saved.errors).forEach(([field, msg]) => {
        backendErr[field] = msg;
        newErr[field] = true;
        toast.error(msg);
      });

      setSavedBackendErrors(backendErr);
      setErrors(newErr);
      return;
    }

    if (saved?.error) {
      toast.error(saved.error);
      return;
    }

    if (!saved?.id) {
      toast.error("Error al guardar");
      return;
    }

    const id = saved.id;

    // Guardar reordenación
    try {
      if (existingFotos.length > 0) {
        await fetch(`${API}/fotos-car/reorder/${id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderedImages: existingFotos.map((f) => f.url),
          }),
        });
      }

      // Subir nuevas fotos
      if (newFotos.length > 0) {
        const fd = new FormData();
        newFotos.forEach((f) => fd.append("files", f.file));

        await fetch(`${API}/fotos-car/${id}`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
      }

      toast.success("Coche guardado");
      onCancel();
    } catch (err) {
      toast.error("Error guardando imágenes");
    }
  };

  // ----------------------------
  // 🔵 Drag reorder (tipado)
  // ----------------------------
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = existingFotos.findIndex((f) => f.id === active.id);
    const newIndex = existingFotos.findIndex((f) => f.id === over.id);

    setExistingFotos((prev) => arrayMove(prev, oldIndex, newIndex));
  };
    // ============================
  //  COMPONENTE: SortableImage
  // ============================
  function SortableImage({ foto }: { foto: { id: number; url: string } }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: foto.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    };

    return (
      <div className="relative group w-20 h-20 select-none">
        {/* Botón eliminar */}
        <button
          type="button"
          onClick={() =>
            setExistingFotos((prev) => prev.filter((f) => f.id !== foto.id))
          }
          className="
            absolute top-0 right-0 w-7 h-7 flex items-center justify-center
            bg-red-600 text-white rounded-bl-full opacity-0 group-hover:opacity-100
            transition
          "
          style={{ transform: "translate(40%, -40%)" }}
        >
          ✕
        </button>

        {/* Imagen sortable */}
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          className="w-full h-full rounded overflow-hidden border"
        >
          <img
            src={foto.url}
            alt="imagen existente"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>
    );
  }

  // ============================
  //  COMPONENTE: PreviewImage
  // ============================
  function PreviewImage({
    foto,
  }: {
    foto: { id: string; url: string; file: File };
  }) {
    return (
      <div className="relative group w-20 h-20 select-none">
        {/* Botón eliminar */}
        <button
          type="button"
          onClick={() =>
            setNewFotos((prev) => prev.filter((f) => f.id !== foto.id))
          }
          className="
            absolute top-0 right-0 w-7 h-7 flex items-center justify-center
            bg-red-600 text-white rounded-bl-full opacity-0 group-hover:opacity-100
            transition
          "
          style={{ transform: "translate(40%, -40%)" }}
        >
          ✕
        </button>

        {/* Imagen preview */}
        <div className="w-full h-full rounded overflow-hidden border">
          <img
            src={foto.url}
            alt="nueva imagen"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* === CAMPOS DEL FORM === */}
        {editableFields.map(([key, cfg]) => {
          const isError = errors[key];
          const backendMsg = savedBackendErrors[key];

          if (!cfg.visible) return null;

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="font-semibold">
                {cfg.label} {cfg.required && <span className="text-red-500">*</span>}
              </label>

              {/* ---- VIDEOS ---- */}
              {key === "videos" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={(form as any).__newVideo ?? ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, __newVideo: e.target.value }))
                      }
                      placeholder="Pega URL de YouTube"
                      className="border p-2 rounded"
                    />

                    <button
                      type="button"
                      className="bg-green-600 text-white px-3 py-2 rounded"
                      onClick={() => {
                        const val = (form as any).__newVideo?.trim();
                        if (!val) return;

                        setForm((prev) => ({
                          ...prev,
                          videos: [ ...(prev.videos as string[] ?? []), val ],
                          __newVideo: "",
                        }));

                        if (errors["videos"])
                          setErrors((err) => ({ ...err, videos: false }));
                      }}
                    >
                      Añadir
                    </button>
                  </div>

                  {(form.videos as string[] | undefined)?.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 border p-2 rounded">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => {
                          const arr = [...(form.videos as string[])];
                          arr[i] = e.target.value;
                          setForm((prev) => ({ ...prev, videos: arr }));
                        }}
                        className="border p-2 rounded flex-1"
                      />
                      <button
                        type="button"
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => {
                          const arr = [...(form.videos as string[])];
                          arr.splice(i, 1);
                          setForm((prev) => ({ ...prev, videos: arr }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ---- SELECT ---- */}
              {key !== "videos" && cfg.type === "select" && (
                <>
                  <select
                    name={key}
                    value={(form[key] as string) ?? ""}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, [key]: e.target.value }));
                      if (errors[key])
                        setErrors((prev) => ({ ...prev, [key]: false }));
                    }}
                    onBlur={() => handleBlur(key)}
                    className={`border p-2 rounded transition ${
                      isError ? "border-red-500 shake" : "border-gray-300"
                    }`}
                  >
                    <option value="">Seleccionar...</option>

                    {cfg.options?.map((o) =>
                      typeof o === "string" ? (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ) : (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      )
                    )}
                  </select>

                  {isError && (
                    <p className="text-red-500 text-xs fade-in">
                      {backendMsg ?? "Obligatorio"}
                    </p>
                  )}
                </>
              )}

              {/* ---- TEXT / NUMBER ---- */}
              {(cfg.type === "text" || cfg.type === "number") &&
                key !== "videos" && (
                  <>
                    <input
                      name={key}
                      type={cfg.type}
                      value={(form[key] as string | number | undefined) ?? ""}
                      onChange={(e) => {
                        const val =
                          cfg.type === "number"
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value;

                        setForm((prev) => ({ ...prev, [key]: val }));

                        if (errors[key])
                          setErrors((prev) => ({ ...prev, [key]: false }));
                      }}
                      onBlur={() => handleBlur(key)}
                      className={`border p-2 rounded transition ${
                        isError ? "border-red-500 shake" : "border-gray-300"
                      }`}
                    />

                    {isError && (
                      <p className="text-red-500 text-xs fade-in">
                        {backendMsg ?? "Obligatorio"}
                      </p>
                    )}
                  </>
                )}

              {/* ---- FECHA ---- */}
              {cfg.type === "date" && (
                <>
                  <input
                    type="date"
                    name={key}
                    value={(form[key] as string)?.substring(0, 10) ?? ""}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, [key]: e.target.value }));
                      if (errors[key])
                        setErrors((prev) => ({ ...prev, [key]: false }));
                    }}
                    onBlur={() => handleBlur(key)}
                    className={`border p-2 rounded transition ${
                      isError ? "border-red-500 shake" : "border-gray-300"
                    }`}
                  />
                  {isError && (
                    <p className="text-red-500 text-xs fade-in">
                      {backendMsg ?? "Obligatorio"}
                    </p>
                  )}
                </>
              )}

              {/* ---- BOOLEAN ---- */}
              {cfg.type === "boolean" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  {cfg.label}
                </label>
              )}
            </div>
          );
        })}

        {/* ---- INPUT ARCHIVOS ---- */}
        <div>
          <label className="font-bold">Imágenes</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {/* ---- Previews nuevas ---- */}
        {newFotos.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Nuevas imágenes</p>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {newFotos.map((f) => (
                <div key={f.id} className="relative group w-20 h-20">
                  <button
                    type="button"
                    className="absolute top-0 right-0 w-7 h-7 bg-red-600 text-white rounded-bl-full opacity-0 group-hover:opacity-100 transition"
                    onClick={() =>
                      setNewFotos((prev) => prev.filter((x) => x.id !== f.id))
                    }
                    style={{ transform: "translate(40%, -40%)" }}
                  >
                    ✕
                  </button>

                  <img
                    src={f.url}
                    alt="preview"
                    className="w-full h-full object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- Imágenes existentes ---- */}
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
                  {existingFotos.map((foto) => (
                    <SortableImage key={foto.id} foto={foto} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* ---- BOTONES ---- */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
            Guardar
          </button>
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </form>

      {/* ---- Animaciones ---- */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .shake {
          animation: shake 0.22s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.22s ease-out forwards;
        }
      `}</style>
    </>
  );
}
