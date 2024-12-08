import { Optional } from "sequelize";

// Definir interfaces para los atributos del modelo
export interface ISolicitantesExpedientesAttributes {
    solicitanteExpedienteID: number;
    idInstituto: number | null;
    idInventor: number | null;
    noExpediente: string;
}

// Definir una interfaz para los atributos opcionales al crear una nueva instancia
export interface ISolicitantesExpedientesCreationAttributes extends Optional<ISolicitantesExpedientesAttributes, "solicitanteExpedienteID"> {}
