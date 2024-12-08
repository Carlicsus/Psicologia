import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { SeeNotificationsComponent } from './seeNotifications/seeNotifications.component';
import { WebSocketServiceService } from '../../core/services/web-socket-service.service';
import { NotificationService } from '../../core/services/notification.service';
import { CloseSessionComponent } from './closeSession/closeSession.component';
import { Notificacion } from '../../core/interfaces/notificacion';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatBadgeModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {

  //Atributos

  protected notificaciones: Notificacion[] = [];
  protected confirm: boolean = true;
  protected menu: boolean = false;
  protected showBadge: boolean = true;
  protected readonly dialog = inject(MatDialog);

  private subscriptions: Subscription[] = [];
  private notificationService = inject(NotificationService);
  private _wsService = inject(WebSocketServiceService);

  //Métodos

  protected openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CloseSessionComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      position: { top: '70px', right: '20px' },
    });
  }

  protected openDialogTwo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SeeNotificationsComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      position: { top: '70px', right: '20px' },
    });
    this.notificationService.hideBadge();
  }

  public ngOnInit(): void {
    this._wsService.iniciarws();
    this.subscriptions.push(
      this.notificationService.notificaciones$.subscribe(notificaciones => {
        this.notificaciones = notificaciones;
      })
    );
    this.subscriptions.push(
      this.notificationService.showBadge$.subscribe(showBadge => {
        this.showBadge = showBadge;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected toggleMenu(): void {
    this.menu = !this.menu;
  }
}