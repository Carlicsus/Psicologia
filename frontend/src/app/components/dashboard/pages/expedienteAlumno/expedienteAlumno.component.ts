import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { ExpedienteAlumno } from '../../../../core/interfaces/expedienteAlumno';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expediente-alumno',
  standalone: true,
  imports: [ MatPaginator, MatTableModule, CommonModule ],
  templateUrl: './expedienteAlumno.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExpedienteAlumnoComponent implements OnInit, AfterViewInit {

  // Datos simulados
  private listExpediente: ExpedienteAlumno[] = Array.from({ length: 50 }, (_, i) => ({
    noExpediente: i + 1,
    fechaCreacion: new Date(),
    historialSesion: {
      fechaSesion: new Date(),
      motivo: `Motivo ${i + 1}`,
      duracion: `${30 + i} minutos`,
      observaciones: `Observaciones del expediente ${i + 1}`
    }
  }));

  protected displayedColumns: string[] = [
    "noExpediente",
    "fechaCreacion",
    "fechaSesion",
    "motivo",
    "duracion",
    "observaciones"
  ];
  protected dataSource = new MatTableDataSource<ExpedienteAlumno>(this.listExpediente)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.dataSource.data = this.listExpediente;
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

}
