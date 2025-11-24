import type { Car } from "@/types/prisma-types";

/**
 * Tipo seguro para FRONTEND:
 * - Omitimos "imagenes" del tipo Prisma (porque no coincide)
 * - Convertimos TODO lo demás en opcional
 * - Sobrescribimos "imagenes" con el formato real de la API
 */
export type CarForFrontend = Partial<Omit<Car, "imagenes">> & {
  imagenes?: { url: string }[];
};

