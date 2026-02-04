// src/components/CarCard.tsx

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CarForFrontend } from "@/types/CarForFrontend";
import { FieldConfig } from "@/types/FieldConfig";
import EtiquetaDGT from "@/components/EtiquetaDGT";
import FavoriteModal from "@/components/FavoriteModal";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

import { EtiB, EtiC, Eti0, EtiEco } from "@/components/Iconsdd";

/* ============================================
   ICONOS MEJORADOS
   =========================================== */

// 🔧 ICONO POTENCIA (motor / CV)
const IconPotencia = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

// ⛽ ICONO COMBUSTIBLE
const IconCombustible = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 3h12v18H3z" />
    <path d="M16 8l3 3v7a2 2 0 1 1-4 0V8a2 2 0 0 1 4 0" />
  </svg>
);

// 🛣️ ICONO KILÓMETROS
const IconKm = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l4 9H8l4-9zm0 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

/* ============================================
   TIPOS Y PROPS
   =========================================== */

interface CarCardProps {
  car: CarForFrontend;
  fieldConfig?: Record<string, FieldConfig>;
}

/* ============================================
   COMPONENTE PRINCIPAL
   =========================================== */

export default function CarCard({ car, fieldConfig = {} }: CarCardProps) {
  const { user } = useAuth();
  const img = car.imagenes?.[0]?.url || "/no-image.jpg";
  const href = `/coches/${car.id}`;
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Helper: decidir si mostrar un campo (por defecto: true)
  const show = (key: string, fallback = true) =>
    fieldConfig?.[key]?.visible ?? fallback;

  // ❤️ Estado del corazón
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Verificar si el coche está en favoritos al cargar
  useEffect(() => {
    if (!user) return;

    const checkFavorite = async () => {
      try {
        const res = await fetch(`${API}/favoritos`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const isFavorite = data.favoritos?.some((fav: any) => fav.id === car.id);
          setLiked(isFavorite || false);
        }
      } catch (err) {
        console.error("Error checking favorites:", err);
      }
    };

    checkFavorite();
  }, [user, car.id, API]);

  const { refreshToken } = useAuth();

  const handleHeartClick = async (e: React.MouseEvent) => {
    // Evita que se abra la ficha del coche
    e.preventDefault();
    e.stopPropagation();

    // Si no está logeado, muestra el modal
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const makeFavoriteRequest = async () => {
        if (liked) {
          // Eliminar de favoritos
          return await fetch(`${API}/favoritos/${car.id}`, {
            method: "DELETE",
            credentials: "include",
          });
        } else {
          // Agregar a favoritos
          return await fetch(`${API}/favoritos`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carId: car.id }),
          });
        }
      };

      let res = await makeFavoriteRequest();

      // Si obtiene 401, refrescar token e intentar nuevamente
      if (res.status === 401) {
        console.log("Token expirado, refrescando...");
        await refreshToken();
        res = await makeFavoriteRequest();
      }

      if (res.ok) {
        setLiked(!liked);
        setToastMessage(
          liked ? "Removido de favoritos" : "¡Añadido a favoritos!"
        );
        setShowToast(true);
      } else {
        console.error("Error al actualizar favorito:", res.statusText);
        setToastMessage("Error al actualizar favorito");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
      setToastMessage("Error al actualizar favorito");
      setShowToast(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="
        bg-white rounded-2xl shadow-md hover:shadow-xl
        overflow-hidden border border-gray-100 
        transition cursor-pointer
      "
    >
      <Link href={href}>
        {/* IMAGEN */}
        <div className="relative w-full h-56 bg-gray-100">
          <Image
            src={img}
            alt={`${car.marca ?? ""} ${car.model ?? ""}`}
            fill
            className="object-cover"
          />

          {/* ❤️ CORAZÓN SIEMPRE VISIBLE (botón) */}
          <motion.button
            onClick={handleHeartClick}
            aria-label="Me interesa"
            className="
              absolute top-3 right-3 
              p-2 rounded-full 
              bg-white/30 backdrop-blur 
              shadow-lg transition
              flex items-center justify-center
            "
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              animate={{
                scale: liked ? [1, 1.18, 1] : 1,
                fill: liked ? "#ff6b81" : "transparent",
              }}
              transition={{
                scale: { duration: 0.35, ease: "easeOut" },
                fill: { duration: 3, ease: "linear" },
              }}
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.172 5.172a4.5 4.5 0 016.364 0L12 
                   7.636l2.464-2.464a4.5 4.5 0 116.364 
                   6.364L12 21.364l-8.828-8.828a4.5 
                   4.5 0 010-6.364z"
              />
            </motion.svg>
          </motion.button>

          {/* Año en óvalo naranja */}
          {show("anoFabricacion") && car.anoFabricacion && (
            <span
              className="
                absolute top-2 left-2 
                bg-orange-500 text-white 
                px-3 py-1 
                rounded-full 
                text-xs font-bold shadow-md
              "
            >
              {car.anoFabricacion}
            </span>
          )}
          {/* BADGE: Venta por piezas */}
          {car.tipoVenta === "PIEZAS" && (
            <div
              className="
      absolute top-4 left-1/2 -translate-x-1/2
      bg-red-600/90 backdrop-blur-sm
      px-4 py-1
      rounded-full
      text-white text-sm font-bold
      shadow-lg border border-red-300
    "
            >
              Venta por piezas
            </div>
          )}

        </div>

        {/* INFO */}
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            {show("marca") && car.marca} {show("model") && car.model}
          </h3>

          {/* PRECIO O MENSAJE ESPECIAL SEGÚN TIPO DE VENTA */}
          {show("precio") && (
            car.tipoVenta === "PIEZAS" ? (
              <p className="text-red-500 font-bold text-lg">
                Venta por piezas — consultar en contacto
              </p>
            ) : (
              <p className="text-blue-600 font-extrabold text-2xl">
                {typeof car.precio === "number"
                  ? car.precio.toLocaleString()
                  : car.precio} €
              </p>
            )
          )}


          {/* Línea de especificaciones */}
          {/* Línea de especificaciones */}
          <div className="mt-2 space-y-1">
            {/* Primera línea: Potencia, Combustible, Etiqueta */}
            <div className="text-gray-700 text-sm flex flex-wrap items-center gap-x-6">
              {show("potencia") && car.potencia && (
                <span className="flex items-center gap-1">
                  <IconPotencia />
                  <strong className="text-gray-800">{car.potencia} CV</strong>
                </span>
              )}

              {show("combustible") && car.combustible && (
                <span className="flex items-center gap-1">
                  <IconCombustible />
                  <strong className="text-gray-800">{car.combustible}</strong>
                </span>
              )}

              {show("ambiental") && car.ambiental && car.ambiental !== "SIN_ETIQUETA.SVG" && car.ambiental !== "SIN ETIQUETA" && car.ambiental !== "" && (
                <span className="flex items-center">
                  <EtiquetaDGT tipo={car.ambiental} size={32} />
                </span>
              )}
            </div>

            {/* Segunda línea: Kilómetros */}
            {show("km") && car.km != null && (
              <div className="text-gray-700 text-sm flex items-center gap-1">
                <IconKm />
                <strong className="text-gray-800">{car.km.toLocaleString()} km</strong>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN */}
        <div className="px-4 pb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="
              text-center bg-blue-600 text-white 
              py-2 rounded-xl mt-2 font-semibold
            "
          >
            Ver detalles
          </motion.div>
        </div>
      </Link>

      <FavoriteModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Toast
        message={toastMessage}
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  );
}
