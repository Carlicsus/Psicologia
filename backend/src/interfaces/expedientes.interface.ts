import { Optional } from "sequelize";

// TODO: Agregar la I
export interface xd {
    noExpediente:      string;
    fechaPresentacion: Date;
    titulo:            string;
    resumen:           string;
    status:            boolean;
    Institutos:        Instituto[];
    Inventores:        Inventore[];
}
// TODO: Meter esto a las interfaces de intituto
export interface Instituto {
    razonSocial: string;
}

// TODO: Meter esto a las interfaces de inventores
export interface Inventore {
    nombreCompleto: string;
}


export interface IExpedientesOnlyNoExpediente {
    noExpediente: string;
}

export interface IExpedientesError{
    noExpediente:string;
    msg:string;
    error?:string;
}

export interface IExpedientesAtrributes {
    noExpediente: string;
    fechaPresentacion: Date | null;
    titulo: string | null;
    resumen: string | null;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IExpedientesCreationAttributes
    extends Optional<IExpedientesAtrributes, 'status' | 'fechaPresentacion' | 'titulo' | 'resumen' | 'createdAt' | 'updatedAt'>{}

export interface IExpedientesUpdateAttributes
    extends Optional<IExpedientesAtrributes, 'status' | 'createdAt' | 'updatedAt'>{}


