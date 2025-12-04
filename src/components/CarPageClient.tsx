// src/components/CarPageClient.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";
import EtiquetaDGT from "@/components/EtiquetaDGT";
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
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ⭐ Modales
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);

  // ⭐ Config campos
  const fieldConfig = loadFieldConfig();

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
          {fieldConfig.precio?.visible !== false && car.precio && (
            <p className="text-cyan-400 text-3xl font-bold mt-3">
              {car.precio.toLocaleString()} €
            </p>
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
          {fieldConfig.ambiental?.visible && car.ambiental && (
            <div className="flex items-center gap-3 mt-6">
              <h4 className="font-semibold text-gray-700">Etiqueta ambiental:</h4>
              <EtiquetaDGT tipo={car.ambiental} size={70} />
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

    </section>
  );
}
