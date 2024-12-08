import { IExpedientesError } from "../expedientes.interface";
import { IHistoricosExpedientesCreationAttributes, IHistoricosExpedientesLastRecord } from "../historicosExpedientes.interface";
import { IScrapersHorarios } from "./scrapersWorkers.interface";

export interface IScraperHistoricoResult {
    correctos:   IScraperHistoricoCorrectos[];
    incorrectos: IExpedientesError[];
    horarios: IScrapersHorarios
}

export interface IScraperHistoricoCorrectos {
    noExpediente: string;
    data: IHistoricosExpedientesCreationAttributes[];
}

export interface IScraperHistoricoJobData {
    ultimosHistoricos: IHistoricosExpedientesLastRecord[];
    clientId?: string;
}





