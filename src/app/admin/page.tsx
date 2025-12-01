"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarForm from "@/components/CarForm";
import CarTable from "@/components/CarTable";
import CarCarruselConfig from "@/components/CarCarruselConfig";
import CarFieldsConfig from "@/components/CarFieldsConfig";
import { getCars, addCar, updateCar, deleteCar, updateCarrusel } from "@/lib/api";
import { CarForFrontend } from "@/types/CarForFrontend";
import { CarInput } from "@/types";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

type CarruselConfigInput = {
  destacado: boolean;
  carruselFotos: string[];
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [section, setSection] = useState<"cars" | "carousel" | "fields">("cars");
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarForFrontend | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para el modal de confirmación
  const [carToDelete, setCarToDelete] = useState<number | null>(null); // ID del coche a eliminar

  const sanitizeCar = (car: any): CarForFrontend => ({
    ...car,
    imagenes: Array.isArray(car.imagenes) ? car.imagenes.map((i: any) => ({ url: i.url })) : [],
    destacado: Boolean(car.destacado),
    carruselFotos: Array.isArray(car.carruselFotos) ? car.carruselFotos : [],
  });

  // Cargar coches
  const loadCars = async () => {
    try {
      const data = await getCars();
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

  // Guardar coche
  const handleSaveCar = async (data: CarInput) => {
    try {
      let savedCar;
      if (editingCar) {
        savedCar = await updateCar(editingCar.id, data);
      } else {
        savedCar = await addCar(data);
      }

      toast.success("Coche guardado correctamente 🚗✨");
      return savedCar;
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar el coche");
      return null;
    }
  };

  // Guardar carrusel
  const saveCarruselConfig = async (id: number, data: CarruselConfigInput) => {
    try {
      await updateCarrusel(id, data);
      toast.success("Configuración guardada ✔");
      loadCars();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar configuración");
    }
  };

  // Eliminar coche
  const handleDeleteCar = async (id: number) => {
    if (id && carToDelete !== null) {
      try {
        await deleteCar(id); // Aquí llamas a la API para eliminar el coche
        toast.success("Coche eliminado correctamente 🚗💨");
        setShowDeleteModal(false); // Cerrar el modal de confirmación
        loadCars(); // Volver a cargar la lista de coches
      } catch (err) {
        toast.error("No se pudo eliminar el coche");
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Cerrar el modal sin eliminar
    setCarToDelete(null); // Resetear el coche a eliminar
  };

  // UI
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* CABECERA */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Panel de administración</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={async () => {
            await fetch(`${API}/auth/logout`, {
              method: "POST",
              credentials: "include",
              cache: "no-store",
              mode: "cors",
            });
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* SECCIONES */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setSection("cars")} className={`px-4 py-2 rounded-lg ${section === "cars" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Gestión de coches
        </button>
        <button onClick={() => setSection("carousel")} className={`px-4 py-2 rounded-lg ${section === "carousel" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Carrusel de inicio
        </button>
        <button onClick={() => setSection("fields")} className={`px-4 py-2 rounded-lg ${section === "fields" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Configurar campos
        </button>
      </div>

      {/* COCHES */}
      {section === "cars" && (
        <>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4" onClick={() => { setShowForm(!showForm); setEditingCar(null); }}>
            {showForm ? "Cancelar" : "+ Añadir coche"}
          </button>

          {showForm ? (
            <CarForm initialData={editingCar || undefined} onSave={handleSaveCar} onCancel={() => { setShowForm(false); setEditingCar(null); }} />
          ) : (
            <CarTable
              cars={cars}
              onEdit={(car) => { setEditingCar(sanitizeCar(car)); setShowForm(true); }}
              onDelete={(id) => { setCarToDelete(id); setShowDeleteModal(true); }} // Abrir el modal de confirmación
            />
          )}
        </>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">¿Estás seguro de eliminar este coche?</h2>
            <p className="text-gray-700 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-4">
              <button onClick={cancelDelete} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cancelar</button>
              <button onClick={() => handleDeleteCar(carToDelete!)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* CARRUSEL */}
      {section === "carousel" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Carrusel de inicio</h2>
          {cars.map((car) => (
            <CarCarruselConfig key={car.id} car={car} onSave={(data) => saveCarruselConfig(car.id!, data)} />
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
