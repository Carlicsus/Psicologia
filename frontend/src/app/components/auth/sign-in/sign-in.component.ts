import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators, NonNullableFormBuilder  } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { customContrasenaValidator, repetirContrasenaValidator, validarEspaciosBlanco, validarEspaciosDobles, validarEspaciosEntreCaracter, validarNombreApellidos } from '../../../core/validators/customValidations';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BackendService } from '../../../core/services/backend.service';
import { ErrorService } from '../../../core/services/error.service';
import { User } from '../../../core/interfaces/user';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, ReactiveFormsModule, MatCardModule, MatInput, MatIcon, MatButton, MatFormFieldModule, CommonModule],
  templateUrl: './sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignInComponent implements OnInit {

  //Atributos

  private _formBuilder = inject(NonNullableFormBuilder);
  private _errorService = inject(ErrorService);
  private _backendService = inject(BackendService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  
  protected readonly value = new BehaviorSubject<string>('');
  protected hidePassword = new BehaviorSubject<boolean>(true);
  protected loading: boolean = false;
  protected disabled: boolean = true;
  protected hide = signal(true);
  protected formGroup = this._formBuilder.group({
    nombres: ['', [Validators.required, validarEspaciosBlanco, validarNombreApellidos, validarEspaciosEntreCaracter]],
    apellidos: ['', [Validators.required, validarEspaciosBlanco, validarNombreApellidos, validarEspaciosEntreCaracter]],
    email: ['', [Validators.required, Validators.email]],
    usuario: ['', [Validators.required, validarEspaciosBlanco, validarEspaciosDobles]],
    contrasena: ['', [Validators.required, customContrasenaValidator]],
    repetirContrasena: ['', [Validators.required, repetirContrasenaValidator]]
  });

  //Métodos

  public get nombresInput(): FormControl { return this.formGroup.controls.nombres as FormControl; }
  public get apellidosInput(): FormControl { return this.formGroup.controls.apellidos as FormControl; }
  public get usuarioInput(): FormControl { return this.formGroup.controls.usuario as FormControl; }
  public get emailInput(): FormControl { return this.formGroup.controls.email as FormControl; }
  public get contrasenaInput(): FormControl { return this.formGroup.controls.contrasena as FormControl; }
  public get repetirContrasenaInput(): FormControl { return this.formGroup.controls.repetirContrasena as FormControl; }
  
  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }

  protected togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.next(!this.hidePassword.value);
    event.stopPropagation();
  }
  
  public ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(status => {
      this.disabled = status !== 'VALID';
    });
  }

  protected addUser(): void {
    if(this.formGroup.valid){
      this.disabled = true;
      this.loading = true;

      const user: User = {
        nombres: this.nombresInput.value,
        apellidos: this.apellidosInput.value,
        usuario: this.usuarioInput.value,
        email: this.emailInput.value,
        contrasena: this.contrasenaInput.value,
        repetirContrasena: this.repetirContrasenaInput.value    
      }

      this._backendService.signIn(user).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(v.msg, "Usuario registrado", {
            toastClass: 'ngx-toastr my-toast-success',
            positionClass: 'toast-bottom-right'
          });
          this.router.navigate(['/login']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.disabled = false;
          this._errorService.msjError(e);
        }
      });
    }
  }
}
