"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  imagenes: { url: string }[];
}

export default function ProfileClient() {
  const { user, loading, refreshToken } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API}/favoritos`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        mode: "cors",
      });

      if (!res.ok) return;

      const data = await res.json();
      setFavorites(data.favoritos || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = async (carId: number) => {
    try {
      let res = await fetch(`${API}/favoritos/${carId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Si obtiene 401, refrescar token e intentar nuevamente
      if (res.status === 401) {
        console.log("Token expirado, refrescando...");
        await refreshToken();
        res = await fetch(`${API}/favoritos/${carId}`, {
          method: "DELETE",
          credentials: "include",
        });
      }

      if (res.ok) {
        setFavorites(favorites.filter((car) => car.id !== carId));
      } else {
        console.error("Error eliminando favorito:", res.statusText);
      }
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  };

  if (loading || !user) {
    return <div className="pt-20 text-center">Cargando...</div>;
  }

  return (
    <motion.section
      className="pt-24 pb-10 max-w-4xl mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Coches Favoritos */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Mis Coches Favoritos ({favorites.length})</h2>

        {loadingFavorites ? (
          <p className="text-center text-gray-500">Cargando favoritos...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">No tienes coches favoritos aún</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
              Ver todos los coches
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((car) => (
              <motion.div
                key={car.id}
                className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div
                  onClick={() => router.push(`/coches/${car.id}`)}
                  className="cursor-pointer"
                >
                  {car.imagenes && car.imagenes.length > 0 ? (
                    <img
                      src={car.imagenes[0].url}
                      alt={`${car.marca} ${car.model}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Sin imagen</span>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold text-lg">{car.marca} {car.model}</h3>
                    <p className="text-blue-600 font-semibold text-xl mt-2">
                      {car.precio.toLocaleString("es-ES")} €
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFavorite(car.id)}
                  className="w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition font-semibold"
                >
                  Eliminar de favoritos
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Perfil del Usuario */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.email}</h1>
            <p className="text-gray-600">Usuario registrado</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Información de la cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">ID de Usuario</label>
              <p className="text-lg font-medium">{user.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Rol</label>
              <p className="text-lg font-medium">{user.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
