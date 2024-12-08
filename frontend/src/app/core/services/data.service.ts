import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private maxLogs: number = 256;
  private backendLogs = new BehaviorSubject<string[]>([]);
  private seedersLogs = new BehaviorSubject<string[]>([]);
  private historicoLogs = new BehaviorSubject<string[]>([]);
  private notificacionLogs = new BehaviorSubject<string[]>([]);

  public obtenerLogs(type: string) {
    switch(type) {
      case 'backend':
        return this.backendLogs.asObservable();
      case 'seeders':
        return this.seedersLogs.asObservable();
      case 'historico':
        return this.historicoLogs.asObservable();
      case 'notificacion':
        return this.notificacionLogs.asObservable();
      default:
        throw new Error('Tipo de log desconocido');
    }
  }

  public actualizarLogs(nuevoLog: string, type: string): void {
    let logsActuales: string[];
    switch(type) {
      case 'backend':
        logsActuales = [...this.backendLogs.getValue(), nuevoLog];
        if (logsActuales.length > this.maxLogs) {
          logsActuales.shift();
        }
        this.backendLogs.next(logsActuales);
        break;
      case 'seeders':
        logsActuales = [...this.seedersLogs.getValue(), nuevoLog];
        if (logsActuales.length > this.maxLogs) {
          logsActuales.shift();
        }
        this.seedersLogs.next(logsActuales);
        break;
      case 'historico':
        logsActuales = [...this.historicoLogs.getValue(), nuevoLog];
        if (logsActuales.length > this.maxLogs) {
          logsActuales.shift();
        }
        this.historicoLogs.next(logsActuales);
        break;
      case 'notificacion':
        logsActuales = [...this.notificacionLogs.getValue(), nuevoLog];
        if (logsActuales.length > this.maxLogs) {
          logsActuales.shift();
        }
        this.notificacionLogs.next(logsActuales);
        break;
      default:
        throw new Error('Tipo de log desconocido');
    }
  }


}
