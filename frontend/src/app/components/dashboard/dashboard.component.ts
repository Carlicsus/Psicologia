import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, MatCardModule, MatButton, CommonModule, MatDividerModule, MatIconModule, RouterModule,],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent {

  protected usuario = sessionStorage.getItem('usuario');
  private router = inject(Router);

  protected dashboard(): boolean {
    return this.router.url === '/dashboard';
  }

}
