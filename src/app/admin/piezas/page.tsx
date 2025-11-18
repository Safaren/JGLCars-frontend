"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { addPieza, updatePieza, deletePieza } from "@/lib/api";
import { Pieza } from "@/lib/types";  // 👈 Asegúrate de tener este type o usa el de apiServer

import PiezaForm from "@/components/PiezaForm";
import PiezaTable from "@/components/PiezaTable";

export async function generateMetadata({ params }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cars/${params.id}`);
  const car = await res.json();

  return {
    title: `${car.marca} ${car.model} – JLGCars`,
    description: `Coche ${car.marca} ${car.model} con ${car.potencia}CV y precio de ${car.precio}€. Más detalles aquí.`,
    openGraph: {
      title: `${car.marca} ${car.model}`,
      description: "Vehículo disponible en JLGCars.",
      images: car.imagenes?.length
        ? [{ url: car.imagenes[0].url }]
        : [{ url: "/og-default.jpg" }],
    },
  };
}

export default function PiezasAdminPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [editingPieza, setEditingPieza] = useState<Pieza | null>(null);
  const [showForm, setShowForm] = useState(false);

  // 🔥 Obtener piezas SIN usar getPiezas (no existe en cliente)
  const loadPiezas = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/piezas`, {
      credentials: "include",
    });

    const data = await res.json();
    setPiezas(data);
  };

  useEffect(() => {
    loadPiezas();
  }, []);

  // ➕ Crear pieza
  const handleAdd = async (data: Partial<Pieza>): Promise<Pieza> => {
    const saved = await addPieza(data);
    await loadPiezas();
    setShowForm(false);
    return saved;
  };

  // ✏️ Actualizar pieza
  const handleUpdate = async (data: Partial<Pieza>): Promise<Pieza> => {
    if (!editingPieza) throw new Error("No hay pieza en edición");

    const saved = await updatePieza(editingPieza.id!, data);
    await loadPiezas();
    setEditingPieza(null);
    setShowForm(false);
    return saved;
  };

  // ❌ Eliminar pieza
  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta pieza?")) {
      await deletePieza(id);
      await loadPiezas();
    }
  };

  const saveHandler = async (data: Partial<Pieza>) => {
    if (editingPieza) return handleUpdate(data);
    return handleAdd(data);
  };

  return (
    <motion.section
      className="py-16 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Gestión de Piezas</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPieza(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? "Volver" : "+ Añadir pieza"}
        </button>
      </div>

      {showForm ? (
        <PiezaForm
          initialData={editingPieza || undefined}
          onSave={saveHandler}
          onCancel={() => {
            setShowForm(false);
            setEditingPieza(null);
          }}
        />
      ) : (
        <PiezaTable
          piezas={piezas}
          onEdit={(p) => {
            setEditingPieza(p);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </motion.section>
  );
}
