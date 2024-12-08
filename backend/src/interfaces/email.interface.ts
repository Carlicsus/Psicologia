

export interface IEmailRegistro {
    usuario: string;
    token: string;
}


// TODO: mover esta interfaz no va aqui :v
export interface InventorData {
    noExpediente: string;
    Inventores:   Inventore[];
}

export interface Inventore {
    nombreCompleto: string;
    correo:         string;
}
