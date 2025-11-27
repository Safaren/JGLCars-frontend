"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "@/components/CarCarousel";
import { motion } from "framer-motion";
import EtiquetaDGT from "@/components/EtiquetaDGT";
import { loadFieldConfig } from "@/config/carFields";

interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  combustible: string;
  color: string;
  consumo?: number;
  potencia?: number;
  cilindrada?: number;
  anoFabricacion?: number;
  descripcion?: string;
  etiqueta?: string;
  imagenes?: { url: string }[];
  videos?: string[];
}

export default function CarPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);

  // 🔥 Cargar configuración de campos
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
        console.error(error);
        if (!mounted) return;
        setErr("Error cargando los datos");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoModal(null);
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      mounted = false;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500 text-xl mt-20">Cargando coche...</div>;
  }

  if (err) {
    return <div className="text-center text-red-600 text-xl mt-20">{err}</div>;
  }

  if (!car) {
    return <div className="text-center text-gray-500 text-xl mt-20">Coche no encontrado.</div>;
  }

  const images = car.imagenes?.map((i) => i.url) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 mb-32">
      {/* CAROUSEL */}
      {fieldConfig.imagenes?.visible !== false && <CarCarousel images={images} />}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ---------- DATOS DEL COCHE ---------- */}
        <div>
          {/* TÍTULO */}
          {fieldConfig.titulo?.visible !== false && (
            <h1 className="text-4xl font-extrabold text-cyan-500">
              {car.marca} {car.model}
            </h1>
          )}

          {/* PRECIO */}
          {fieldConfig.precio?.visible !== false && (
            <p className="text-cyan-400 text-3xl font-bold mt-3">
              {car.precio?.toLocaleString?.() ?? car.precio} €
            </p>
          )}

          {/* CAMPOS DINÁMICOS */}
          <div className="mt-8 space-y-3 text-gray-800 text-lg">

            {fieldConfig.model?.visible && car.model && (
              <p>
                <strong className="text-amber-500">{fieldConfig.model.label}:</strong>
                <span className="text-amber-300"> {car.model}</span>
              </p>
            )}

            {fieldConfig.marca?.visible && car.marca && (
              <p>
                <strong className="text-amber-500">{fieldConfig.marca.label}:</strong>
                <span className="text-amber-300"> {car.marca}</span>
              </p>
            )}

            {fieldConfig.anoFabricacion?.visible && car.anoFabricacion && (
              <p>
                <strong className="text-amber-500">{fieldConfig.anoFabricacion.label}:</strong>
                <span className="text-amber-300"> {car.anoFabricacion}</span>
              </p>
            )}

            {fieldConfig.potencia?.visible && car.potencia && (
              <p>
                <strong className="text-amber-500">{fieldConfig.potencia.label}:</strong>
                <span className="text-amber-300"> {car.potencia} CV</span>
              </p>
            )}

            {fieldConfig.consumo?.visible && car.consumo && (
              <p>
                <strong className="text-amber-500">{fieldConfig.consumo.label}:</strong>
                <span className="text-amber-300">{car.consumo} L/100km</span>
              </p>
            )}

            {fieldConfig.cilindrada?.visible && car.cilindrada && (
              <p>
                <strong className="text-amber-500">{fieldConfig.cilindrada.label}:</strong>
                <span className="text-amber-300"> {car.cilindrada} cc</span>
              </p>
            )}

            {fieldConfig.combustible?.visible && car.combustible && (
              <p>
                <strong className="text-amber-500">{fieldConfig.combustible.label}:</strong>
                <span className="text-amber-300"> {car.combustible}</span>
              </p>
            )}

            {fieldConfig.color?.visible && car.color && (
              <p>
                <strong className="text-amber-500">{fieldConfig.color.label}:</strong>
                <span className="text-amber-300"> {car.color}</span>
              </p>
            )}
          </div>

          {/* ETIQUETA DGT */}
          {fieldConfig.etiqueta?.visible && car.etiqueta && (
            <div className="flex items-center gap-3 mt-6">
              <h4 className="font-semibold text-gray-700">Etiqueta ambiental:</h4>
              <EtiquetaDGT tipo={car.etiqueta} size={70} />
            </div>
          )}

          {/* BOTÓN CONTACTO */}
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
        </div>

        {/* ---------- GALERÍA (IMÁGENES + VÍDEOS) ---------- */}
        {fieldConfig.galeria?.visible !== false && (
          <aside className="bg-gray-300 p-4 rounded-xl shadow-md">
            <h2 className="font-bold mb-3 text-gray-700 text-center text-3xl">
              Galería
            </h2>

            {(() => {
              const videoThumb = (url: string) => {
                const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
                return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
              };

              type GalleryItem = {
                type: "image" | "video";
                url: string;
                thumb?: string;
              };

              const galleryItems: GalleryItem[] = [
                ...images.map((url) => ({ type: "image" as const, url })),
                ...(Array.isArray(car.videos)
                  ? car.videos.map((url) => ({
                      type: "video" as const,
                      url,
                      thumb: videoThumb(url) ?? undefined,
                    }))
                  : []),
              ];

              return (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {galleryItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (item.type === "image") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          setVideoModal(item.url);
                        }
                      }}
                      className="relative rounded-lg overflow-hidden shadow-sm border"
                    >
                      <img
                        src={item.type === "image" ? item.url : item.thumb ?? ""}
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

      {/* ---------- DESCRIPCIÓN ---------- */}
      {fieldConfig.descripcion?.visible !== false && (
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-amber-500 mb-4">
            Descripción del coche
          </h3>

          <p className="text-amber-300 leading-relaxed">
            {car.descripcion ||
              "Este vehículo ha sido revisado y comprobado. Para más información, contáctanos y estaremos encantados de ayudarte."}
          </p>
        </div>
      )}

      {/* ---------- MODAL DE VIDEO ---------- */}
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
                src={videoModal
                  .trim()
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "youtube.com/embed/")}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
