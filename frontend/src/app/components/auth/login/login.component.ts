import { FormControl, ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BackendService } from '../../../core/services/backend.service';
import { ErrorService } from '../../../core/services/error.service';
import { SignIn } from '../../../core/interfaces/signIn';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, ReactiveFormsModule, MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatFormFieldModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {

  //Atributos

  private _formBuilder = inject(NonNullableFormBuilder);
  private _notifications = inject(NotificationService);
  private _backendService = inject(BackendService);
  private _errorService = inject(ErrorService);
  private router = inject(Router);

  protected disabled: boolean = true;
  protected loading: boolean = false;
  protected readonly value = new BehaviorSubject<string>('');
  protected hidePassword = new BehaviorSubject<boolean>(true);
  
  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }
  
  protected formGroup = this._formBuilder.group({
    usuarioEmail: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  //Métodos

  get usuarioEmailInput(): FormControl { return this.formGroup.controls.usuarioEmail as FormControl; }
  get contrasenaInput(): FormControl { return this.formGroup.controls.contrasena as FormControl; }

  protected togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.next(!this.hidePassword.value);
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(status => {
      this.disabled = status !== 'VALID';
    });
  }

  protected login(): void {

    if (this.formGroup.valid) {

      const signIn: SignIn = {
        usuarioEmail: this.usuarioEmailInput.value,
        contrasena: this.contrasenaInput.value,
      };

      this.loading = true;
      this.disabled = true;

      this._backendService.login(signIn).subscribe({
        next: (token) => {
          localStorage.setItem('token', token);
          sessionStorage.setItem('usuario', this.usuarioEmailInput.value);
          this.loading = false;
          this.disabled = false;
          this._notifications.hideBadge();
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loading = false;
          this.disabled = false;
          this.usuarioEmailInput.reset();
          this.contrasenaInput.reset();
        }
      });
    }
  }
}
