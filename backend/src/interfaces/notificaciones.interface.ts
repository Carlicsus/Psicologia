import { Optional } from "sequelize";

// Definir una interfaz para los atributos de Ficha
export interface INotificacionesAttributes {
    idNotificacion: number;
    noExpediente: string;
    noDocumento: string;
    ejemplar: string;
    idGaceta: number;
    idSeccion: number;
    fechaCirculacion: Date;
    descripcionGeneralAsunto: string;
    fechaOficio: string | null;
    numeroOficio: number | null;
}

export interface INotificacionesLastRecord {
    noExpediente: string;
    numeroOficio: number | null;
    fechaCirculacion: Date | null;
}

//TODO: NO va aqui xd
export interface IExpedientesWithNotifications {
    noExpediente: string;
    Notificaciones: Notificacione[];
    TemporalesNotificaciones: Notificacione[];
}

export interface IExpedientesWithLastNotifications {
    noExpediente: string;
    Notificaciones: Notificacione | null;
    TemporalesNotificaciones: Notificacione | null;
}

//TODO: agregar la I
export interface Notificacione {
    idNotificacion?: number;
    noExpediente: string;
    noDocumento?: string;
    ejemplar: string;
    idGaceta: number;
    idSeccion: number;
    fechaCirculacion: Date;
    descripcionGeneralAsunto: string;
    fechaOficio: null | string;
    numeroOficio: number | null;
    createdAt: Date;
    updatedAt: Date;
    Gaceta: Gaceta;
    Seccione: Seccione;
    idTemporalNotificacion?: number;
}
//TODO: No van aqui xd
export interface Gaceta {
    nombreGaceta: string;
}

export interface Seccione {
    nombreSeccion: string;
}

export interface IExpedienteLastNotificaiones {
    noExpediente: string;
    Notificaciones: INotificacionesOnlyNoOficioCirculationDate[];
    TemporalesNotificaciones: INotificacionesOnlyNoOficioCirculationDate[];
}

export interface INotificacionesOnlyNoOficioCirculationDate {
    numeroOficio: number | null;
    fechaCirculacion: Date;
}

// Definir una interfaz para los atributos que son opcionales al crear un nuevo Ficha
export interface INotificacionesCreationAttributes extends Optional<INotificacionesAttributes, "idNotificacion"> { }