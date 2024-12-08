import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Inventor, InventorAttributes, UpdateInventor } from '../interfaces/inventor';
import { NotificacionExpediente } from '../interfaces/notificacionExpediente';
import { AllNotifications } from '../interfaces/allNotifications';
import { Expediente, Patente } from '../interfaces/patente';
import { Historico } from '../interfaces/historico';
import { API_URL } from '../constants/apiURL';
import { SignIn } from '../interfaces/signIn';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private http = inject(HttpClient);

  //User

  public signIn(user:User):Observable<any>{
    const url : string = `${API_URL}api/users/`;
    return this.http.post(url,user);
  }

  public login(sigIn:SignIn):Observable<string>{
    const url : string = `${API_URL}api/users/login`;
    return this.http.post<string>(url,sigIn);
  }

  //Histórico

  public getAllHistoricos(noExpediente: string): Observable<Historico[]>{
    const url: string = `${API_URL}api/historico/getHistorico/${noExpediente}`;
    
    return this.http.get<Historico[]>(url);
  }

  public downloadPDF(noExpediente: string, noDocumento: string) {
    const url: string = `${API_URL}api/historico/downloadPDF/${noExpediente}/${noDocumento}`;

    return this.http.get(url, { responseType: 'blob' });
  }

  public launchScraperHistorico(): Observable<any> {
    const url: string = `${API_URL}api/historico/launch`;

    return this.http.post(url, {});
  }

  //Expediente

  public insertExpediente(expedientes:Expediente[]):Observable<any> {
    const url: string = `${API_URL}api/expedientes/create`;
    
    return this.http.post<Expediente[]>(url,expedientes);
  }
  
  public getExpedientes(): Observable<Patente[]> {
    const url: string = `${API_URL}api/expedientes/getAll`;

    return this.http.get<Patente[]>(url);
  }

  public getInventores(): Observable<Inventor[]> {
    const url: string = `${API_URL}api/expedientes/getAllInventores`;

    return this.http.get<Inventor[]>(url);
  }

  //Inventores

  public getInventor(id: number): Observable<InventorAttributes> {
    const url: string = `${API_URL}api/inventores/getOne/${id}`;

    return this.http.get<InventorAttributes>(url);
  }

  public updateInventor(id: number, data: UpdateInventor): Observable<UpdateInventor>{
    const url: string = `${API_URL}api/inventores/updateOne/${id}`;

    return this.http.put<UpdateInventor>(url, data);
  }

  //Notificaciones

  public getAllNotificaciones(): Observable<NotificacionExpediente[]> {
    const url: string = `${API_URL}api/notificaciones/getAll`;

    return this.http.get<NotificacionExpediente[]>(url);
  }

  public getAllNotificacionesByExpediente(noExpediente: string): Observable<AllNotifications> {
    const url: string = `${API_URL}api/notificaciones/getNotificaciones/${noExpediente}`;

    return this.http.get<AllNotifications>(url);
  }

  public launchScraperNotificaciones(): Observable<any> {
    const url: string = `${API_URL}api/notificaciones/launch`;

    return this.http.post(url, {});
  }

}
