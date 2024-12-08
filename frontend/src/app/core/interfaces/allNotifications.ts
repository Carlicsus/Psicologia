export interface AllNotifications {
  noExpediente: string;
  notificaciones: LastNotificaion[];
}

export interface LastNotificaion {
  idNotificacion?: number;
  idTemporalNotificacion?: number;
  noExpediente: string;
  noDocumento: string | null;
  ejemplar: string;
  gaceta: string;
  seccion: string;
  fechaCirculacion: Date;
  descripcionGeneralAsunto: string;
  fechaOficio: string | null;
  numeroOficio: number | null;
  createdAt: Date;
  updatedAt: Date;
}
