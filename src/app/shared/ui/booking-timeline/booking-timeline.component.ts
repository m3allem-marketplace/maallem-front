import { Component, Input, OnChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-timeline.component.html',
  styleUrls: ['./booking-timeline.component.css']
})
export class BookingTimelineComponent implements OnChanges {
  @Input() currentStatus: string = 'pending';

  steps = [
    { key: 'pending_payment', label: 'إيداع بالمحفظة', desc: 'تأمين الميزانية في محفظة الضمان' },
    { key: 'paid', label: 'جاري التنفيذ', desc: 'العمل قيد الإنجاز وتأمين المستحقات' },
    { key: 'delivered', label: 'تم الإنجاز', desc: 'الحرفي أعلن إنهاء الخدمة' },
    { key: 'completed', label: 'تحرير المستحقات', desc: 'تحويل المبلغ للحرفي وتقييم الخدمة' }
  ];

  activeStepIndex = 0;
  isCancelled = false;

  ngOnChanges(): void {
    this.updateActiveStep();
  }

  private updateActiveStep(): void {
    const status = this.currentStatus ? this.currentStatus.toLowerCase() : 'pending';
    
    if (status === 'cancelled' || status === 'rejected' || status === 'refunded') {
      this.isCancelled = true;
      this.activeStepIndex = 1; // Mark the error at the confirmation stage
      return;
    }

    this.isCancelled = false;

    switch (status) {
      case 'pending_payment':
      case 'pending':
      case 'direct_pending':
      case 'direct-pending':
        this.activeStepIndex = 0;
        break;
      case 'paid':
      case 'confirmed':
      case 'accepted':
      case 'in-progress':
      case 'in_progress':
        this.activeStepIndex = 1;
        break;
      case 'delivered':
        this.activeStepIndex = 2;
        break;
      case 'completed':
      case 'closed':
        this.activeStepIndex = 3;
        break;
      default:
        this.activeStepIndex = 0;
    }
  }
}
