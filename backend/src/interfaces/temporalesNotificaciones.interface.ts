import { Optional } from "sequelize";

// Definir una interfaz para los atributos de Ficha
export interface ITemporalesNotificacionesAttributes {
    idTemporalNotificacion: number;
    noExpediente: string;
    ejemplar: string;
    idGaceta: number;
    idSeccion: number;
    fechaCirculacion: Date;
    descripcionGeneralAsunto: string;
    fechaOficio: string | null;
    numeroOficio: number | null;
}

export interface ITemporalesNotificacionesLastRecord {
    noExpediente:     string;
    numeroOficio:     number | null;
    fechaCirculacion: Date | null;
}

// Definir una interfaz para los atributos que son opcionales al crear un nuevo Ficha
export interface ITemporalesNotificacionesCreationAttributes extends Optional<ITemporalesNotificacionesAttributes, 'idTemporalNotificacion'> {}