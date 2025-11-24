// src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarouselAdmin from "@/components/CarouselAdmin";

import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";
import { Car, CarInput } from "@/types";

import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const [section, setSection] = useState<"cars" | "carousel">("cars");

  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // ===============================
  // 🔐 SEGURIDAD BÁSICA
  // ===============================
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const saved = localStorage.getItem("user");

      if (!token || !saved) {
        setAllowed(false);
        return;
      }

      const parsed = JSON.parse(saved);

      if (parsed.rol?.toLowerCase() !== "admin") {
        setAllowed(false);
        return;
      }

      setUser(parsed);
      setAllowed(true);

    } catch {
      setAllowed(false);
    }
  }, []);

  // ===============================
  // 🚗 CARGAR COCHES
  // ===============================
  const loadCars = async () => {
    try {
      const data = await getCars();
      setCars(data);
    } catch (err) {
      console.error("❌ Error cargando coches:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    if (allowed) loadCars();
  }, [allowed]);

  // ===============================
  // 💾 GUARDAR / EDITAR
  // ===============================
const handleSaveCar = async (data: CarInput) => {
  try {
    let result;

    if (editingCar) {
      result = await updateCar(editingCar.id, data);
    } else {
      result = await addCar(data);
    }

    console.log("🟩 handleSaveCar: result =", result);
    toast.success("Coche guardado correctamente 🚗✨");

    return result;

  } catch (err) {
    console.error("❌ Error guardando coche:", err);
    alert("Error: No se pudo guardar el coche.");
    return null;
  }
};


  // ===============================
  // ACCESO
  // ===============================
  if (allowed === null) {
    return <p className="p-6 text-gray-500">Cargando...</p>;
  }

  if (!allowed) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl text-red-600 font-bold mb-2">
          ⚠ Acceso restringido
        </h2>
        <p className="text-gray-700">
          Esta sección es solo para administradores.
        </p>

        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/")}
        >
          Volver al inicio
        </button>
      </div>
    );
  }
  const volverALista = () => {
  setShowForm(false);
  setEditingCar(null);
  loadCars();
};

  // ===============================
  // PANEL ADMIN
  // ===============================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel de administración
        </h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");  // 🟦 Importantísimo
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Secciones */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSection("cars")}
          className={`px-4 py-2 rounded-lg font-medium ${
            section === "cars"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Gestión de coches
        </button>

        <button
          onClick={() => setSection("carousel")}
          className={`px-4 py-2 rounded-lg font-medium ${
            section === "carousel"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Carrusel de inicio
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
            initialData={editingCar ?? undefined}
            onSave={handleSaveCar}
            onCancel={volverALista}
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
