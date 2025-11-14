"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";
import CarTable from "@/components/CarTable";
import CarForm from "@/components/CarForm";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<any | null>(null);


  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !rawUser) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (user?.rol !== 'Admin' && user?.rol !== 'ADMIN') {
        router.push('/');
        return;
      }
      setAuthorized(true);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (authorized === null) {
    return <p className="text-center mt-20">Verificando permisos...</p>;
  }
  
  async function loadCars() {
    const data = await getCars();
    setCars(data);
  }

  useEffect(() => {
    loadCars();
  }, []);

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
    // Si hemos eliminado alguna imagen localmente, enviamos las imagenes que quedan.
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

  return (
    <motion.section
      className="py-16 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Panel de administración</h1>
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
        <CarTable cars={cars} onDelete={handleDeleteCar} onEdit={handleEditClick} />
      )}
    </motion.section>
  );
}
