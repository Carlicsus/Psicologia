import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //Atrivutos

  private notificacionesSubject = new BehaviorSubject<Notificacion[]>(this.cargarNotificaciones());
  public notificaciones$ = this.notificacionesSubject.asObservable();

  private showBadgeSubject = new BehaviorSubject<boolean>(this.cargarEstadoBurbuja());
  public showBadge$ = this.showBadgeSubject.asObservable();

  //Métodos

  public agregarNotificacion(notificacion: Notificacion): void {
    const notificacionesActuales = this.notificacionesSubject.value;
    const notificacionesActualizadas = [...notificacionesActuales, notificacion];
    this.notificacionesSubject.next(notificacionesActualizadas);
    this.guardarNotificaciones(notificacionesActualizadas);
    this.showBadge();
  }

  public eliminarNotificacion(notificacion: Notificacion): void {
    const notificacionesActuales = this.notificacionesSubject.value;
    const notificacionesActualizadas = notificacionesActuales.filter(n => n !== notificacion);
    this.notificacionesSubject.next(notificacionesActualizadas);
    this.guardarNotificaciones(notificacionesActualizadas);
  }

  public eliminarTodasNotificaciones(): void {
    this.notificacionesSubject.next([]);
    this.guardarNotificaciones([]);
  }

  private guardarNotificaciones(notificaciones: Notificacion[]): void {
    sessionStorage.setItem('notificaciones', JSON.stringify(notificaciones));
  }

  private cargarNotificaciones(): Notificacion[] {
    const notificaciones = sessionStorage.getItem('notificaciones');
    return notificaciones ? JSON.parse(notificaciones) : [];
  }

  public hideBadge(): void {
    this.showBadgeSubject.next(false);
    this.guardarEstadoBurbuja(false);
  }

  public showBadge(): void {
    this.showBadgeSubject.next(true);
    this.guardarEstadoBurbuja(true);
  }

  private guardarEstadoBurbuja(estado: boolean): void {
    sessionStorage.setItem('showBadge', JSON.stringify(estado));
  }

  private cargarEstadoBurbuja(): boolean {
    const estado = sessionStorage.getItem('showBadge');
    return estado ? JSON.parse(estado) : true;
  }
}
