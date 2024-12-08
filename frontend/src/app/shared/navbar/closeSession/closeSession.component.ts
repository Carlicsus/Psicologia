import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { WebSocketServiceService } from "../../../core/services/web-socket-service.service";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-closeSession',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatButton],
  templateUrl: './closeSession.component.html',
})
export class CloseSessionComponent {

  public dialogRef = inject(MatDialogRef<CloseSessionComponent>);
  private router = inject(Router);
  private _wsService = inject(WebSocketServiceService);

  protected logOut(): void {
    localStorage.clear();
    sessionStorage.clear();
      
    this.router.navigate(['/login'])
    this._wsService.CloseSeccion();
  }

}
