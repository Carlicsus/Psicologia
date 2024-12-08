import { Optional } from "sequelize";

// Definir una interfaz para los atributos de Instituto
export interface IInstitutosAttributes {
    idInstituto: number;
    razonSocial: string;
    RFC: string;
    correo: string;
    direccion:string;
    telefono:string;
}

// Definir una interfaz para los atributos que son opcionales al crear un nuevo Instituto
export interface IInstitutosCreationAttributes extends Optional<IInstitutosAttributes, "idInstituto" | 'RFC' | 'correo' | 'direccion' | 'telefono'> {}
