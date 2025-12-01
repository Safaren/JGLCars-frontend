// src/components/CarVideos.tsx

"use client";

interface Props {
  videos: string[];
}

export default function CarVideos({ videos }: Props) {
  if (!videos || videos.length === 0) return null;

  // Convierte cualquier URL válida en URL embed
  const normalize = (url: string) => {
    return url
      .trim()
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "youtube.com/embed/");
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        🎥 Vídeos del vehículo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((url, i) => {
          const embedUrl = normalize(url);

          return (
            <div key={i} className="w-full bg-black/10 rounded-xl shadow overflow-hidden">
              <div className="relative aspect-video w-full">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
