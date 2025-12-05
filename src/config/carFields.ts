import type { FieldConfig, OptionItem } from "@/types/FieldConfig";

// ----------------------------------------------------
// 🔵 Enums según tu Prisma
// ----------------------------------------------------

export const ENUM_TIPO_VENTA: OptionItem[] = [
  { label: "Coche", value: "COCHE" },
  { label: "Piezas", value: "PIEZAS" },
];

export const ENUM_CAMBIO: OptionItem[] = [
  { label: "Manual", value: "manual" },
  { label: "Automático", value: "automatico" },
];

export const ENUM_AMBIENTAL: OptionItem[] = [
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "Cero emisiones", value: "CERO" },
  { label: "Eco", value: "ECO" },
  { label: "Sin etiqueta", value: "SIN_ETIQUETA" },
];

// ----------------------------------------------------
// 🔵 Configuración de campos del modelo Car
// ----------------------------------------------------

export const CAR_FIELDS: Record<string, FieldConfig> = {
  marca: { label: "Marca", visible: true, editable: true, type: "text", required: true, order: 1 },
  model: { label: "Modelo", visible: true, editable: true, type: "text", required: true, order: 2 },
  consumo: { label: "Consumo (L/100km)", visible: false, editable: true, type: "number" },
  km: { label: "Kilómetros", visible: true, editable: true, type: "number", required: true, order: 3 },
  combustible: { label: "Combustible", visible: true, editable: true, type: "text", required: true, order: 4 },
  anoFabricacion: { label: "Año fabricación", visible: true, editable: true, type: "number", required: true, order: 5 },
  cilindrada: { label: "Cilindrada (CC)", visible: false, editable: true, type: "number" },
  puertas: { label: "Puertas", visible: false, editable: true, type: "number" },
  plazas: { label: "Plazas", visible: false, editable: true, type: "number" },
  itv: { label: "ITV", visible: false, editable: true, type: "date" },
  ambiental: { label: "Etiqueta Ambiental", visible: false, editable: true, type: "select", options: ENUM_AMBIENTAL, order: 6 },
  precio: { label: "Precio (€)", visible: true, editable: true, type: "number", required: true, order: 7 },
  potencia: { label: "Potencia (CV)", visible: false, editable: true, type: "number" },
  carroceria: { label: "Carrocería", visible: false, editable: true, type: "text" },
  cambio: { label: "Cambio", visible: false, editable: true, type: "select", options: ENUM_CAMBIO },
  color: { label: "Color", visible: true, editable: true, type: "text", order: 8 },
  matricula: { label: "Matrícula", visible: false, editable: true, type: "text" },
  tipoVenta: { label: "Tipo de venta", visible: false, editable: true, type: "select", options: ENUM_TIPO_VENTA },
  garantia: { label: "Garantía", visible: false, editable: true, type: "boolean" },
  descripcion: { label: "Descripción", visible: false, editable: true, type: "text" },
  destacado: { label: "Destacado", visible: false, editable: true, type: "boolean" },
  videos: { label: "Vídeos (YouTube URLs, uno por línea)", visible: false, editable: true, type: "text" },
};

// ----------------------------------------------------
// 🔵 Persistencia en localStorage
// ----------------------------------------------------

export function saveFieldConfig(config: Record<string, FieldConfig>) {
  localStorage.setItem("car_field_config", JSON.stringify(config));
}

export function loadFieldConfig(): Record<string, FieldConfig> {
  if (typeof window === "undefined") return CAR_FIELDS;

  const raw = localStorage.getItem("car_field_config");
  if (!raw) return CAR_FIELDS;

  try {
    const parsed = JSON.parse(raw);
    const merged: Record<string, FieldConfig> = { ...CAR_FIELDS };

    for (const key of Object.keys(parsed)) {
      if (!merged[key]) continue;

      merged[key] = {
        ...merged[key],
        visible: parsed[key].visible,
        editable: parsed[key].editable,
      };
    }

    return merged;
  } catch {
    return CAR_FIELDS;
  }
}
