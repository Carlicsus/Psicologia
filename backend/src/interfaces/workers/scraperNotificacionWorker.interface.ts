import { IExpedientesError } from "../expedientes.interface";
import { INotificacionesCreationAttributes, INotificacionesLastRecord } from "../notificaciones.interface";
import { IScrapersHorarios } from "./scrapersWorkers.interface";

export interface IScraperNotificacionResult{
    correctos: IScraperNotificacionCorrectos[],
    incorrectos: IExpedientesError[],
    horarios:IScrapersHorarios
}

// TODO: Revisar esta interfaz INotificacionesCreationAttributes
export interface IScraperNotificacionCorrectos{
    noExpediente:string,
    data: IScraperNotificacionData[],
    estatus?: boolean
}

export interface IScraperNotificacionJobData{
    ultimasNotificaciones : INotificacionesLastRecord[],
    clientId?: string
}

export interface IScraperNotificacionData{
    ejemplar: string;
    gaceta: string;
    seccion: string;
    fechaCirculacion: Date;
    descripcionGeneralAsunto: string;
    fechaOficio: string | null;
    numeroOficio: number | null;
}
