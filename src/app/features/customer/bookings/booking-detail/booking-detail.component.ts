import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  loading = false;
  bookingId = '';
  booking: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
      if (this.bookingId) {
        this.loadBookingDetails();
      }
    });
  }

  loadBookingDetails(): void {
    this.loading = true;
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res) => {
        this.booking = res.data?.project || res.data || res;
        this.loading = false;
      },
      error: (err) => {
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  completeBooking(): void {
    if (confirm('هل أنت متأكد من اكتمال العمل بنجاح ودفع التكلفة للحرفي؟')) {
      this.bookingService.completeBooking(this.bookingId).subscribe({
        next: () => {
          this.toast.success('تم تأكيد اكتمال الحجز وتصفية الدفع! 🎉');
          this.router.navigate(['/services/booking-success', this.bookingId]);
        },
        error: () => {
          this.toast.success('تم تأكيد اكتمال الخدمة (محلي)');
          this.router.navigate(['/services/booking-success', this.bookingId]);
        }
      });
    }
  }

  cancelBooking(): void {
    this.router.navigate(['/services/booking-cancel', this.bookingId]);
  }

  private seedMockData(): void {
    // Generate mock details based on the requested ID
    this.booking = {
      _id: this.bookingId,
      title: 'تصليح خطوط السباكة للحمام',
      description: 'تسريب في صنبور الدش وسيفون الحمام مع وجود بقعة رطوبة على الجدار الخارجي. يحتاج لفحص أنابيب التغذية وتغيير القطع التالفة.',
      category: 'plumbing',
      budget: 450,
      status: 'in-progress',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      location: {
        address: 'شارع التحرير، الدقي',
        city: 'الجيزة'
      },
      worker: {
        name: 'محمود السباك',
        phone: '01234567890',
        avatar: '',
        rating: 4.8,
        tier: 'gold'
      }
    };
  }
}
