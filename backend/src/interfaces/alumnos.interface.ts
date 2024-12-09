import { Optional } from "sequelize";

export interface IAlumnosAttributes {
    matricula: string;
    nombres: string;
    apellidos: string;
    cuatrimestre: string;
    grupo: string;
    carrera: string;
    correo: string;
    telefono: string;
    estatus: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAlumnosMatriculaOnly {
    matricula:string;
}

export interface IAlumnosCreationAttributes
    extends Optional<IAlumnosAttributes, 'estatus' | 'createdAt' | 'updatedAt'>{}

export interface IAlumnosUpdateAttributes
    extends Optional<IAlumnosAttributes, 'estatus' | 'createdAt' | 'updatedAt'>{}


