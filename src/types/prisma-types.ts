// AUTO-GENERATED FROM PRISMA SCHEMA

export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  movil: string;
  password: string;
  direcciones: Direccion[];
  compras: Compra[];
  rol: string;
  favoritos: Favorito[];
  refreshToken: string | null;
}

export interface Direccion {
  id: number;
  calle: string;
  numero: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  clienteId: number;
  cliente: User;
}

export interface Car {
  id: number;
  marca: string | null;
  model: string | null;
  consumo: number | null;
  km: number | null;
  combustible: string | null;
  anoFabricacion: number | null;
  cilindrada: number | null;
  puertas: number | null;
  plazas: number | null;
  itv: string | null;
  ambiental: "B" | "C" | "CERO" | "ECO" | null;
  precio: number;
  potencia: number | null;
  carroceria: string | null;
  cambio: "manual" | "automatico" | null;
  color: string | null;
  matricula: string | null;
  tipoVenta: "COCHE" | "PIEZAS" | null;
  defectos: Defecto[];
  imagenes: Imagen[];
  piezas: Pieza[];
  compras: Compra[];
  garantia: boolean | null;
  favoritos: Favorito[];
  mensajes: MensajeContacto[];
  descripcion: string | null;
}

export interface Defecto {
  id: number;
  descripcion: string;
  numero: number;
  carId: number;
  car: Car;
  fotos: FotoDefecto[];
}

export interface FotoDefecto {
  id: number;
  lugar: string;
  numero: number;
  defectoId: number;
  defecto: Defecto;
}

export interface Imagen {
  id: number;
  url: string;
  carId: number;
  car: Car;
}

export interface Pieza {
  id: number;
  descripcion: string;
  precio: number;
  carId: number;
  car: Car;
  fotos: FotoPieza[];
  compras: Compra[];
}

export interface FotoPieza {
  id: number;
  parteCoche: string;
  numero: number;
  piezaId: number;
  pieza: Pieza;
}

export interface Compra {
  id: number;
  clienteId: number;
  cliente: User;
  cocheId: number | null;
  coche: Car | null;
  piezaId: number | null;
  pieza: Pieza | null;
  fecha: string;
  cantidad: number;
  total: number;
}

export interface Favorito {
  id: number;
  userId: number;
  carId: number;
  user: User;
  car: Car;
  fecha: string;
}

export interface MensajeContacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  carId: number | null;
  car: Car | null;
  fecha: string;
}

export interface Carousel {
  id: number;
  url: string;
  public_id: string | null;
  createdAt: string;
}

