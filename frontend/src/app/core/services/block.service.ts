import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private buttonEnableSubject: BehaviorSubject<boolean>;   //Scraper seeder
  private buttonHistoricoSubject: BehaviorSubject<boolean>;  //Scraper Histórico
  private buttonNotificacionSubject: BehaviorSubject<boolean>;  //Scraper Notificaciones

  constructor() {
    //Scraper seeder
    const buttonEnableValue = sessionStorage.getItem('buttonEnable');
    const initialValue = buttonEnableValue !== null ? JSON.parse(buttonEnableValue) : true;
    this.buttonEnableSubject = new BehaviorSubject<boolean>(initialValue);

    //Scraper Histórico
    const buttonHistoricoValue = sessionStorage.getItem('buttonHistorico');
    const initialHistoricoValue = buttonHistoricoValue !== null ? JSON.parse(buttonHistoricoValue) : true;
    this.buttonHistoricoSubject = new BehaviorSubject<boolean>(initialHistoricoValue);

    //Scarper Notificaciones
    const buttonNotificationValue = sessionStorage.getItem('buttonNotificaciones');
    const initialNotificaionsValue = buttonNotificationValue !== null ? JSON.parse(buttonNotificationValue) : true;
    this.buttonNotificacionSubject = new BehaviorSubject<boolean>(initialNotificaionsValue);
  }

  //Scraper seeder
  public bloquearButtonSeeder(value: boolean): void {
    const currentValue = this.buttonEnableSubject.value;
    if (currentValue !== value) {
      this.buttonEnableSubject.next(value);
      sessionStorage.setItem('buttonEnable', JSON.stringify(value));
    }
  }

  public getEstadoButtonSeeder(): Observable<boolean> {
    return this.buttonEnableSubject.asObservable();
  }

  //Scraper Histórico
  public bloquearButtonHistorico(value: boolean): void {
    const currentValue = this.buttonHistoricoSubject.value;
    if (currentValue !== value) {
      this.buttonHistoricoSubject.next(value);
      sessionStorage.setItem('buttonHistorico', JSON.stringify(value));
    }
  }

  public getEstadoButtonHistorico(): Observable<boolean> {
    return this.buttonHistoricoSubject.asObservable();
  }

  //Scarper Notificaciones
  public bloquearButtonNotificaciones(value: boolean): void {
    const currentValue = this.buttonNotificacionSubject.value;
    if (currentValue !== value) {
      this.buttonNotificacionSubject.next(value);
      sessionStorage.setItem('buttonNotificaciones', JSON.stringify(value));
    }
  }

  public getEstadoButtonNotificaciones(): Observable<boolean> {
    return this.buttonNotificacionSubject.asObservable();
  }

}
