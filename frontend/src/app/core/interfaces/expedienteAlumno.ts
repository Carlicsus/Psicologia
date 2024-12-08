export interface ExpedienteAlumno { 
  noExpediente: number;
  fechaCreacion: Date;
  historialSesion: Sesion;
}

interface Sesion {
  fechaSesion: Date;
  motivo: string;
  duracion: string;
  observaciones: string;
}
