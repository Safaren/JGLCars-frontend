"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";
import CarTable from "@/components/CarTable";
import CarForm from "@/components/CarForm";

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ evitar SSR desincronizado

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Verificar autenticación (solo en cliente)
  useEffect(() => {
    if (!mounted) return;

    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (user?.rol !== "Admin" && user?.rol !== "ADMIN") {
        router.push("/");
        return;
      }
      setAuthorized(true);
    } catch {
      router.push("/login");
    }
  }, [mounted, router]);

  // ✅ Cargar coches
  async function loadCars() {
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error("Error cargando coches:", error);
    }
  }

  useEffect(() => {
    if (authorized) loadCars();
  }, [authorized]);

  // ✅ Handlers CRUD
  const handleAddCar = async (data: any) => {
    await addCar(data);
    await loadCars();
    setShowForm(false);
  };

  const handleEditClick = (car: any) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleUpdateCar = async (data: any) => {
    if (!editingCar) return;
    await updateCar(editingCar.id, data);
    await loadCars();
    setShowForm(false);
    setEditingCar(null);
  };

  const handleDeleteCar = async (id: number) => {
    if (confirm("¿Eliminar este coche?")) {
      await deleteCar(id);
      await loadCars();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  // 🚫 No renderizar antes de que el cliente esté montado
  if (!mounted) return null;

  if (authorized === null) {
    return <p className="text-center mt-20">Verificando permisos...</p>;
  }

  if (!authorized) {
    return <p className="text-center mt-20">Redirigiendo...</p>;
  }

  return (
    <motion.section
      className="py-16 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel de administración
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => {
            setShowForm(!showForm);
            setEditingCar(null);
          }}
        >
          {showForm ? "Volver" : "+ Añadir coche"}
        </motion.button>
      </div>

      {showForm ? (
        <CarForm
          initialData={editingCar || undefined}
          onSave={editingCar ? handleUpdateCar : handleAddCar}
          onCancel={handleCancel}
        />
      ) : (
        <CarTable
          cars={cars}
          onDelete={handleDeleteCar}
          onEdit={handleEditClick}
        />
      )}
    </motion.section>
  );
}
