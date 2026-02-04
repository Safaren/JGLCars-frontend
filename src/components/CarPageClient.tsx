// src/components/CarPageClient.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";
import EtiquetaDGT from "@/components/EtiquetaDGT";
import Toast from "@/components/Toast";
import FavoriteModal from "@/components/FavoriteModal";
import { useAuth } from "@/context/AuthContext";
import { loadFieldConfig } from "@/config/carFields";

interface Car {
  id: number;
  marca?: string;
  model?: string;
  precio?: number;
  combustible?: string;
  color?: string;
  consumo?: number;
  potencia?: number;
  cilindrada?: number;
  anoFabricacion?: number;
  descripcion?: string;
  ambiental?: string;
  km?: number;
  puertas?: number;
  plazas?: number;
  itv?: string | Date;
  carroceria?: string;
  cambio?: string;
  matricula?: string;
  tipoVenta?: string;
  garantia?: boolean;
  destacado?: boolean;
  imagenes?: { url: string }[];
  videos?: string[];
}

export default function CarPageClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, refreshToken } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const fieldConfig = loadFieldConfig();

  // Cargar datos del coche
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`);

        if (!res.ok) {
          setErr("No encontrado");
          return;
        }

        const data = await res.json();

        if (typeof data.anoFabricacion !== "number" || data.anoFabricacion < 1900) {
          data.anoFabricacion = undefined;
        }

        if (!mounted) return;
        setCar(data);
      } catch (error) {
        if (!mounted) return;
        setErr("Error cargando los datos");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    // ESC para cerrar
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoModal(null);
        setImageModal(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      mounted = false;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [id]);

  // Verificar favoritos cuando car o user cambien
  useEffect(() => {
    if (user && car) {
      const checkFav = async () => {
        try {
          const res = await fetch(`${API}/favoritos`, {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            const isFav = data.favoritos?.some((fav: any) => fav.id === car.id);
            setLiked(isFav || false);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      };
      checkFav();
    }
  }, [user, car, API]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowModal(true);
      return;
    }
    try {
      const makeFavoriteRequest = async () => {
        if (liked) {
          return await fetch(`${API}/favoritos/${car?.id}`, {
            method: "DELETE",
            credentials: "include",
          });
        } else {
          return await fetch(`${API}/favoritos`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carId: car?.id }),
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
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 text-xl mt-20">Cargando coche...</div>;

  if (err)
    return <div className="text-center text-red-600 text-xl mt-20">{err}</div>;

  if (!car)
    return <div className="text-center text-gray-500 text-xl mt-20">Coche no encontrado.</div>;

  const images = car.imagenes?.map((i) => i.url) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 mb-32">

      {/* ---------- CAROUSEL ---------- */}
      {fieldConfig.imagenes?.visible !== false && (
        <CarCarousel images={images} showThumbnails={false} interval={3000} carId={car.id} />
      

      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* ---------- DATOS PRINCIPALES ---------- */}
        <div>
          {/* TÍTULO */}
          {fieldConfig.titulo?.visible !== false && (car.marca || car.model) && (
            <h1 className="text-4xl font-extrabold text-cyan-500">
              {car.marca || ''} {car.model || ''}
            </h1>
          )}

          {/* PRECIO */}
{/* PRECIO O VENTA POR PIEZAS */}
{fieldConfig.precio?.visible !== false && (
  car.tipoVenta === "PIEZAS" ? (
    <p className="text-red-400 text-2xl font-bold mt-3">
      Venta por piezas — consultar en contacto
    </p>
  ) : (
    car.precio && (
      <p className="text-cyan-400 text-3xl font-bold mt-3">
        {car.precio.toLocaleString()} €
      </p>
    )
  )
)}

          {/* ---------- CAMPOS DINÁMICOS ---------- */}
          <div className="mt-8 space-y-3 text-gray-800 text-lg">
{Object.entries(fieldConfig)
  .filter(([key, config]) => {
    // Campos que SIEMPRE se muestran en otras secciones
    const specialFields = ['titulo', 'precio', 'imagenes', 'galeria', 'botonContacto', 'etiqueta', 'descripcion'];
    if (specialFields.includes(key)) return false;

    // Solo mostrar si es visible en el panel
    return config.visible;
  })
  .map(([key, config]) => {
    const raw = (car as any)[key];
    let displayValue = raw;

    // Convertir valores según el tipo
    if (raw === null || raw === undefined || raw === "") {
      displayValue = "—"; // Mostrar una raya en vez de ocultarlo
    } else if (config.type === "boolean") {
      displayValue = raw ? "Sí" : "No";
    } else if (key === "km") {
      displayValue = `${raw.toLocaleString()} km`;
    } else if (key === "consumo") {
      displayValue = `${raw} L/100km`;
    } else if (key === "potencia") {
      displayValue = `${raw} CV`;
    } else if (key === "cilindrada") {
      displayValue = `${raw} cc`;
    } else if (config.type === "date") {
      const d = new Date(raw);
      displayValue = d.toLocaleDateString("es-ES");
    } else if (config.type === "select" && config.options) {
      const opt = config.options.find(o =>
        typeof o === "string" ? o === raw : o.value === raw
      );
      displayValue = typeof opt === "string" ? opt : opt?.label ?? raw;
    }

    return (
      <p key={key}>
        <strong className="text-amber-500">{config.label}:</strong>
        <span className="text-amber-300"> {displayValue}</span>
      </p>
    );
  })}

          </div>

          {/* ---------- ETIQUETA ---------- */}
          {fieldConfig.ambiental?.visible && car.ambiental && car.ambiental !== "SIN_ETIQUETA.SVG" &&(
            <div className="flex items-center gap-3 mt-6">
              <h4 className="font-semibold text-gray-700"></h4>
              <EtiquetaDGT tipo={car.ambiental} size={48} />
            </div>
          )}

          {/* ---------- BOTÓN ---------- */}
          {fieldConfig.botonContacto?.visible !== false && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                router.push(
                  `/contacto?mensaje=${encodeURIComponent(
                    `Estoy interesado en el coche ${car.marca} ${car.model} (ID: ${car.id}).`
                  )}`
                )
              }
              className="mt-10 bg-amber-600 text-white text-xl px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              Me interesa
            </motion.button>
          )}

          {/* ---------- DESCRIPCIÓN ---------- */}
          { car.descripcion && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-amber-500 mb-4">Descripción del coche</h3>
              <p className="text-amber-300 leading-relaxed">
                {car.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* ---------- GALERÍA ---------- */}
        {fieldConfig.galeria?.visible !== false && (
         <aside className="bg-gray-300 p-4 rounded-xl shadow-md">

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* ---------- COLUMNA IZQUIERDA: VÍDEOS ---------- */}
    {car.videos && car.videos.length > 0 && (
      <div className="col-span-1">
        <h2 className="font-bold mb-3 text-gray-700 text-center text-2xl">
          Vídeos
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {car.videos.map((url, i) => {

            const matchRegular = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
            const matchShort = url.match(/(?:shorts\/)([A-Za-z0-9_-]{11})/);

            const videoId = matchRegular?.[1] || matchShort?.[1] || "";
            const thumb = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "/fallback-image.png";

            return (
              <button
                key={i}
                onClick={() => setVideoModal(url)}
                className="relative rounded-lg overflow-hidden shadow border"
              >
                <img src={thumb} className="object-cover w-full h-24" />

                {/* Icono de vídeo */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-2xl">▶</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* ---------- COLUMNA DERECHA: GALERÍA ---------- */}
    <div className="col-span-1 lg:col-span-2">
      <h2 className="font-bold mb-3 text-gray-700 text-center text-2xl">
        Galería
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setImageModal(url)}
            className="relative rounded-lg overflow-hidden shadow-sm border"
          >
            <img
              src={url}
              className="object-cover w-full h-28"
            />
          </button>
        ))}
      </div>
    </div>

  </div>

</aside>

        )}
      </div>

      {/* ---------- MODAL VIDEO ---------- */}
{videoModal && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
    <div className="relative bg-black rounded-xl w-full max-w-4xl overflow-hidden shadow-xl">
      <button
        onClick={() => setVideoModal(null)}
        className="absolute top-3 right-3 text-white text-3xl z-50"
      >
        ✕
      </button>

      <div className="relative aspect-video w-full">
        <iframe
          src={
            // Si el video es un short, lo reemplazamos con el formato correcto
            videoModal.includes("shorts")
              ? `https://www.youtube.com/embed/${videoModal.split("/shorts/")[1]}`
              : videoModal
                .trim()
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "youtube.com/embed/")
          }
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        />
      </div>
    </div>
  </div>
)}

      {/* ---------- MODAL IMAGEN ---------- */}
      {imageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-xl w-full max-w-4xl overflow-hidden shadow-xl">

            <button
              onClick={() => setImageModal(null)}
              className="absolute top-3 right-3 text-white text-3xl z-50"
            >
              ✕
            </button>

            <img
              src={imageModal}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE FAVORITOS */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={handleHeartClick}
          className="bg-white rounded-full p-4 shadow-lg focus:outline-none border-2 border-red-500"
          aria-label="Añadir a favoritos"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            animate={{
              scale: liked ? [1, 1.18, 1] : 1,
              fill: liked ? "#ff6b81" : "transparent",
            }}
            transition={{
              scale: { duration: 0.35, ease: "easeOut" },
              fill: { duration: 0.3, ease: "linear" },
            }}
            className="w-6 h-6 text-red-500"
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
      </div>

      <FavoriteModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Toast 
        message={toastMessage} 
        type="success" 
        visible={showToast} 
        onClose={() => setShowToast(false)} 
      />

    </section>
  );
}
