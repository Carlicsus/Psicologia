import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registerInputs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registerInputs.component.html',
})
export class RegisterInputsComponent {
  @Input() noExpediente: string = '';
  
  @Output() noExpedienteChange = new EventEmitter<string>();

  protected onNoExpedienteChange(value: string): void {
    this.noExpedienteChange.emit(value);
  }

}
