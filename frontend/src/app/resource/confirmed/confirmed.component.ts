import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmed',
  standalone: true,
  imports: [RouterLink],
  template: `
  <main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-indigo-600">200</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Cuenta confirmada</h1>
    <div class="mt-6">
      <img src="../../../assets/img/status200.jpg" alt="StatusOK" class="mx-auto h-96 w-auto">
    </div>
    <p class="mt-6 text-base leading-7 text-gray-600">La cuenta ha sido verificada. Ahora tiene acceso a la página.</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a [routerLink]="['/login']" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ir a login</a>
    </div>
  </div>
</main>
  `
})
export default class ConfirmedComponent {
}
