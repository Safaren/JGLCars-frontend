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
        <CarCarousel images={images} showThumbnails={false} interval={3000} />
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
                // Excluir campos especiales que se muestran en otras secciones
                const specialFields = ['titulo', 'precio', 'imagenes', 'galeria', 'descripcion', 'botonContacto', 'etiqueta'];
                if (specialFields.includes(key)) return false;
                
                // Solo mostrar campos visibles y que tengan valor
                if (!config.visible) return false;
                
                const value = (car as any)[key];
                if (value === undefined || value === null || value === '') return false;
                
                return true;
              })
              .map(([key, config]) => {
                const value = (car as any)[key];
                let displayValue: string = '';

                // Formatear según el tipo
                if (config.type === 'boolean') {
                  displayValue = value ? 'Sí' : 'No';
                } else if (config.type === 'number') {
                  if (key === 'potencia') {
                    displayValue = `${value} CV`;
                  } else if (key === 'consumo') {
                    displayValue = `${value} L/100km`;
                  } else if (key === 'cilindrada') {
                    displayValue = `${value} cc`;
                  } else if (key === 'km') {
                    displayValue = `${value.toLocaleString()} km`;
                  } else if (key === 'precio') {
                    displayValue = `${value.toLocaleString()} €`;
                  } else {
                    displayValue = value.toString();
                  }
                } else if (config.type === 'date') {
                  const date = new Date(value);
                  if (!isNaN(date.getTime())) {
                    displayValue = date.toLocaleDateString('es-ES');
                  } else {
                    displayValue = value.toString();
                  }
                } else if (config.type === 'select' && config.options) {
                  // Buscar el label correspondiente al value
                  const option = config.options.find(
                    (opt) => (typeof opt === 'string' ? opt : opt.value) === value
                  );
                  displayValue = typeof option === 'string' ? option : option?.label || value;
                } else {
                  displayValue = value.toString();
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
          {fieldConfig.descripcion?.visible !== false && car.descripcion && (
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
            <h2 className="font-bold mb-3 text-gray-700 text-center text-3xl">
              Galería
            </h2>

            {(() => {
const videoThumb = (url: string) => {
  // Para videos normales
  const matchRegular = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  if (matchRegular) {
    return `https://img.youtube.com/vi/${matchRegular[1]}/hqdefault.jpg`;
  }

  // Para YouTube Shorts (https://www.youtube.com/shorts/VIDEO_ID)
  const matchShort = url.match(/(?:shorts\/)([A-Za-z0-9_-]{11})/);
  if (matchShort) {
    return `https://img.youtube.com/vi/${matchShort[1]}/hqdefault.jpg`;
  }

  return null;  // Si no es un video válido de YouTube
};

type Item = { type: "image" | "video"; url: string; thumb?: string };

const items: Item[] = [
  ...images.map((url) => ({ type: "image" as const, url })),
  ...(car.videos || []).map((url) => ({
    type: "video" as const,
    url,
    thumb: videoThumb(url) || undefined
  }))
];
              return (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        item.type === "image"
                          ? setImageModal(item.url)
                          : setVideoModal(item.url)
                      }
                      className="relative rounded-lg overflow-hidden shadow-sm border"
                    >
                    <img
                      src={
                        item.type === "image"
                          ? item.url || "/fallback-image.png"
                          : item.thumb || "/fallback-image.png"
                      }
                      alt=""
                      className="object-cover w-full h-28"
                    />


                      {item.type === "video" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-3xl">▶</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              );
            })()}
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
