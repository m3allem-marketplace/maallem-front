import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ModalComponent, ButtonComponent } from '@m3allem/ui-kit';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'تأكيد';
  @Input() cancelText = 'إلغاء';
  @Input() type: 'danger' | 'warning' | 'info' | 'success' = 'info';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
