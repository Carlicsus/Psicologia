export interface Inventor {
  noExpediente: string;
  Inventores: Inventores[];
}

interface Inventores {
  idInventor: number;
  nombreCompleto: string;
  correo: string;
  direccion: string;
  CURP: string;
  telefono: string;
}

export interface InventorAttributes {
  idInventor: number;
  nombreCompleto: string;
  correo: string;
  direccion: string,
  CURP: string;
  telefono: string,
}

export interface UpdateInventor {
  correo: string,
  direccion: string,
  CURP: string,
  telefono: number
}