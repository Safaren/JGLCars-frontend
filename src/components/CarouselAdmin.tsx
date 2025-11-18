"use client";

import { useEffect, useState } from "react";
import { CarouselSlide } from "@/types";

export default function CarouselAdmin() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const loadSlides = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carousel`);
    const data = await res.json();
    setSlides(data);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const uploadSlide = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carousel`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setFile(null);
    loadSlides();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-600">Carrusel de inicio</h2>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button
        onClick={uploadSlide}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Subir foto
      </button>

      <div className="grid grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <img src={slide.url} className="w-full h-40 object-cover rounded" />

            <button
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
              onClick={async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carousel/${slide.id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                loadSlides();
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
