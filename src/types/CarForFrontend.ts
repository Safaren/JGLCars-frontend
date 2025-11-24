import type { Car } from "@/types/prisma-types";

// Un Car que viene de la API puede traer solo algunos campos,
// así que hacemos TODAS las propiedades opcionales.
export type CarForFrontend = Partial<Car> & {
  imagenes?: { url: string }[];
};
