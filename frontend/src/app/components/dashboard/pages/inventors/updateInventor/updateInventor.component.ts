import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

import { validarCURP, validarEspaciosBlanco, validarEspaciosDobles, validarEspaciosEntreCaracter } from '../../../../../core/validators/customValidations';
import { InventorAttributes, UpdateInventor } from '../../../../../core/interfaces/inventor';
import { BackendService } from '../../../../../core/services/backend.service';

@Component({
  selector: 'app-updateInventor',
  standalone: true,
  imports: [MatDialogModule, MatButton, ReactiveFormsModule, MatInput, MatButton, MatFormFieldModule, MatIcon],
  templateUrl: './updateInventor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInventorComponent implements OnInit {

  //Atributos
  public inventor: InventorAttributes | null = null;

  private _formBuilder = inject(NonNullableFormBuilder);
  private _backendService = inject(BackendService);
  private toastr = inject(ToastrService);

  protected disabled: boolean = true;
  protected id: number = this.data;
  protected formGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', [Validators.required, validarEspaciosBlanco, validarEspaciosDobles, validarEspaciosEntreCaracter]],
    curp: ['', [Validators.required, validarCURP, validarEspaciosBlanco, validarEspaciosEntreCaracter]],
    telefono: ['', [Validators.required, Validators.minLength(10)]]
  })

  //Métodos
  constructor(@Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {
    this.getOneInventor(this.id);
    this.formGroup.statusChanges.subscribe(status => {
      this.disabled = status !== 'VALID';
    });
  }

  public get emailInput(): FormControl { return this.formGroup.controls.email as FormControl; }
  public get direccionInput(): FormControl { return this.formGroup.controls.direccion as FormControl; }
  public get curpInput(): FormControl { return this.formGroup.controls.curp as FormControl; }
  public get telefonolInput(): FormControl { return this.formGroup.controls.telefono as FormControl; }

  private getOneInventor(id: number): void{
    this._backendService.getInventor(id).subscribe((data) => {
      this.inventor = data;
      this.formGroup.patchValue({
        email: this.inventor.correo,
        direccion: this.inventor.direccion,
        curp: this.inventor.CURP,
      });
    });
  }

  protected actualizarInventor(): void {
    if(this.formGroup.valid){
      const inventorsitos: UpdateInventor = {
        correo: this.emailInput.value,
        direccion: this.direccionInput.value,
        CURP: this.curpInput.value,
        telefono: parseInt(this.telefonolInput.value)
      }

      this._backendService.updateInventor(this.id, inventorsitos).subscribe({
        next: (response) => {
          this.toastr.success(`Inventor no ${this.id} actualizado correctamente.`, 'Éxito', {
            toastClass: 'ngx-toastr my-toast-success',
            positionClass: 'toast-bottom-right'
          });
        },
        error: (error) => {
          this.toastr.error('Inventor no encontrado.', 'Error', {
            toastClass: 'ngx-toastr my-toast',
            positionClass: 'toast-bottom-right'
          });
        }
      });
    }
  }

}