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
        return 'variant-warning';
      case 'closed':
        return 'variant-neutral';
      case 'pending':
        return 'variant-primary';
      case 'confirmed':
      case 'accepted':
        return 'variant-primary-solid';
      case 'completed':
        return 'variant-success';
      case 'rejected':
      case 'cancelled':
        return 'variant-danger';
      case 'withdrawn':
        return 'variant-neutral';
      default:
        return 'variant-neutral';
    }
  }
}
