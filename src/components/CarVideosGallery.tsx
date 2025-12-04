// src/components/CarVideosGallery.tsx

"use client";

import Image from "next/image";

interface Props {
  videos: string[];
  onClickVideo?: (url: string) => void; // opcional, por si luego quieres modal
}

export default function CarVideosGallery({ videos, onClickVideo }: Props) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="mt-10">
      
      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        🎥 Vídeos
      </h2>

      {/* GRID IGUAL QUE LA GALERÍA */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {videos.map((url, i) => (
          <button
            key={i}
            onClick={() =>
              onClickVideo
                ? onClickVideo(url)
                : window.location.assign("#videos") // o cambia esto por modal luego
            }
            className="rounded-xl overflow-hidden shadow hover:scale-[1.03] transition border bg-black/10 relative"
          >
            {/* PREVIEW — SOLO UN ICONO DE VIDEO */}
            <div className="w-full h-full flex items-center justify-center bg-black/40">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="white"
                className="drop-shadow"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
