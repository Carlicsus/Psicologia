export interface Patente {
    posicion: number,
    noExpediente: string;
    fechaPresentacion: Date | null,
    solicitantes: Array<JSON>,
    inventores: Array<JSON>,
    titulo: string | null,
    resumen: string,
    status: boolean
}

export interface Expediente {
    noExpediente: string
}