"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPiezas, addPieza, updatePieza, deletePieza } from "@/lib/api";
import PiezaTable from "@/components/PiezaTable";
import PiezaForm from "@/components/PiezaForm";

export default function PiezasPage() {
  const router = useRouter();
  const [piezas, setPiezas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPieza, setEditingPieza] = useState<any | null>(null);

  async function loadPiezas() {
    try {
      const data = await getPiezas();
      setPiezas(data);
    } catch (err) {
      console.error("Error cargando piezas:", err);
    }
  }

  useEffect(() => {
    loadPiezas();
  }, []);

  const handleAdd = async (data: any) => {
    await addPieza(data);
    await loadPiezas();
    setShowForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingPieza) return;
    await updatePieza(editingPieza.id, data);
    await loadPiezas();
    setShowForm(false);
    setEditingPieza(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta pieza?")) {
      await deletePieza(id);
      await loadPiezas();
    }
  };

  return (
    <motion.section
      className="py-16 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Gestión de piezas</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => {
            setShowForm(!showForm);
            setEditingPieza(null);
          }}
        >
          {showForm ? "Volver" : "+ Añadir pieza"}
        </motion.button>
      </div>

      {showForm ? (
        <PiezaForm
          initialData={editingPieza || undefined}
          onSave={editingPieza ? handleUpdate : handleAdd}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <PiezaTable
          piezas={piezas}
          onEdit={setEditingPieza}
          onDelete={handleDelete}
        />
      )}
    </motion.section>
  );
}
