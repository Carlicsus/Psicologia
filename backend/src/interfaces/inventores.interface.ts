import { Optional } from "sequelize";

// Definir la interfaz para los atributos del modelo
export interface IInventoresAttributes {
    idInventor: number;
    nombreCompleto: string;
    correo: string;
    direccion: string,
    CURP: string;
    telefono: string,
    createdAt?: Date;
    updatedAt?: Date;
}


// Definir una interfaz para los atributos opcionales al crear una nueva instancia
export interface IInventoresCreationAttributes extends Optional<IInventoresAttributes, 'idInventor' | 'correo' | 'direccion' | 'CURP' | 'telefono'> {}
export interface IInventoresUpdateAttributes extends Optional<IInventoresAttributes, 'nombreCompleto' | 'createdAt' | 'updatedAt' | 'idInventor'> {}