import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { saveAs } from 'file-saver';

import { NotificationService } from '../../../../core/services/notification.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { BackendService } from '../../../../core/services/backend.service';
import { Notificacion } from '../../../../core/interfaces/notificacion';
import { ErrorService } from '../../../../core/services/error.service';
import { Historico } from '../../../../core/interfaces/historico';

@Component({
  selector: 'app-vidoc',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, SpinnerComponent, MatPaginator, MatFormField, MatInput, MatLabel, MatIcon, RouterModule],
  templateUrl: './vidoc.component.html',
})
export default class VidocComponent implements OnInit, AfterViewInit {

  //Atributos

  private _notificationService = inject(NotificationService);
  private _backendService = inject(BackendService);
  private _errorService = inject(ErrorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private historico: Historico[] = [];

  protected expediente: string = '';
  protected loading: boolean = false;
  protected numeroExp: string = '';
  displayedColumns: string[] = [
    'no',
    'codigoBarras',
    'documento',
    'descripcion',
    'tipo',
    'fecha',
    'verDocumento'
  ];
  dataSource = new MatTableDataSource<Historico>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Métodos

  public ngOnInit(): void {
    this.loading = true;

    let expediente = this.route.snapshot.paramMap.get('noExpediente') ?? '';

    this.numeroExp = expediente.replace(/\//g, '_');
    this.expediente = expediente;

    if (this.numeroExp != '') {
      this.getHistoricos(this.numeroExp);
    } else {
      console.error('No se encontró el parámetro noExpediente en la ruta');
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private getHistoricos(noExpediente: string): void {
    this._backendService.getAllHistoricos(noExpediente).subscribe(
      (data) => {
        this.historico = data.map((item, index) => ({
          ...item,
          no: index + 1
        }));
        this.dataSource.data = this.historico;
        this.loading = false;
      },
      (error) => {
        this._errorService.msjError(error.msg);
        this.router.navigate(['/dashboard/register']);
      }
    );
  }

  protected descargarPDF(noDocumento: string): void {
    let documento = noDocumento.replace(/\//g, '_');
    this.numeroExp;
    const notificacionExito: Notificacion = {
      tipo: 'exito',
      message: `Se descargó el PDF ${documento}`,
      timestamp: new Date()
    };
    const notificacionError: Notificacion = {
      tipo: 'exito',
      message: `Se descargó el PDF ${documento}`,
      timestamp: new Date()
    };

    this._backendService.downloadPDF(this.numeroExp, documento).subscribe((data) => {
      this.handleDownload(data, documento);
      this._notificationService.agregarNotificacion(notificacionExito);
    },
      (error) => {
        this._errorService.msjError(error);
        this._notificationService.agregarNotificacion(notificacionError);
    })
  }

  private handleDownload(blob: Blob, documento: string) {
    const filename = `${documento}.pdf`;
    saveAs(blob, filename);
  }

}
