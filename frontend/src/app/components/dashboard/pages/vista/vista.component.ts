import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepicker } from '@angular/material/datepicker';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { NotificacionExpediente } from '../../../../core/interfaces/notificacionExpediente';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { BackendService } from '../../../../core/services/backend.service';

@Component({
  selector: 'app-vista',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule, MatMenuModule, MatButton, MatIcon, MatDatepicker, SpinnerComponent, RouterOutlet, MatSidenavModule],
  templateUrl: './vista.component.html',
})
export default class VistaComponent implements OnInit {

  protected notifications(): boolean {
    return this.router.url === '/dashboard/notifications';
  }

  public loading: boolean = true;
  public showFiller: boolean = false;
  private _backendService = inject(BackendService);
  private router = inject(Router);
  protected allNotificaciones!: NotificacionExpediente[];
  protected filteredNotificaciones: NotificacionExpediente[] = [];

  public ngOnInit(): void {
    this.getNotificaciones();
  }

  private getNotificaciones(): void {
    this._backendService.getAllNotificaciones().subscribe((data) => {
      this.allNotificaciones = data;
      this.filtrarNotificaciones();
      this.loading = false;
    })
  }

  private filtrarNotificaciones(): void {
    this.filteredNotificaciones = this.allNotificaciones.filter(
      (notificacion) => notificacion.lastNotificaion
    );
  }

  public verNotificaciones(noExpediente: string): void {
    let expediente = noExpediente.replace(/\//g, '_');

    this.router.navigate(['/dashboard/notifications/allNotifications', expediente]);
  }

  

}
