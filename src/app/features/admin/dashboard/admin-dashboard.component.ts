import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loading = false;

  stats = {
    totalUsers:    0,
    totalWorkers:  0,
    totalBookings: 0,
    totalRevenue:  0,
    openDisputes:  0,
    activeJobs:    0,
  };

  recentActivity: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    // Attempt real API; fall back to mock
    this.api.get<any>('/admin/stats').subscribe({
      next: (res) => {
        const d = res.data || res;
        this.stats = { ...this.stats, ...d };
        this.loading = false;
      },
      error: () => {
        this.seedMock();
        this.loading = false;
      }
    });
  }

  private seedMock(): void {
    this.stats = {
      totalUsers:    1284,
      totalWorkers:   376,
      totalBookings: 3921,
      totalRevenue: 1_240_500,
      openDisputes:     14,
      activeJobs:      89,
    };

    this.recentActivity = [
      { icon: '👤', text: 'مستخدم جديد انضم: محمد أحمد',      time: 'منذ 5 دقائق',  type: 'user' },
      { icon: '📋', text: 'حجز جديد #BK-3921 تم تأكيده',       time: 'منذ 12 دقيقة', type: 'booking' },
      { icon: '⚠️', text: 'نزاع جديد على حجز #BK-3910',        time: 'منذ 25 دقيقة', type: 'dispute' },
      { icon: '🔧', text: 'معلم جديد سجّل: أحمد الكهربائي',     time: 'منذ 41 دقيقة', type: 'worker' },
      { icon: '✅', text: 'تم إغلاق نزاع #DSP-88 لصالح العميل', time: 'منذ ساعة',     type: 'resolved' },
    ];
  }

  formatCurrency(val: number): string {
    return val.toLocaleString('ar-EG') + ' ج.م';
  }
}
