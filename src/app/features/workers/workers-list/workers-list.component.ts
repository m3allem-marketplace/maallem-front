import { Component, OnInit } from '@angular/core';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { WorkerSummary } from '../../../shared/models/worker-summary.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.css']
})
export class WorkersListComponent implements OnInit {
  workers: WorkerSummary[] = [];
  loading = false;

  // Filters
  selectedCity = '';
  selectedSpecialization = '';

  cities = [
    { value: '', label: 'جميع المحافظات' },
    { value: 'القاهرة', label: 'القاهرة' },
    { value: 'الجيزة', label: 'الجيزة' },
    { value: 'الإسكندرية', label: 'الإسكندرية' }
  ];

  specializations = [
    { value: '', label: 'جميع التخصصات' },
    { value: 'سباكة', label: 'سباكة (Plumbing)' },
    { value: 'كهرباء', label: 'كهرباء (Electrical)' },
    { value: 'نجارة', label: 'نجارة (Carpentry)' },
    { value: 'دهان', label: 'دهانات (Painting)' },
    { value: 'تكييف', label: 'تكييف وتبريد (AC)' },
    { value: 'تنظيف', label: 'تنظيف (Cleaning)' }
  ];

  constructor(
    private workerProfileService: WorkerProfileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.loading = true;
    const filters: { city?: string; specialization?: string } = {};
    if (this.selectedCity) {
      filters.city = this.selectedCity;
    }
    if (this.selectedSpecialization) {
      filters.specialization = this.selectedSpecialization;
    }

    this.workerProfileService.getWorkerProfiles(filters).subscribe({
      next: (res) => {
        const list = res?.data?.profiles || [];
        this.workers = list.map((p: any) => ({
          id: p._id,
          name: p.user?.name || 'حرفي معتمد',
          avatar: p.avatar || '',
          category: p.specializations?.[0] || 'حرفي عام',
          rating: 4.8, // default premium rating
          tier: p.portfolioImages?.length > 3 ? 'gold' : 'silver', // dynamic tier based on details
          ratePerHour: 120 + Math.floor(Math.random() * 80) // mock rate per hour
        }));
        this.loading = false;
      },
      error: (err) => {
        this.toast.error('عذراً، فشل تحميل قائمة الحرفيين.');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadWorkers();
  }
}
