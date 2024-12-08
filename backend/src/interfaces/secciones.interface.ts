import { Optional } from "sequelize";

export interface ISeccionesAttributes {
    idSeccion: number;
    nombreSeccion: string;
}

export interface ISeccionesCreationAttributes extends Optional<ISeccionesAttributes, 'idSeccion'> {}
