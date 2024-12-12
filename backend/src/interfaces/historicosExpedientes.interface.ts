import { Optional } from "sequelize";

// Definir una interfaz para los atributos de HistoricoExpediente
export interface IHistoricosExpedientesAttributes {
    noDocumento: string;
    noExpediente: string;
    secion: string;
    resumen: string;
    actividad: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IHistoricosExpedientesNew {
    noExpediente: string;
    secion: string;
    resumen:string;
    actividad:string | null;
}


// Definir una interfaz para los atributos que son opcionales al crear un nuevo HistoricoExpediente
export interface IHistoricosExpedientesCreationAttributes extends Optional<IHistoricosExpedientesAttributes, 'actividad' | 'createdAt' | 'updatedAt'> {}
