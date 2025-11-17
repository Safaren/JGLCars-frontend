export interface Pieza {
  id: number;
  descripcion: string;
  precio: number;
  carId: number;
  car?: any;
  fotos?: any[];
}
