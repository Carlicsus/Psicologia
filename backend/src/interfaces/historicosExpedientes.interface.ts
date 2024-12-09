import { Optional } from "sequelize";

// Definir una interfaz para los atributos de HistoricoExpediente
export interface IHistoricosExpedientesAttributes {
    noDocumento: string;
    noExpediente: string;
    secion: number;
    resumen: string;
    actividad: string | null;
    fecha: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


// Definir una interfaz para los atributos que son opcionales al crear un nuevo HistoricoExpediente
export interface IHistoricosExpedientesCreationAttributes extends Optional<IHistoricosExpedientesAttributes, 'actividad' | 'createdAt' | 'updatedAt'> {}
