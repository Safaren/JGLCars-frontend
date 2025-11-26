"use client";

interface Props {
  tipo?: string | null;
  size?: number; // tamaño en px
}

export default function EtiquetaDGT({ tipo, size = 50 }: Props) {
  if (!tipo) return null;

  const t = tipo.toUpperCase();

  const baseStyle = {
    width: size,
    height: size,
  };

  // SVGs oficiales adaptados
  const etiquetas: any = {
    "0": (
      <svg viewBox="0 0 100 100" style={baseStyle}>
        <circle cx="50" cy="50" r="45" fill="#1D70B7" stroke="#000" strokeWidth="3" />
        <text x="50" y="60" textAnchor="middle" fontSize="48" fill="#fff" fontWeight="bold">0</text>
      </svg>
    ),

    "ECO": (
      <svg viewBox="0 0 100 100" style={baseStyle}>
        <rect x="0" y="0" width="100" height="100" fill="#1D70B7" />
        <rect x="0" y="50" width="100" height="50" fill="#66BF39" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#000" strokeWidth="3" />
        <text x="50" y="63" textAnchor="middle" fontSize="34" fill="#fff" fontWeight="bold">ECO</text>
      </svg>
    ),

    "C": (
      <svg viewBox="0 0 100 100" style={baseStyle}>
        <circle cx="50" cy="50" r="45" fill="#66BF39" stroke="#000" strokeWidth="3" />
        <text x="50" y="60" textAnchor="middle" fontSize="48" fill="#000" fontWeight="bold">C</text>
      </svg>
    ),

    "B": (
      <svg viewBox="0 0 100 100" style={baseStyle}>
        <circle cx="50" cy="50" r="45" fill="#F6D34B" stroke="#000" strokeWidth="3" />
        <text x="50" y="60" textAnchor="middle" fontSize="48" fill="#000" fontWeight="bold">B</text>
      </svg>
    ),
  };

  return etiquetas[t] ?? null;
}
