import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    { value: 'plumbing', label: 'سباكة (Plumbing)' },
    { value: 'electricity', label: 'كهرباء (Electrical)' },
    { value: 'carpentry', label: 'نجارة (Carpentry)' },
    { value: 'painting', label: 'دهانات (Painting)' },
    { value: 'hvac', label: 'تكييف وتبريد (AC)' },
    { value: 'cleaning', label: 'تنظيف (Cleaning)' }
  ];

  constructor(
    private workerProfileService: WorkerProfileService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryParam = params['category'];
      if (categoryParam) {
        // Map Arabic URL params back to English if necessary, otherwise use as is
        const arabicToEnglishMap: Record<string, string> = {
          'سباكة': 'plumbing',
          'كهرباء': 'electricity',
          'نجارة': 'carpentry',
          'دهان': 'painting',
          'تكييف': 'hvac',
          'تنظيف': 'cleaning'
        };
        const paramLower = categoryParam.toLowerCase();
        this.selectedSpecialization = arabicToEnglishMap[paramLower] || paramLower;
      }

      const cityParam = params['city'];
      if (cityParam) {
        const found = this.cities.some(c => c.value === cityParam);
        if (!found) {
          this.cities = [...this.cities, { value: cityParam, label: cityParam }];
        }
        this.selectedCity = cityParam;
      }

      this.loadWorkers();
    });
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
        let list = res?.data?.profiles || [];
        
        // Ensure accurate filtering even if backend is not filtering properly
        if (this.selectedCity) {
          list = list.filter((p: any) => p.location?.city === this.selectedCity);
        }
        
        if (this.selectedSpecialization) {
          list = list.filter((p: any) => {
            if (!p.specializations || !Array.isArray(p.specializations)) return false;
            return p.specializations.some((s: string) => s.trim() === this.selectedSpecialization.trim());
          });
        }

        this.workers = list.map((p: any) => {
          const localImagesStr = localStorage.getItem(`worker_portfolio_images_${p._id}`) ||
                                 (p.user?._id ? localStorage.getItem(`worker_portfolio_images_${p.user._id}`) : null);
          let portfolioImages = p.portfolioImages || [];
          if (localImagesStr) {
            try {
              portfolioImages = JSON.parse(localImagesStr);
            } catch (e) {}
          }
          return {
            id: p._id,
            name: p.user?.name || 'حرفي معتمد',
            avatar: p.avatar || '',
            category: p.specializations?.[0] || 'حرفي عام',
            rating: 4.8, // default premium rating
            tier: portfolioImages.length > 3 ? 'gold' : 'silver', // dynamic tier based on details
            ratePerHour: 120 + Math.floor(Math.random() * 80) // mock rate per hour
          };
        });
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
