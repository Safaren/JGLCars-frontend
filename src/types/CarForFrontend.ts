import type { Car } from "@/types/prisma-types";

/**
 * Tipo seguro para FRONTEND:
 * - Eliminamos del tipo Prisma los campos que NO coinciden con lo que devuelve la API
 * - Convertimos los demás en opcionales
 * - Redefinimos tipoVenta correctamente con su enum
 * - Redefinimos imagenes al formato real del backend
 */
export type CarForFrontend = Partial<
  Omit<Car, "imagenes" | "tipoVenta">
> & {
  imagenes?: { url: string }[];
  tipoVenta?: "COCHE" | "PIEZAS" | null;
};
