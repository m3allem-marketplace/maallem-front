import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ModalComponent } from '../../../../../libs/ui-kit/src/modal/modal.component';
import { ButtonComponent } from '../../../../../libs/ui-kit/src/button/button.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ButtonComponent
  ],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {

  @Input() isOpen = false;

  @Input() title = '';

  @Input() message = '';

  @Input() confirmLabel = 'Confirm';

  @Input() cancelLabel = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();

  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}