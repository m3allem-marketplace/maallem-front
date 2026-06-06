import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-open-jobs',
  templateUrl: './open-jobs.component.html',
  styleUrls: ['./open-jobs.component.css']
})
export class OpenJobsComponent implements OnInit {
  loading = false;
  jobs: any[] = [];
  filteredJobs: any[] = [];

  // Filter state
  selectedCategory = '';
  selectedCity = '';

  categories = [
    { value: '',           label: 'كل التخصصات' },
    { value: 'plumbing',   label: 'سباكة' },
    { value: 'electricity',label: 'كهرباء' },
    { value: 'painting',   label: 'دهانات' },
    { value: 'carpentry',  label: 'نجارة' },
    { value: 'tiling',     label: 'سيراميك وبلاط' },
    { value: 'hvac',       label: 'تكييف وتبريد' },
    { value: 'cleaning',   label: 'تنظيف' },
    { value: 'welding',    label: 'حدادة ولحام' },
  ];

  cities = ['', 'القاهرة', 'الجيزة', 'الإسكندرية', 'أسيوط', 'طنطا', 'المنصورة'];

  constructor(
    public router: Router,
    private projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOpenJobs();
  }

  loadOpenJobs(): void {
    this.loading = true;
    this.projectService.getProjects({ status: 'open' }).subscribe({
      next: (res) => {
        const list = res.data?.projects || res.data || [];
        this.jobs = list;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.seedMockJobs();
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const catMatch = !this.selectedCategory || job.category === this.selectedCategory;
      const cityMatch = !this.selectedCity || job.location?.city === this.selectedCity;
      return catMatch && cityMatch;
    });
  }

  onCategoryChange(value: string): void {
    this.selectedCategory = value;
    this.applyFilters();
  }

  onCityChange(value: string): void {
    this.selectedCity = value;
    this.applyFilters();
  }

  submitBid(jobId: string): void {
    this.router.navigate(['/worker/open-jobs', jobId, 'bid']);
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      plumbing: '🔧', electricity: '⚡', painting: '🎨',
      carpentry: '🪚', tiling: '🧱', hvac: '❄️',
      cleaning: '🧹', moving: '📦', welding: '🔥'
    };
    return map[cat] || '🛠️';
  }

  getCategoryLabel(cat: string): string {
    const found = this.categories.find(c => c.value === cat);
    return found ? found.label : cat;
  }

  private seedMockJobs(): void {
    this.jobs = [
      {
        _id: 'job-1',
        title: 'تركيب سيراميك مطبخ (30 م²)',
        description: 'نحتاج تركيب سيراميك المطبخ الأرضي والجداري بالكامل مع توفير المواد اللازمة.',
        category: 'tiling',
        budget: 700,
        status: 'open',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        location: { address: 'مدينة نصر', city: 'القاهرة' },
        client: { name: 'أحمد الزبون', _id: 'client-1' }
      },
      {
        _id: 'job-2',
        title: 'صيانة وإصلاح تكييف مركزي',
        description: 'التكييف المركزي لا يعمل بشكل صحيح، يحتاج تنظيف وصيانة شاملة.',
        category: 'hvac',
        budget: 500,
        status: 'open',
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        location: { address: 'الدقي', city: 'الجيزة' },
        client: { name: 'سارة محمد', _id: 'client-2' }
      },
      {
        _id: 'job-3',
        title: 'تركيب غرفة نوم مودرن كاملة',
        description: 'غرفة نوم حجم كبير تشمل سرير وخزينة ودولاب. نوفر الأثاث جاهزاً.',
        category: 'carpentry',
        budget: 3500,
        status: 'open',
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        location: { address: 'سموحة', city: 'الإسكندرية' },
        client: { name: 'علي إبراهيم', _id: 'client-3' }
      },
      {
        _id: 'job-4',
        title: 'دهان شقة 3 غرف وصالة',
        description: 'دهان ثلاث غرف ومعيشة بالكامل بدهانات فينيل عالية الجودة مع تجهيز الأسطح.',
        category: 'painting',
        budget: 1800,
        status: 'open',
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        location: { address: 'المعادي', city: 'القاهرة' },
        client: { name: 'مريم عادل', _id: 'client-4' }
      },
      {
        _id: 'job-5',
        title: 'تصليح تسريب خط المياه الرئيسي',
        description: 'تسريب في خط المياه الرئيسي خلف الجدار بالحمام يحتاج إصلاح عاجل.',
        category: 'plumbing',
        budget: 350,
        status: 'open',
        createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
        location: { address: 'الزيتون', city: 'القاهرة' },
        client: { name: 'محمد يوسف', _id: 'client-5' }
      }
    ];
    this.applyFilters();
  }
}
