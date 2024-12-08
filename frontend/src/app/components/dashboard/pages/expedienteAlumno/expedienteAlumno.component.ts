import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { ExpedienteAlumno } from '../../../../core/interfaces/expedienteAlumno';

@Component({
  selector: 'app-expediente-alumno',
  standalone: true,
  imports: [
    MatTableDataSource,
    MatPaginator
  ],
  templateUrl: './expedienteAlumno.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExpedienteAlumnoComponent {

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

  // Configuración de la tabla y paginación
  public displayedColumns: string[] = ['noExpediente', 'fechaCreacion', 'motivo', 'duracion', 'observaciones'];
  public dataSource = new MatTableDataSource<ExpedienteAlumno>(this.listExpediente);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Inicializar el paginador
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
