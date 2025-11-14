"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pieza,
  getPiezas,
  addPieza,
  updatePieza,
  deletePieza,
} from "@/lib/api";
import PiezaForm from "@/components/PiezaForm";
import PiezaTable from "@/components/PiezaTable";

export default function PiezasAdminPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [editingPieza, setEditingPieza] = useState<Pieza | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadPiezas = async () => {
    const data = await getPiezas();
    setPiezas(data);
  };

  useEffect(() => {
    loadPiezas();
  }, []);

  const handleAdd = async (data: Partial<Pieza>): Promise<Pieza> => {
    const saved = await addPieza(data);
    await loadPiezas();
    setShowForm(false);
    return saved;
  };

  const handleUpdate = async (data: Partial<Pieza>): Promise<Pieza> => {
    if (!editingPieza) throw new Error("No hay pieza en edición");
    const saved = await updatePieza(editingPieza.id!, data);
    await loadPiezas();
    setEditingPieza(null);
    setShowForm(false);
    return saved;
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta pieza?")) {
      await deletePieza(id);
      await loadPiezas();
    }
  };

  const saveHandler = async (data: Partial<Pieza>): Promise<Pieza | void> => {
    if (editingPieza) return await handleUpdate(data);
    else return await handleAdd(data);
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
          onSave={saveHandler} // 👈 tipado flexible
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
