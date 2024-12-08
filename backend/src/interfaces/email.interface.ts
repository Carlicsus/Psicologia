import { INotificacionesAttributes, INotificacionesCreationAttributes } from "./notificaciones.interface";
import { ITemporalesNotificacionesAttributes } from "./temporalesNotificaciones.interface";

export interface IEmailRegistro {
    usuario: string;
    token: string;
}

// TODO: Revisar esta interfaz 'INotificacionesCreationAttributes'
export interface IEmailNotificacion{
    inventoresData:InventorData,
    temporales:ITemporalesNotificacionesAttributes[],
    notificaciones:INotificacionesAttributes[]
}

// TODO: mover esta interfaz no va aqui :v
export interface InventorData {
    noExpediente: string;
    Inventores:   Inventore[];
}

export interface Inventore {
    nombreCompleto: string;
    correo:         string;
}
