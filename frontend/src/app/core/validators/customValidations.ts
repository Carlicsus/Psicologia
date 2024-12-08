import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

//Validación para ingresar mínimo un número, una Mayúscula y 8 caracteres
export const customContrasenaValidator = (control: AbstractControl): ValidationErrors | null => {
    const regex = new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    const value = control.value;

    return !regex.test(value) ? {customContrasenaValidator: true} : null;
};

//Validación para comparar contraseñas iguales
export const repetirContrasenaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) return null;
  
    const contrasena = formGroup.get('contrasena');
    const repetirContrasena = control;
  
    return contrasena && repetirContrasena && contrasena.value !== repetirContrasena.value ? { repetirContrasenaValidator: true } : null;
};

// Validación para comparar contraseñas iguales
export const compareContrasenas: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const contrasena = control.get('contrasena');
    const repetirContrasena = control.get('repetirContrasena');
  
    return contrasena && repetirContrasena && contrasena.value !== repetirContrasena.value ? { 'compareContrasenas': true } : null;
};

//Validación para comprobar que no haya más de un espacio en nombres
export const validarEspaciosBlanco: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim() !== control.value;

    return isWhitespace ? { validarEspaciosBlanco: true } : null;
};
  
//Validación para comprobar que no existan espacios dobles y caracteres especiales para usuarios
export const validarEspaciosDobles: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const valid = /^(?!.*\s{2})[\w.-\s{1}]+$/.test(control.value);

    return !valid ? { validarEspaciosDobles: true } : null;
};

export const validarNombreApellidos: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(control.value);

    return !valid ? { validarNombreApellidos: true } : null;
};

//Validación de espacios dobles entre apellidos y nombres
export const validarEspaciosEntreCaracter: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const valid = /^(?!.*\s{2,}).*$/.test(control.value);

    return !valid ? { validarEspaciosEntreCaracter: true } : null;
}

//Validación de CURPS 
export const validarCURP: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const regex = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(control.value);

    return !regex ? { validarCURP: true } : null;
}

// Validación para número de teléfono (10 dígitos)
export const validarTelefono: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\d{10}$/.test(control.value);
    return !regex ? { validarTelefono: true } : null;
  };
  
  // Validación para cuatrimestre (del 1 al 11)
export const validarCuatrimestre: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const valor = Number(control.value);
    const esValido = !isNaN(valor) && valor >= 1 && valor <= 11;
    return !esValido ? { validarCuatrimestre: true } : null;
  };
  
  // Validación para matrícula (máximo 6 dígitos)
  export const validarMatricula: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const regex = /^\d{6}$/.test(control.value);
    return !regex ? { validarMatricula: true } : null;
  };