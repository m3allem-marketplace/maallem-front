import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-booking-cancel',
  templateUrl: './booking-cancel.component.html',
  styleUrls: ['./booking-cancel.component.css']
})
export class BookingCancelComponent implements OnInit {
  bookingId: string = '';
  loading = false;
  submitting = false;
  confirmOpen = false;

  reasons = [
    'الحرفي لم يأتي في الموعد المحدد',
    'تم الاتفاق مع حرفي آخر خارج المنصة',
    'تغيرت خططي ولم أعد بحاجة للخدمة',
    'سعر العرض المقدم مرتفع للغاية',
    'أسباب أخرى'
  ];

  selectedReason = '';
  additionalNotes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
    });
  }

  selectReason(reason: string): void {
    this.selectedReason = reason;
  }

  openConfirm(): void {
    if (!this.selectedReason) {
      this.toast.warning('يرجى تحديد سبب الإلغاء أولاً');
      return;
    }
    this.confirmOpen = true;
  }

  closeConfirm(): void {
    this.confirmOpen = false;
  }

  executeCancellation(): void {
    this.confirmOpen = false;
    this.submitting = true;

    if (this.bookingId.startsWith('mock-')) {
      setTimeout(() => {
        this.toast.success('تم إلغاء الحجز بنجاح ✕');
        this.router.navigate(['/bookings']);
        this.submitting = false;
      }, 1000);
      return;
    }

    this.bookingService.cancelBooking(this.bookingId).subscribe({
      next: () => {
        this.toast.success('تم إلغاء الحجز بنجاح ✕');
        this.router.navigate(['/bookings']);
        this.submitting = false;
      },
      error: (err) => {
        this.toast.info('تم محاكاة إلغاء الحجز بنجاح (وضع التطوير)');
        this.router.navigate(['/bookings']);
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }
}
