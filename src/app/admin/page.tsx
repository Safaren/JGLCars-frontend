"use client";

import { useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";

import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarCarruselConfig from "@/components/CarCarruselConfig";
import CarFieldsConfig from "@/components/CarFieldsConfig";

import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";

import { CarForFrontend } from "@/types/CarForFrontend";
import { CarInput } from "@/types";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";

type CarruselConfigInput = {
  destacado: boolean;
  carruselFotos: string[];
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6 text-gray-500">Cargando...</p>;
  if (!user || user.rol !== "admin") return redirect("/login");

  // ---------------------------
  // ESTADO
  // ---------------------------
  const [section, setSection] = useState<"cars" | "carousel" | "fields">("cars");

  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarForFrontend | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const sanitizeCar = (car: any): CarForFrontend => ({
    ...car,
    imagenes: Array.isArray(car.imagenes)
      ? car.imagenes.map((i: any) => ({ url: i.url }))
      : [],
    destacado: Boolean(car.destacado),
    carruselFotos: Array.isArray(car.carruselFotos) ? car.carruselFotos : [],
  });

  // ---------------------------
  // CARGAR COCHES (COOKIES)
  // ---------------------------
  const loadCars = async () => {
    try {
      const data = await getCars(); // usa fetch con credentials en lib/api.ts
      const sanitized = data?.map((c: any) => sanitizeCar(c)) || [];
      setCars(sanitized);
    } catch (err) {
      console.error("❌ Error cargando coches:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    if (user) loadCars();
  }, [user]);

  // ---------------------------
  // GUARDAR COCHE
  // ---------------------------
  const handleSaveCar = async (data: CarInput) => {
    try {
      if (editingCar) {
        await updateCar(editingCar.id, data);
      } else {
        await addCar(data);
      }

      toast.success("Coche guardado correctamente 🚗✨");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar el coche");
      return false;
    }
  };

  const volverALista = () => {
    setShowForm(false);
    setEditingCar(null);
    loadCars();
  };

  // ---------------------------
  // GUARDAR CARRUSEL
  // ---------------------------
  const saveCarruselConfig = async (id: number, data: CarruselConfigInput) => {
    try {
      await fetch(`${API}/cars/carrusel/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      toast.success("Configuración guardada ✔");
      loadCars();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar configuración");
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* CABECERA */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel de administración
        </h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={async () => {
            await fetch(`${API}/auth/logout`, {
              method: "POST",
              credentials: "include",
            });
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* SECCIONES */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSection("cars")}
          className={`px-4 py-2 rounded-lg ${
            section === "cars"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Gestión de coches
        </button>

        <button
          onClick={() => setSection("carousel")}
          className={`px-4 py-2 rounded-lg ${
            section === "carousel"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Carrusel de inicio
        </button>

        <button
          onClick={() => setSection("fields")}
          className={`px-4 py-2 rounded-lg ${
            section === "fields"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Configurar campos
        </button>
      </div>

      {/* COCHES */}
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
              onCancel={volverALista}
            />
          ) : (
            <CarTable
              cars={cars}
              onEdit={(car) => {
                setEditingCar(sanitizeCar(car));
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

      {/* CARRUSEL */}
      {section === "carousel" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Carrusel de inicio</h2>

          {cars.map((car) => (
            <CarCarruselConfig
              key={car.id}
              car={car}
              onSave={(data) => saveCarruselConfig(car.id!, data)}
            />
          ))}
        </div>
      )}

      {/* CAMPOS */}
      {section === "fields" && (
        <div className="mt-4">
          <CarFieldsConfig />
        </div>
      )}
    </div>
  );
}
