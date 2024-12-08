import { Optional } from "sequelize";

// Definir una interfaz para los atributos de HistoricoExpediente
export interface IHistoricosExpedientesAttributes {
    noDocumento: string;
    noExpediente: string;
    codigoBarras: string;
    descripcion: string;
    tipo: string;
    fecha: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IHistoricosExpedientesLastRecord{
    noExpediente: string;
    noDocumento: string | null;
    fecha: Date | null;
}

export interface IHistoricosExpedientesForRelations {
    codigoBarras: string;
    noDocumento:  string;
    noExpediente: string;
}


// Definir una interfaz para los atributos que son opcionales al crear un nuevo HistoricoExpediente
export interface IHistoricosExpedientesCreationAttributes extends Optional<IHistoricosExpedientesAttributes, 'createdAt' | 'updatedAt'> {}
