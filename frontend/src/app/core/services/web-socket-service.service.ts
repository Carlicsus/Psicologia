import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notification.service';
import { Notificacion } from '../interfaces/notificacion';
import { BlockService } from './block.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  //Atributos

  private ws!: WebSocket;
  private clientId!: string;
  private notificationService = inject(NotificationService);
  private _blockService = inject(BlockService);
  private _dataService = inject(DataService);
  private toastr = inject(ToastrService);

  //Métodos

  private connect(): void {
    const token: any = localStorage.getItem('token');
    this.clientId = sessionStorage.getItem('wsClient') || ''; // Intentar reutilizar el clientId guardado
  
    const wsUrl = this.clientId ? `/websocket?clientId=${this.clientId}` : '/websocket';
  
    this.ws = new WebSocket(wsUrl, token);
  
    this.ws.onopen = () => {
      // Conexión abierta
    };
  
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
  
      // Mensaje recibido
      
      if (message.type === 'log') {
        const logs = message.content.split('\n');
        logs.forEach((log: string) => {
          if (log.includes('[Backend]')) {
            this._dataService.actualizarLogs(log, 'backend');
          } else if (log.includes('scrapper') && log.includes('[Seeders]')) {
            this._dataService.actualizarLogs(log, 'seeders');
          } else if (log.includes('scrapper') && log.includes('[Historico]')) {
            this._dataService.actualizarLogs(log, 'historico');
          } else if (log.includes('scrapper') && log.includes('[Notificacion]')) {
            this._dataService.actualizarLogs(log, 'notificacion');
          } 
        });
        return;
      }
  
      if (message.clientId) {
        this.clientId = message.clientId;
        sessionStorage.setItem('wsClient', this.clientId);
        return;
      }
  
      if (message.ping) {
        // Ping recibido, pong enviado
        this.ws.send(JSON.stringify({ pong: true }));
        return;
      }
  
      if (typeof message.buttonEnable !== 'undefined') {
        this._blockService.bloquearButtonSeeder(message.buttonEnable);
      }
    
      if (typeof message.buttonEnableHistorico !== 'undefined') {        
        this._blockService.bloquearButtonHistorico(message.buttonEnableHistorico);
      }

      if (typeof message.buttonEnableNotificacion !== 'undefined') {        
        this._blockService.bloquearButtonNotificaciones(message.buttonEnableNotificacion);
      }
      
      const otherFields = ['tipo', 'msg'].some(key => key in message);
  
      if (otherFields) {
        if (message.tipo === 'info') {
          this.toastr.info(message.msg, 'Scrapper', {
            toastClass: 'ngx-toastr my-toast-info',
            positionClass: 'toast-bottom-right',
          });
        }
      
        if (message.tipo === 'error') {
          this.toastr.error(message.msg, 'Scrapper', {
            toastClass: 'ngx-toastr my-toast',
            positionClass: 'toast-bottom-right',
          });
        }
      
        if (message.tipo === 'exito') {
          this.toastr.success(message.msg, 'Scrapper', {
            toastClass: 'ngx-toastr my-toast-success',
            positionClass: 'toast-bottom-right',
          });
        }
      
        const notification: Notificacion = { message: message.msg, tipo: message.tipo, timestamp: new Date() };
        this.notificationService.agregarNotificacion(notification);
      }
    };
  
    this.ws.onclose = () => {
      // Handle WebSocket close event
      // Conexión con webSocket cerrada
    };
  }
  

  private sendMessage(msg: any): void {
    // Verifica si la conexión WebSocket está abierta antes de enviar el mensaje
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this.toastr.error('La conexión con webSocket no está abierta', 'Scrappersito', {
        toastClass: 'ngx-toastr my-toast',
        positionClass: 'toast-bottom-right'
      });
    }
  }

  protected getClientId(): string {
    return this.clientId;
  }

  public CloseSeccion(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  public iniciarws(): void {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
      this.connect();
    }
  }
}
