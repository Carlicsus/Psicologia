import { AfterViewInit, Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { RegisterDialogComponent } from './dialogs/register-dialog.component';
import { BackendService } from '../../../../core/services/backend.service';
import { SeeResumeFull } from './dialogs/seeFulResume.component';
import { Patente } from '../../../../core/interfaces/patente';
import { BlockService } from '../../../../core/services/block.service';
import { Alumno } from '../../../../core/interfaces/alumno';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SpinnerComponent, MatButton, MatTableModule, MatFormField, MatDialogModule, MatPaginatorModule, MatInput, MatIcon, MatLabel, RouterModule],
  templateUrl: './register.component.html'
})
export default class RegisterComponent implements OnInit, AfterViewInit {

  //Atributos
  private listExpedientes: Patente[] = [];
  private listAlumnos: Alumno[] = [
    {
      matricula: 220308,
      nombreCompleto: "Diego Hernandez Mota",
      cuatrimestre: 7,
      carrera: "IDGS",
      correo: "motacs0507@gail.com",
      telefono: 7641295468,
      estatus: true
    },
    {
      matricula: 220517,
      nombreCompleto: "Diego Hernandez Mota",
      cuatrimestre: 4,
      carrera: "IDGS",
      correo: "motacs0507@gail.com",
      telefono: 7641295468,
      estatus: true
    }
  ];

  protected loading: boolean = false;
  protected displayedColumns: string[] = [
    'matricula',
    'nombre',
    'apellidos',
    'carrera',
    'correo',
    'telefono',
    'estatus',
  ];
  protected dataSource = new MatTableDataSource<Alumno>(this.listAlumnos);
  protected readonly dialog = inject(MatDialog);
  protected buttonEnable: boolean = true;
  protected buttonNotificaciones: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private _backendService = inject(BackendService);
  private _blockService = inject(BlockService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  //Métodos

  public ngOnInit(): void {
    this.loading = true;
    this.getExpedientes();    
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  public reload(): void {
    this.loading = true;
    this.getExpedientes();
    this.changeDetector.detectChanges();
  }

  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected abrirVidoc(expediente: Patente): void {
    this.router.navigate(['/dashboard/vidoc', expediente]);    
  }

  protected openDialog(contenido: string): void {
    this.dialog.open(SeeResumeFull, {
      data: { contenido },
    });
  }

  protected abrirRegistrar(): void {
    this.dialog.open(RegisterDialogComponent, {
      width: '85%',
    })
  }


  private getExpedientes(): void {
    this._backendService.getExpedientes().subscribe((data) => {
      this.listExpedientes = [];

      this.dataSource.data = this.listAlumnos;
      this.loading = false;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

}
