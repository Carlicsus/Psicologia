export interface IScrapersHorarios{
    fechaHora_inicio: Date;
    fechaHora_fin: Date;
}

export interface IScrapersErrorData{ 
    code: number;
    error: string;
    scraperName: string;
}