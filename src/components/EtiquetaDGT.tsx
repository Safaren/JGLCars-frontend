"use client";

interface Props {
  tipo?: string | null;
  size?: number;
}

export default function EtiquetaDGT({ tipo, size = 32 }: Props) {
  if (!tipo) return null;

  // Normalizar nombre
  const key = tipo.toUpperCase();

  // Validar que sea una etiqueta válida (no vacía, no "SIN ETIQUETA")
  if (key === "" || key.includes("SIN") || key.includes("SIN_ETIQUETA")) return null;

  // Ruta del archivo SVG en /public
  const src = `/etiquetas/${key}.svg`;

  return (
    <img
      src={src}
      alt={`Etiqueta ${key}`}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "inline-block",
      }}
    />
  );
}
