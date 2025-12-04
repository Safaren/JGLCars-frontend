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
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [savedBackendErrors, setSavedBackendErrors] = useState<
    Record<string, string>
  >({});

  const [existingFotos, setExistingFotos] = useState<
    { id: number; url: string }[]
  >([]);
  const [newFotos, setNewFotos] = useState<
    { id: string; url: string; file: File }[]
  >([]);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  // Inicializar errores en falso
  useEffect(() => {
    const initialErr: Record<string, boolean> = {};
    Object.keys(FIELD_CONFIG).forEach((k) => (initialErr[k] = false));
    setErrors(initialErr);
  }, []);

  // Token helper
  const authHeaders = (extra: any = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    return {
      Authorization: `Bearer ${token}`,
      ...extra,
    };
  };

  // dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Cargar fotos existentes
  useEffect(() => {
    if (!initialData?.id) return;

    fetch(`${API}/fotos-car/${initialData.id}`)
      .then((r) => r.json())
      .then((fotos) =>
        setExistingFotos(Array.isArray(fotos) ? fotos : [])
      )
      .catch(() => {});
  }, [initialData, API]);

  // Nueva(s) fotos
  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files ?? []);

    const mapped = files.map((file: File) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));

    setNewFotos((prev) => [...prev, ...mapped]);
  };

  // Sortable EXISTING
  function SortableImage({ foto }: { foto: { id: number; url: string } }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: foto.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    } as any;

    return (
      <div className="relative group w-20 h-20 select-none">
        <button
          type="button"
          onClick={() =>
            setExistingFotos((prev) => prev.filter((f) => f.id !== foto.id))
          }
          className="
          absolute top-0 right-0 w-8 h-8 flex items-center justify-center
          bg-red-600 text-white rounded-bl-full opacity-0 group-hover:opacity-100
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
            alt=""
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>
    );
  }

  // Preview nuevas
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
          absolute top-0 right-0 w-8 h-8 flex items-center justify-center
          bg-red-600 text-white rounded-bl-full opacity-0 group-hover:opacity-100
          transition
        "
          style={{ transform: "translate(40%, -40%)" }}
        >
          ✕
        </button>

        <div className="w-full h-full rounded overflow-hidden border">
          <img src={foto.url} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  // VALIDACIÓN
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

  // VALIDACIÓN POR CAMPO CUANDO SE PIERDE FOCUS
  const handleBlur = (field: string) => {
    validate([field]);
  };

  // SUBMIT FINAL con errores del backend
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validación frontend
    const ok = validate();
    if (!ok) {
      toast.error("Rellena los campos obligatorios");
      return;
    }

    let saved;
    try {
      saved = await onSave(form);
    } catch {
      toast.error("Error guardando");
      return;
    }

    // Si el backend devuelve errors: { campo: msg }
    if (saved?.errors) {
      const backendErr: Record<string, string> = {};
      const newErr = { ...errors };

      Object.entries(saved.errors).forEach(([field, msg]) => {
        backendErr[field] = String(msg);
        newErr[field] = true;
        toast.error(String(msg));
      });

      setSavedBackendErrors(backendErr);
      setErrors(newErr);
      return;
    }

    // Error general
    if (saved?.error) {
      toast.error(saved.error);
      return;
    }

    if (!saved?.id) {
      toast.error("Error al guardar");
      return;
    }

    const id = saved.id;

    // Reordenar existentes
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

      // Subir nuevas
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
    } catch (err: any) {
      toast.error(err.message || "Error guardando imágenes");
    }
  };

  // Drag reorder
  const handleDragEnd = ({ active, over }: any) => {
    if (!over || active.id === over.id) return;

    const oldIndex = existingFotos.findIndex((f) => f.id === active.id);
    const newIndex = existingFotos.findIndex((f) => f.id === over.id);

    setExistingFotos((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* === CAMPOS === */}
        {editableFields.map(([key, cfg]) => {
          const isError = errors[key];
          const backendMsg = savedBackendErrors[key];
          const showErrorMsg = isError;

          // NO visible → no se muestra
          if (!cfg.visible) return null;

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="font-semibold">
                {cfg.label}{" "}
                {cfg.required && <span className="text-red-500">*</span>}
              </label>

              {/* Videos */}
              {key === "videos" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.__newVideo ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, __newVideo: e.target.value })
                      }
                      placeholder="Pega URL de YouTube"
                      className="border p-2 rounded"
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

                        if (errors["videos"])
                          setErrors({ ...errors, videos: false });
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
                        className="border p-2 rounded flex-1"
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

              {/* SELECT */}
              {key !== "videos" && cfg.type === "select" && (
                <>
                  <select
                    name={key}
                    value={form[key] ?? ""}
                    onChange={(e) => {
                      setForm({ ...form, [key]: e.target.value });
                      if (errors[key])
                        setErrors({ ...errors, [key]: false });
                    }}
                    onBlur={() => handleBlur(key)}
                    className={`border p-2 rounded transition-all duration-300 ${
                      isError ? "border-red-500 shake" : "border-gray-300"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {cfg.options?.map((o: any) =>
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

                  {showErrorMsg && (
                    <p className="text-red-500 text-xs fade-in">
                      {backendMsg ?? "Obligatorio"}
                    </p>
                  )}
                </>
              )}

              {/* TEXT / NUMBER */}
              {(cfg.type === "text" || cfg.type === "number") &&
                key !== "videos" && (
                  <>
                    <input
                      name={key}
                      type={cfg.type}
                      value={form[key] ?? ""}
                      onChange={(e) => {
                        const val =
                          cfg.type === "number"
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value;
                        setForm({ ...form, [key]: val });
                        if (errors[key])
                          setErrors({ ...errors, [key]: false });
                      }}
                      onBlur={() => handleBlur(key)}
                      className={`border p-2 rounded transition-all duration-300 ${
                        isError ? "border-red-500 shake" : "border-gray-300"
                      }`}
                    />

                    {showErrorMsg && (
                      <p className="text-red-500 text-xs fade-in">
                        {backendMsg ?? "Obligatorio"}
                      </p>
                    )}
                  </>
                )}

              {/* DATE */}
              {cfg.type === "date" && (
                <>
                  <input
                    name={key}
                    type="date"
                    value={form[key]?.substring(0, 10) ?? ""}
                    onChange={(e) => {
                      setForm({ ...form, [key]: e.target.value });
                      if (errors[key])
                        setErrors({ ...errors, [key]: false });
                    }}
                    onBlur={() => handleBlur(key)}
                    className={`border p-2 rounded transition-all duration-300 ${
                      isError ? "border-red-500 shake" : "border-gray-300"
                    }`}
                  />
                  {showErrorMsg && (
                    <p className="text-red-500 text-xs fade-in">
                      {backendMsg ?? "Obligatorio"}
                    </p>
                  )}
                </>
              )}

              {/* BOOLEAN */}
              {cfg.type === "boolean" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  {cfg.label}
                </label>
              )}
            </div>
          );
        })}

        {/* FOTOS NUEVAS */}
        <div>
          <label className="font-bold">Imágenes</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

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

        {/* FOTOS EXISTENTES */}
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

      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(4px);
          }
          60% {
            transform: translateX(-3px);
          }
          80% {
            transform: translateX(2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .shake {
          animation: shake 0.22s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.22s ease-out forwards;
        }
      `}</style>
    </>
  );
}
