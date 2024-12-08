export interface Notificacion {
    tipo: 'exito' | 'error' | 'info';
    message: string;
    timestamp: Date; 
}
