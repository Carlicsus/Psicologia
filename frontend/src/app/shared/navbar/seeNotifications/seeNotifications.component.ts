import { MatDialogModule } from '@angular/material/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../../core/services/notification.service';
import { Notificacion } from '../../../core/interfaces/notificacion';



@Component({
  selector: 'app-seeNotifications',
  standalone: true,
  imports: [MatDialogModule, MatButton, CommonModule, MatTabsModule, MatIcon, MatDivider],
  templateUrl: './seeNotifications.component.html'
})
export class SeeNotificationsComponent implements OnInit {

  //Atributos

  protected notifications: Notificacion[] = [];
  private _notificationService = inject(NotificationService);

  //Métodos

  public ngOnInit(): void {
    this._notificationService.notificaciones$.subscribe(notification => {
      this.notifications = notification;
    });
  }

  protected eliminarNotificacion(notification: Notificacion): void {
    this._notificationService.eliminarNotificacion(notification);
  }

  protected eliminarTodasNotificaciones(): void {
    this._notificationService.eliminarTodasNotificaciones();
  }

}
