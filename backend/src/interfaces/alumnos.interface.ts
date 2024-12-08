import { Optional } from "sequelize";

export interface IAlumnosAttributes {
    matricula: number;
    nombres: string;
    apellidos: string;
    cuatrimestre: number;
    carrera: string;
    correo: string;
    telefono: number;
    estatus: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAlumnosCreationAttributes
    extends Optional<IAlumnosAttributes, 'estatus' | 'createdAt' | 'updatedAt'>{}

export interface IAlumnosUpdateAttributes
    extends Optional<IAlumnosAttributes, 'estatus' | 'createdAt' | 'updatedAt'>{}


