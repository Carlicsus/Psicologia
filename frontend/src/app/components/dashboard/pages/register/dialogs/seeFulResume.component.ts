import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    selector: 'app-see-resume-full',
    templateUrl: './seeFullResume.component.html',
})
export class SeeResumeFull {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    protected contenido: string = this.data.contenido;

}