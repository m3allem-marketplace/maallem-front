import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OrderReceipt } from '../../../services/ecommerce.service';

@Component({
  selector: 'app-order-confirmation-modal',
  templateUrl: './order-confirmation-modal.component.html',
  styleUrls: ['./order-confirmation-modal.component.css'],
  standalone: false
})
export class OrderConfirmationModalComponent {
  @Input() orderReceipts: OrderReceipt[] = [];
  @Output() closed = new EventEmitter<void>();

  /** Computed grand total from all order responses */
  get grandTotal(): number {
    return this.orderReceipts.reduce((sum, r) => sum + (r.order?.totalPrice || 0), 0);
  }

  get firstOrder() {
    return this.orderReceipts.length ? this.orderReceipts[0].order : null;
  }

  /** Status of the first order (all orders share the same status) */
  get orderStatus(): string {
    const status = this.firstOrder?.status;
    if (status === 'confirmed') return 'مؤكد ✓';
    if (status === 'pending') return 'قيد المراجعة';
    return status || 'قيد المراجعة';
  }

  close(): void { this.closed.emit(); }
}