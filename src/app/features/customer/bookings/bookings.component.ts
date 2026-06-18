import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  loading = false;
  bookings: any[] = [];
  activeTab: 'active' | 'completed' | 'cancelled' = 'active';

  constructor(
    private bookingService: BookingService,
    public router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        const list = res.data?.bookings || res.data?.projects || (Array.isArray(res.data) ? res.data : []) || [];
        this.bookings = list.map((b: any) => {
          if (b.project && typeof b.project === 'object') {
            return {
              ...b,
              title: b.title || b.project.title,
              description: b.description || b.project.description,
              category: b.category || b.project.category,
              location: b.location || b.project.location,
              budget: b.budget || b.price || b.project.budget,
              worker: b.worker || b.provider
            };
          } else {
            return {
              ...b,
              budget: b.budget || b.price,
              worker: b.worker || b.provider
            };
          }
        });
        this.loading = false;
      },
      error: (err) => {
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  get filteredBookings(): any[] {
    if (this.activeTab === 'active') {
      return this.bookings.filter(
        b => ['open', 'pending', 'confirmed', 'in-progress', 'direct_pending', 'pending_payment', 'paid', 'delivered', 'disputed'].includes(b.status)
      );
    } else if (this.activeTab === 'completed') {
      return this.bookings.filter(
        b => ['completed', 'closed'].includes(b.status)
      );
    } else {
      return this.bookings.filter(
        b => ['cancelled', 'rejected', 'refunded'].includes(b.status)
      );
    }
  }

  setActiveTab(tab: 'active' | 'completed' | 'cancelled'): void {
    this.activeTab = tab;
  }

  onBookingClick(booking: any): void {
    this.router.navigate(['/customer/bookings', booking._id]);
  }

  getActiveBookingsCount(): number {
    return this.bookings.filter(
      b => ['open', 'pending', 'confirmed', 'in-progress', 'direct_pending', 'pending_payment', 'paid', 'delivered', 'disputed'].includes(b.status)
    ).length;
  }


  getCompletedBookingsCount(): number {
    return this.bookings.filter(
      b => ['completed', 'closed'].includes(b.status)
    ).length;
  }

  getCancelledBookingsCount(): number {
    return this.bookings.filter(
      b => ['cancelled', 'rejected', 'refunded'].includes(b.status)
    ).length;
  }

  private seedMockData(): void {
    this.bookings = [
      {
        _id: 'mock-booking-1',
        title: 'تصليح خطوط السباكة للحمام',
        category: 'plumbing',
        budget: 450,
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        worker: { name: 'محمود السباك' }
      },
      {
        _id: 'mock-booking-2',
        title: 'تثبيت نجف ومفاتيح كهربائية صالة الاستقبال',
        category: 'electricity',
        budget: 300,
        status: 'closed',
        createdAt: new Date().toISOString(),
        worker: { name: 'أحمد الكهربائي' }
      },
      {
        _id: 'mock-booking-3',
        title: 'دهان غرفة نوم أطفال بالكامل',
        category: 'painting',
        budget: 1200,
        status: 'closed',
        createdAt: new Date().toISOString(),
        worker: { name: 'مصطفى النقاش' }
      },
      {
        _id: 'mock-booking-4',
        title: 'تركيب سيراميك أرضية المطبخ',
        category: 'carpentry',
        budget: 950,
        status: 'cancelled',
        createdAt: new Date().toISOString(),
        worker: { name: 'حسن البلاط' }
      }
    ];
  }
}
