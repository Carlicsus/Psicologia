import { Optional } from "sequelize";

export interface IExpedientesAtrributes {
    noExpediente: string;
    matricula: number;
    fecha: Date;
    tipo: string;
    estatus: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IExpedientesCreationAttributes
    extends Optional<IExpedientesAtrributes, 'estatus' | 'createdAt' | 'updatedAt'>{}

export interface IExpedientesUpdateAttributes
    extends Optional<IExpedientesAtrributes, 'estatus' | 'createdAt' | 'updatedAt'>{}


