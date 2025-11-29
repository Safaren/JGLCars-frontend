"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarCarruselConfig from "@/components/CarCarruselConfig";
import CarFieldsConfig from "@/components/CarFieldsConfig";

import { getCars, addCar, updateCar, deleteCar } from "@/lib/api";

import { CarForFrontend } from "@/types/CarForFrontend";
import { CarInput } from "@/types";

import toast from "react-hot-toast";

type CarruselConfigInput = {
  destacado: boolean;
  carruselFotos: string[];
};

export default function AdminPage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // ⭐ TOKEN SEGURO EN ESTADO
  const [token, setToken] = useState<string>("");

  const [section, setSection] =
    useState<"cars" | "carousel" | "fields">("cars");

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
    carruselFotos: Array.isArray(car.carruselFotos)
      ? car.carruselFotos
      : [],
  });

  // ===========================
  // CARGAR TOKEN SEGURO
  // ===========================
  useEffect(() => {
    const tk = localStorage.getItem("token");
    if (tk) setToken(tk);
  }, []);

  // ===========================
  // CONTROL DE ACCESO
  // ===========================
  useEffect(() => {
    try {
      const tk = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!tk || !savedUser) {
        setAllowed(false);
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.rol?.toLowerCase() !== "admin") {
        setAllowed(false);
        return;
      }

      setUser(parsedUser);
      setAllowed(true);
    } catch {
      setAllowed(false);
    }
  }, []);

  // ===========================
  // CARGAR COCHES
  // ===========================
  const loadCars = async () => {
    try {
      if (!token) return; // 🔥 Evita llamadas antes de tener el token

      const data = await getCars(token);

      const sanitized = Array.isArray(data)
        ? data.map((car) => sanitizeCar(car))
        : [];

      setCars(sanitized);
    } catch (err) {
      console.error("❌ Error cargando coches:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    if (allowed && token) loadCars();
  }, [allowed, token]);

  // ===========================
  // CREAR / EDITAR COCHE
  // ===========================
  const handleSaveCar = async (data: CarInput) => {
    try {
      let result;

      if (!token) throw new Error("No token");

      if (editingCar) {
        result = await updateCar(editingCar.id, data, token);
      } else {
        result = await addCar(data, token);
      }

      toast.success("Coche guardado correctamente 🚗✨");
      return result;
    } catch (err) {
      console.error("❌ Error guardando coche:", err);
      toast.error("No se pudo guardar el coche");
      return null;
    }
  };

  const volverALista = () => {
    setShowForm(false);
    setEditingCar(null);
    loadCars();
    router.push("/admin");
  };

  // ===========================
  // GUARDAR CONFIGURACIÓN CARRUSEL
  // ===========================
  const saveCarruselConfig = async (id: number, data: CarruselConfigInput) => {
    try {
      if (!token) throw new Error("No token");

      await fetch(`${API}/cars/carrusel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      toast.success("Configuración del carrusel guardada ✔");
      loadCars();
    } catch (err) {
      console.error("Error guardando configuración:", err);
      toast.error("No se pudo guardar configuración");
    }
  };

  // ===========================
  // RENDER
  // ===========================
  if (allowed === null || !token) {
    return <p className="p-6 text-gray-500">Cargando...</p>;
  }

  if (!allowed) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl text-red-600 font-bold mb-2">
          ⚠ Acceso restringido
        </h2>
        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* CABECERA */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel de administración
        </h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* BOTONES DE SECCIÓN */}
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

        <button
          onClick={() => setSection("fields")}
          className={`px-4 py-2 rounded-lg font-medium ${
            section === "fields"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Configurar campos
        </button>
      </div>

      {/* SECCIÓN COCHES */}
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
              initialData={editingCar ? sanitizeCar(editingCar) : undefined}
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
                await deleteCar(id, token);
                loadCars();
              }}
            />
          )}
        </>
      )}

      {/* SECCIÓN CARRUSEL */}
      {section === "carousel" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Configuración del Carrusel</h2>

          {cars.map((car) => (
            <CarCarruselConfig
              key={car.id}
              car={car}
              onSave={(data: CarruselConfigInput) =>
                saveCarruselConfig(car.id!, data)
              }
            />
          ))}
        </div>
      )}

      {/* SECCIÓN CONFIGURAR CAMPOS */}
      {section === "fields" && (
        <div className="mt-4">
          <CarFieldsConfig />
        </div>
      )}
    </div>
  );
}
