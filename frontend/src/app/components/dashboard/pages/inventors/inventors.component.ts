import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { Component, inject, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { UpdateInventorComponent } from './updateInventor/updateInventor.component';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { BackendService } from '../../../../core/services/backend.service';
import { Inventor } from '../../../../core/interfaces/inventor';

@Component({
  selector: 'app-inventors',
  standalone: true,
  imports: [MatButton, MatExpansionModule, MatIcon, MatDatepicker, MatFormField, MatMenuModule, SpinnerComponent, MatCardModule, MatChipsModule],
  templateUrl: './inventors.component.html',
  
})
export default class InventorsComponent implements OnInit {

  private _backendService = inject(BackendService);
  public inventores: Inventor[] = [];
  public loading: boolean = true;
  public readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.getInventores();
  }

  private getInventores(): void {
    this._backendService.getInventores().subscribe((data) => {
      this.inventores = data;
      this.loading = false
    })
  }

  protected openDialog(idInventor: number): void {
    const dialogRef = this.dialog.open(UpdateInventorComponent, {
      height: '60%',
      width: '80%',
      data: idInventor
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getInventores();
    });
  }

}
