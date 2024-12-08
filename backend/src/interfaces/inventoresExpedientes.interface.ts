import { Optional } from "sequelize";

// Atributos requeridos para la creación del modelo (sin las claves primarias generadas automáticamente)
export interface IInventoresExpedientesAttributes {
    idInventorExpediente:number;
    idInventor: number;
    noExpediente: string;
}

// Atributos opcionales permitidos para la creación del modelo
export interface IInventoresExpedientesCreationAttributes extends Optional<IInventoresExpedientesAttributes, "idInventorExpediente"> {}