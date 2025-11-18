"use client";

import { useEffect, useState } from "react";
import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarouselAdmin from "@/components/CarouselAdmin";
import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";
import { Car, CarInput } from "@/types";

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [section, setSection] = useState<"cars" | "carousel">("cars");

  const loadCars = async () => {
    const data = await getCars();
    setCars(data);
  };

  useEffect(() => {
    loadCars();
  }, []);

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

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Panel de Administración</h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
              method: "POST",
              credentials: "include",
            })
          }
        >
          Cerrar sesión
        </button>
      </div>

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

      {section === "carousel" && <CarouselAdmin />}
    </div>
  );
}
