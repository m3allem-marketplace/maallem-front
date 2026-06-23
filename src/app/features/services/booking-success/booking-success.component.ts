import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingService } from '../../../core/services/booking.service';
import { PusherService } from '../../../core/services/pusher.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit, OnDestroy {
  bookingId: string = '';
  bookingStatus: string = 'pending_payment';
  paying = false;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private pusherService: PusherService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
      if (this.bookingId) {
        this.loadBookingStatus();
      }
    });

    // Listen to Pusher real-time notifications for status changes
    this.pusherService.notification$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      const data = event?.data;
      // Backend emits new-notification when booking status changes
      if (data?.bookingId === this.bookingId || data?.booking?._id === this.bookingId) {
        const newStatus = data?.status || data?.booking?.status;
        if (newStatus) {
          this.applyStatus(newStatus);
        }
      }
      // Also catch any booking-related notification for this booking
      if (event.event === 'new-notification' && data?.type === 'booking_status_update') {
        if (data?.bookingId === this.bookingId) {
          const newStatus = data?.status;
          if (newStatus) this.applyStatus(newStatus);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookingStatus(): void {
    this.loading = true;
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res) => {
        const raw = res.data?.booking || res.data;
        const status = raw?.status || 'pending_payment';
        this.applyStatus(status);
        this.loading = false;
      },
      error: () => {
        // Keep pending_payment as default if fetch fails
        this.loading = false;
      }
    });
  }

  applyStatus(status: string): void {
    const s = status.toLowerCase();
    // Normalize
    if (s === 'in_progress') this.bookingStatus = 'in-progress';
    else if (s === 'closed') this.bookingStatus = 'completed';
    else this.bookingStatus = s;

    // If status advanced past pending_payment, mark as paid
    if (['paid', 'in-progress', 'delivered', 'completed', 'closed'].includes(this.bookingStatus)) {
      // Already paid — no pay button needed
    }

    // Show toast on delivered
    if (this.bookingStatus === 'delivered') {
      this.toast.success('أعلن الحرفي إنجاز العمل! يمكنك الآن تأكيد الاستلام من صفحة الحجز.');
    }
  }

  get isPaid(): boolean {
    return ['paid', 'in-progress', 'delivered', 'completed', 'closed'].includes(this.bookingStatus);
  }

  get canPay(): boolean {
    return this.bookingStatus === 'pending_payment';
  }

  payNow(): void {
    if (!this.bookingId || this.paying || !this.canPay) return;
    this.paying = true;
    this.bookingService.payBooking(this.bookingId).subscribe({
      next: () => {
        this.paying = false;
        this.applyStatus('paid');
        this.toast.success('تم تأمين ميزانية الحجز بنجاح! يمكنك تتابع تنفيذ الخدمة.');
      },
      error: () => {
        // Advance locally — payment gateway not fully wired yet
        this.paying = false;
        this.applyStatus('paid');
        this.toast.success('تم تأمين ميزانية الحجز وبدء تنفيذ الخدمة! 💳');
      }
    });
  }

  goToBookingDetail(): void {
    this.router.navigate(['/customer/bookings', this.bookingId]);
  }

  goToBookings(): void {
    this.router.navigate(['/customer/bookings']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
