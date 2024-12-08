export interface NotificacionExpediente {
  noExpediente:     string;
  lastNotificaion?: LastNotificaion;
}

interface LastNotificaion {
  idNotificacion?: number;
  idTemporalNotificacion?:   number;
  noExpediente:             string;
  noDocumento:              string | null;
  ejemplar:                 string;
  gaceta:                   string;
  seccion:                  string;
  fechaCirculacion:         Date;
  descripcionGeneralAsunto: string;
  fechaOficio:              string | null;
  numeroOficio:             number | null;
  createdAt:                Date;
  updatedAt:                Date;
}
