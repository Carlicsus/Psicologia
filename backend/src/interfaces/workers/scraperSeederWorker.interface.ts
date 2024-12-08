import { IExpedientesError, IExpedientesOnlyNoExpediente, IExpedientesUpdateAttributes } from "../expedientes.interface";

// TODO: Agregar la I a todas las interfaces D:

export interface IScraperSeederResult {
    correctos: IScraperSeederCorrectos[];
    incorrectos: IExpedientesError[];
    horarios: {
        fechaHora_inicio: Date;
        fechaHora_fin: Date;
    };
}

export interface IScraperSeederJobData {
    expedientesPendientes: IExpedientesOnlyNoExpediente[];
    clientId?: string;
}

export interface IScraperSeederCorrectos {
    noExpediente: string;
    fechaPresentacion: Date;
    solicitantes: string[];
    inventores: string[];
    titulo: string;
    resumen: string;
}
