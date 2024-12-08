import { ChangeDetectionStrategy, Component, Inject, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'dialog-confirm',
    templateUrl: './dialogConfirm.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmComponent {
    @Output() confirm = new EventEmitter<void>();

    protected expedientes: { noExpediente: string }[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
        this.expedientes = data.expedientes;
    }

    protected onConfirm(): void {
        this.confirm.emit();
    }
}
