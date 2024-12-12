import { Optional } from "sequelize";

export interface IExpedientesAtrributes {
    noExpediente: string;
    matricula: string;
    usuario: string;
    tipo: string;
    estatus: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IExpedienteNew{
    matricula: string;
    usuario: string;
    tipo: string;
}

export interface IExpedienteOnlyMatricula{
    matricula:string;
}

export interface IExpedientesCreationAttributes
    extends Optional<IExpedientesAtrributes, 'estatus' | 'createdAt' | 'updatedAt'>{}

export interface IExpedientesUpdateAttributes
    extends Optional<IExpedientesAtrributes, 'estatus' | 'createdAt' | 'updatedAt'>{}


