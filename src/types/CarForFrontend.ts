import { Car } from "@/types/prisma-types";

// Sobrescribimos el tipo de "imagenes"
export type CarForFrontend = Omit<Car, "imagenes"> & {
  imagenes?: { url: string }[];
};
