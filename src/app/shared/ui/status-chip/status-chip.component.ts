import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.css']
})
export class StatusChipComponent {
  @Input() status: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get label(): string {
    if (!this.status) return '';
    const s = this.status.toLowerCase();
    switch (s) {
      case 'open':
        return 'مفتوح';
      case 'in-progress':
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'closed':
        return 'مغلق';
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
      case 'accepted':
        return 'مؤكد';
      case 'rejected':
        return 'مرفوض';
      case 'withdrawn':
        return 'مسحوب';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      case 'pending_payment':
        return 'بانتظار الدفع';
      case 'paid':
        return 'مدفوع (جاري)';
      case 'delivered':
        return 'تم التسليم';
      case 'disputed':
        return 'نزاع نشط';
      case 'refunded':
        return 'تم الاسترجاع';
      default:
        return this.status;
    }
  }

  get variantClass(): string {
    if (!this.status) return 'variant-neutral';
    const s = this.status.toLowerCase();
    switch (s) {
      case 'open':
        return 'variant-info';
      case 'in-progress':
      case 'in_progress':
      case 'paid':
        return 'variant-warning';
      case 'closed':
      case 'withdrawn':
        return 'variant-neutral';
      case 'pending':
      case 'pending_payment':
        return 'variant-primary';
      case 'confirmed':
      case 'accepted':
        return 'variant-primary-solid';
      case 'completed':
      case 'delivered':
        return 'variant-success';
      case 'rejected':
      case 'cancelled':
      case 'disputed':
      case 'refunded':
        return 'variant-danger';
      default:
        return 'variant-neutral';
    }
  }
}
