import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';

import { DataService } from '../../../../core/services/data.service';



@Component({
  selector: 'app-logsScraper',
  standalone: true,
  imports: [MatDivider, MatButtonToggleModule, FormsModule, ReactiveFormsModule, MatButton, MatIcon, MatBadge],
  templateUrl: './logsScraper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogsScraperComponent implements OnInit {
  //Atributos
  public fontStyleControl = new FormControl('');
  public selectedVal!: string;
  
  protected backendLogs: string[] = [];
  protected seedersLogs: string[] = [];
  protected historicoLogs: string[] = [];
  protected notificacionLogs: string[] = [];
  protected datitos: string[] = [];

  private _dataService = inject(DataService);
  private _cdRef = inject(ChangeDetectorRef);

  //Métodos
  public ngOnInit(): void {
    this.onValChange('backend');
    this.subscribeToLogs();
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    this.updateDatitos(val);
  }

  private subscribeToLogs() {
    this._dataService.obtenerLogs('backend').subscribe((logs: string[]) => {
      this.backendLogs = logs;
      if (this.selectedVal === 'backend') {
        this.datitos = [...this.backendLogs];
        this._cdRef.detectChanges();
        this.scrollDiv();
      }
    });

    this._dataService.obtenerLogs('seeders').subscribe((logs: string[]) => {
      this.seedersLogs = logs;
      if (this.selectedVal === 'seeders') {
        this.datitos = [...this.seedersLogs];
        this._cdRef.detectChanges();
        this.scrollDiv();
      }
    });

    this._dataService.obtenerLogs('historico').subscribe((logs: string[]) => {
      this.historicoLogs = logs;
      if (this.selectedVal === 'historico') {
        this.datitos = [...this.historicoLogs];
        this._cdRef.detectChanges();
        this.scrollDiv();
      }
    });

    this._dataService.obtenerLogs('notificacion').subscribe((logs: string[]) => {
      this.notificacionLogs = logs;
      if (this.selectedVal === 'notificacion') {
        this.datitos = [...this.notificacionLogs];
        this._cdRef.detectChanges();
        this.scrollDiv();
      }
    });
  }

  private updateDatitos(typeLog: string): void {
    switch (typeLog) {
      case 'backend':
        this.datitos = [...this.backendLogs];
        break;
      case 'seeders':
        this.datitos = [...this.seedersLogs];
        break;
      case 'historico':
        this.datitos = [...this.historicoLogs];
        break;
      case 'notificacion':
        this.datitos = [...this.notificacionLogs];
        break;
      default:
        throw new Error('Unknown log type');
    }
    this._cdRef.detectChanges();
    this.scrollDivBottom();
  }

  public scrollDiv(): void {
    let div = document.getElementById('logsGenerales');
    if (div) {
      try {
        div.scrollTo({
          top: div.scrollTop + 60,
          behavior: 'smooth'
        });
      } catch (error) {
      }
    }
  }

  public scrollDivBottom(): void {
    let div = document.getElementById('logsGenerales');
    if (div) {
      try {
        div.scrollTo({
          top: div.scrollHeight,
          behavior: 'smooth'
        });
      } catch (error) {
      }
    }
  }

}
