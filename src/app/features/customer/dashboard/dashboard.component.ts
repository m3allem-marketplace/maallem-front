import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '@m3allem/ui-kit';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  loading = false;
  bookings: any[] = [];
  bidRequests: Project[] = [];

  // Computed stats
  totalSpend = 0;
  activeBookingsCount = 0;
  totalJobsCount = 0;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Fetch client bookings
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
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        // Fallback to mock data for local testing/development
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.totalJobsCount = this.bookings.length;
    this.activeBookingsCount = this.bookings.filter(
      b => b.status === 'in-progress' || b.status === 'confirmed' || b.status === 'open'
    ).length;
    
    // Calculate total spend from completed/closed projects
    this.totalSpend = this.bookings
      .filter(b => b.status === 'closed' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.budget || 0), 0);
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
      }
    ];

    this.calculateStats();
  }

  viewBookingDetails(id: string): void {
    this.router.navigate(['/customer/bookings', id]);
  }

  viewOffers(projectId: string): void {
    this.router.navigate(['/customer/bid-requests', projectId, 'offers']);
  }

  postNewJob(): void {
    this.router.navigate(['/customer/bid-requests/post']);
  }
}
