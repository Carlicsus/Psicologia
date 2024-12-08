import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackendService } from '../../../../../core/services/backend.service';
import { AllNotifications, LastNotificaion } from '../../../../../core/interfaces/allNotifications';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../../../core/services/error.service';

@Component({
  selector: 'app-notificationsExpediente',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatPaginator,
    MatFormFieldModule, MatInputModule, MatIconModule, RouterModule
  ],
  templateUrl: './notificationsExpediente.component.html',
})
export default class NotificationsExpedienteComponent implements OnInit {
  public loading: boolean = true;
  private route = inject(ActivatedRoute);
  private _backendService = inject(BackendService);
  private _errorServuce = inject(ErrorService);
  private router = inject(Router);
  protected notificacionExpediente?: AllNotifications;
  public displayedColumns: string[] = [
    'descripcionGeneral', 'ejemplar', 'fechaCirculacion', 'fechaOficio', 
    'gaceta', 'noDocumento', 'noExpediente', 'numeroOficio', 'seccion'
  ];
  dataSource = new MatTableDataSource<LastNotificaion>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ngOnInit(): void {
    let expediente = this.route.snapshot.paramMap.get('noExpediente') ?? '';
    this.getAllNotifications(expediente);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getAllNotifications(noExpediente: string): void {
    this._backendService.getAllNotificacionesByExpediente(noExpediente).subscribe(
      (data) => {
        this.notificacionExpediente = data;
        this.dataSource.data = this.notificacionExpediente?.notificaciones ?? []; 
        this.loading = false;
        console.log(data);
      },
      (error) => {
        this._errorServuce.msjError(error);
        // this.router.navigate(['/dashboard/notifications']);
      }
    );
  }
}
