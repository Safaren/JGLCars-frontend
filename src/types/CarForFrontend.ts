import type { Car } from "@/types/prisma-types";

/**
 * Tipo seguro para FRONTEND:
 * - Omitimos "imagenes" del tipo Prisma porque no coincide
 * - Convertimos TODO lo demás en opcional
 * - Añadimos imagenes simplificadas
 * - REDEFINIMOS tipoVenta como enum seguro
 */
export type CarForFrontend = Partial<Omit<Car, "imagenes" | "tipoVenta">> & {
  imagenes?: { url: string }[];
  tipoVenta?: "COCHE" | "PIEZAS" | null;
};
