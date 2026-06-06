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
    { key: 'pending', label: 'قيد الانتظار', desc: 'بانتظار موافقة الحرفي' },
    { key: 'confirmed', label: 'مؤكد', desc: 'تم تأكيد الحجز والاتفاق' },
    { key: 'in-progress', label: 'قيد التنفيذ', desc: 'العمل جاري الآن' },
    { key: 'completed', label: 'مكتمل', desc: 'تم إنهاء الخدمة بنجاح' }
  ];

  activeStepIndex = 0;
  isCancelled = false;

  ngOnChanges(): void {
    this.updateActiveStep();
  }

  private updateActiveStep(): void {
    const status = this.currentStatus ? this.currentStatus.toLowerCase() : 'pending';
    
    if (status === 'cancelled' || status === 'rejected') {
      this.isCancelled = true;
      this.activeStepIndex = 1; // Mark the error at the confirmation stage
      return;
    }

    this.isCancelled = false;

    switch (status) {
      case 'pending':
        this.activeStepIndex = 0;
        break;
      case 'confirmed':
      case 'accepted':
        this.activeStepIndex = 1;
        break;
      case 'in-progress':
      case 'in_progress':
        this.activeStepIndex = 2;
        break;
      case 'completed':
        this.activeStepIndex = 3;
        break;
      default:
        this.activeStepIndex = 0;
    }
  }
}
