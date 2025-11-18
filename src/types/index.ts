// Imagen del coche
export interface CarImage {
  id: number;
  url: string;
  carId?: number;
}

// Datos de un coche
export interface Car {
  id: number;
  marca: string;
  model: string;
  precio: number;
  combustible?: string | null;
  anoFabricacion?: number | null;
  cilindrada?: number | null;
  potencia?: number | null;
  color: string;
  matricula?: string | null;
  tipoVenta?: string | null;

  imagenes?: CarImage[];
}

// Datos para crear o actualizar un coche (sin id)
export interface CarInput {
  marca: string;
  model: string;
  precio: number;
  combustible?: string;
  anoFabricacion?: number;
  color?: string;
}

// Slide del carrusel
export interface CarouselSlide {
  id: number;
  url: string;
}
