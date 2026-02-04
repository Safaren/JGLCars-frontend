/*import type { Car } from "@/types/prisma-types";

*
 * Tipo seguro para FRONTEND:
 * - Eliminamos del tipo Prisma los campos que NO coinciden con lo que devuelve la API
 * - Convertimos los demás en opcionales
 * - Redefinimos tipoVenta correctamente con su enum
 * - Redefinimos imagenes al formato real del backend
 
export type CarForFrontend = Partial<
  Omit<Car, "imagenes" | "tipoVenta">
> & {
  imagenes?: { url: string }[];
  tipoVenta?: "COCHE" | "PIEZAS" | null;
};*/


 export interface CarImage {
  url: string;
}

export interface CarForFrontend {
  id: number;
  marca: string;
  model: string;
  precio: number;

  combustible?: string;
  color?: string;
  consumo?: number;
  potencia?: number;
  cilindrada?: number;
  anoFabricacion?: number;
  descripcion?: string;
  ambiental?: string;
  km?: number;

  imagenes: CarImage[];

  tipoVenta?: "COCHE" | "PIEZAS" | null;

  // ⭐ NUEVO: CAMPOS DEL CARRUSEL
  destacado: boolean;
  carruselFotos: string[];  // <-- ESTE CAMPO ES EL QUE FALTABA
  carruselMode?: string;
}
