"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarouselAdmin from "@/components/CarouselAdmin";

import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";
import { Car, CarInput } from "@/types";

export default function AdminPage() {
  const router = useRouter();

  // Control de acceso
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // Datos del panel
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [section, setSection] = useState<"cars" | "carousel">("cars");

  // ===============================
  // 🔐 Control de acceso básico
  // ===============================
  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (!saved) {
      setAllowed(false);
      return;
    }

    try {
      const user = JSON.parse(saved);

      if (user.rol === "Admin" || user.rol === "ADMIN") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    } catch {
      setAllowed(false);
    }
  }, []);

  // ===============================
  // 🚗 Cargar coches si permitido
  // ===============================
  const loadCars = async () => {
    const data = await getCars();
    setCars(data);
  };

  useEffect(() => {
    if (allowed) {
      loadCars();
    }
  }, [allowed]);

  // ===============================
  // 💾 Guardar coche
  // ===============================
  const handleSaveCar = async (data: CarInput) => {
    if (editingCar) {
      await updateCar(editingCar.id, data);
    } else {
      await addCar(data);
    }

    await loadCars();
    setEditingCar(null);
    setShowForm(false);
  };

  // ===============================
  // 🌀 Estados de carga
  // ===============================
  if (allowed === null) {
    return <p className="p-6">Cargando...</p>;
  }

  if (!allowed) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        ⚠ Acceso restringido — No eres administrador.
      </div>
    );
  }

  // ===============================
  // 🎛 Panel Admin
  // ===============================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel de Administración
        </h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Selector de secciones */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSection("cars")}
          className={`px-4 py-2 rounded ${
            section === "cars" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Gestión de coches
        </button>

        <button
          onClick={() => setSection("carousel")}
          className={`px-4 py-2 rounded ${
            section === "carousel" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Carrusel inicio
        </button>
      </div>

      {/* Gestión de coches */}
      {section === "cars" && (
        <>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
            onClick={() => {
              setShowForm(!showForm);
              setEditingCar(null);
            }}
          >
            {showForm ? "Cancelar" : "+ Añadir coche"}
          </button>

          {showForm ? (
            <CarForm
              initialData={editingCar || undefined}
              onSave={handleSaveCar}
              onCancel={() => {
                setShowForm(false);
                setEditingCar(null);
              }}
            />
          ) : (
            <CarTable
              cars={cars}
              onEdit={(car) => {
                setEditingCar(car);
                setShowForm(true);
              }}
              onDelete={async (id) => {
                await deleteCar(id);
                loadCars();
              }}
            />
          )}
        </>
      )}

      {/* Gestión del carrusel */}
      {section === "carousel" && <CarouselAdmin />}
    </div>
  );
}
