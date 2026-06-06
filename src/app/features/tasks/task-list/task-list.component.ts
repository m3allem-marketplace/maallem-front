import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  loading = false;
  tasks: Project[] = [];
  filteredTasks: Project[] = [];

  // Filter properties
  searchQuery = '';
  selectedCategory = '';
  selectedCity = '';

  categories = [
    { value: '', label: 'كل المجالات' },
    { value: 'plumbing', label: 'سباكة' },
    { value: 'electricity', label: 'كهرباء' },
    { value: 'painting', label: 'دهانات' },
    { value: 'carpentry', label: 'نجارة' },
    { value: 'tiling', label: 'سيراميك وبلاط' },
    { value: 'hvac', label: 'تكييف وتبريد' },
    { value: 'cleaning', label: 'تنظيف' },
    { value: 'welding', label: 'حدادة ولحام' }
  ];

  cities = ['', 'القاهرة', 'الجيزة', 'الإسكندرية', 'أسيوط', 'طنطا', 'المنصورة'];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (res) => {
        const list = res.data?.projects || res.data || [];
        this.tasks = list;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.seedMockTasks();
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchQuery || 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesCategory = !this.selectedCategory || task.category === this.selectedCategory;
      const matchesCity = !this.selectedCity || task.location?.city === this.selectedCity;
      return matchesSearch && matchesCategory && matchesCity;
    });
  }

  getTasksByStatus(status: 'open' | 'closed' | 'in-progress'): Project[] {
    return this.filteredTasks.filter(t => t.status === status);
  }

  getCategoryIcon(cat?: string): string {
    const map: Record<string, string> = {
      plumbing: '🔧', electricity: '⚡', painting: '🎨',
      carpentry: '🪚', tiling: '🧱', hvac: '❄️',
      cleaning: '🧹', moving: '📦', welding: '🔥'
    };
    return map[cat || ''] || '🛠️';
  }

  getCategoryLabel(cat?: string): string {
    const found = this.categories.find(c => c.value === cat);
    return found ? found.label : cat || '';
  }

  viewDetails(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  private seedMockTasks(): void {
    this.tasks = [
      {
        _id: 'task-1',
        title: 'تصليح تسريب خط المياه الرئيسي بالحمام',
        description: 'يوجد تسريب خلف الجدار بالحمام الرئيسي يتطلب تكسير جزئي وإصلاح خط التغذية الرئيسي.',
        category: 'plumbing',
        budget: 450,
        status: 'open',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        location: { address: 'الزيتون', city: 'القاهرة' },
        client: { name: 'محمد يوسف', email: 'mohammad@mail.com', role: 'user', _id: 'client-1' }
      },
      {
        _id: 'task-2',
        title: 'تركيب شاشة تلفاز وصيانة لوحة الكهرباء',
        description: 'تركيب شاشة 65 بوصة على حامل جداري متحرك، بالإضافة إلى مراجعة وتأمين مفاتيح الكهرباء الرئيسية بالمنزل.',
        category: 'electricity',
        budget: 300,
        status: 'in-progress',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 10000000).toISOString(),
        location: { address: 'الدقي', city: 'الجيزة' },
        client: { name: 'سارة محمد', email: 'sara@mail.com', role: 'user', _id: 'client-2' }
      },
      {
        _id: 'task-3',
        title: 'دهان وتجديد صالة استقبال كبيرة',
        description: 'دهان حوائط الصالة بالكامل مع تجهيز معجون وصنفرة ووضع طبقتين طلاء عالي الجودة بلون بيج هادئ.',
        category: 'painting',
        budget: 2200,
        status: 'open',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        location: { address: 'مدينة نصر', city: 'القاهرة' },
        client: { name: 'أحمد الزبون', email: 'ahmed@mail.com', role: 'user', _id: 'client-3' }
      },
      {
        _id: 'task-4',
        title: 'صيانة مكيف سبليت 2.25 حصان',
        description: 'المكيف يصدر صوتاً مرتفعاً والتبريد ضعيف، يحتاج إلى فحص شحن الفريون وتنظيف الفلاتر والوحدة الخارجية.',
        category: 'hvac',
        budget: 600,
        status: 'closed',
        createdAt: new Date(Date.now() - 600000000).toISOString(),
        updatedAt: new Date(Date.now() - 400000000).toISOString(),
        location: { address: 'سموحة', city: 'الإسكندرية' },
        client: { name: 'علي إبراهيم', email: 'ali@mail.com', role: 'user', _id: 'client-4' }
      },
      {
        _id: 'task-5',
        title: 'تفصيل خزانة ملابس خشبية (دولاب)',
        description: 'تفصيل دولاب خشب زان مقاس 2م * 2.2م مقسم من الداخل بأرفف وأدراج حسب التصميم المتفق عليه.',
        category: 'carpentry',
        budget: 4800,
        status: 'open',
        createdAt: new Date(Date.now() - 12000000).toISOString(),
        updatedAt: new Date(Date.now() - 12000000).toISOString(),
        location: { address: 'المنصورة', city: 'المنصورة' },
        client: { name: 'مريم عادل', email: 'meryem@mail.com', role: 'user', _id: 'client-5' }
      }
    ];
    this.applyFilters();
  }
}
