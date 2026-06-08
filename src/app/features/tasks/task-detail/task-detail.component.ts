import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { Project } from '../../../core/models/project.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  loading = false;
  taskId = '';
  task: Project | null = null;
  proposals: any[] = [];
  currentUserRole: string | null = null;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.userContext.role;
    this.currentUserId = this.userContext.currentUser?._id ?? null;

    this.route.params.subscribe(params => {
      this.taskId = params['id'];
      if (this.taskId) {
        this.loadTaskDetails();
      }
    });
  }

  loadTaskDetails(): void {
    this.loading = true;
    this.projectService.getProjectById(this.taskId).subscribe({
      next: (res) => {
        this.task = res.data?.project || res.data || null;
        this.loadProposals();
        this.loading = false;
      },
      error: () => {
        this.loadMockTaskDetails();
        this.loadMockProposals();
        this.loading = false;
      }
    });
  }

  loadProposals(): void {
    this.proposalService.getProposalsForProject(this.taskId).subscribe({
      next: (res: any) => {
        this.proposals = res.data?.proposals || res.data || [];
      },
      error: () => {
        this.loadMockProposals();
      }
    });
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
    const categories = [
      { value: 'plumbing', label: 'سباكة' },
      { value: 'electricity', label: 'كهرباء' },
      { value: 'painting', label: 'دهانات' },
      { value: 'carpentry', label: 'نجارة' },
      { value: 'tiling', label: 'سيراميك وبلاط' },
      { value: 'hvac', label: 'تكييف وتبريد' },
      { value: 'cleaning', label: 'تنظيف' },
      { value: 'welding', label: 'حدادة ولحام' }
    ];
    const found = categories.find(c => c.value === cat);
    return found ? found.label : cat || '';
  }

  getStatusLabel(status?: string): string {
    const map: Record<string, string> = {
      'open': 'مفتوح للتقديم',
      'in-progress': 'قيد التنفيذ',
      'closed': 'مغلق / مكتمل'
    };
    return map[status || ''] || status || '';
  }

  getStatusClass(status?: string): string {
    const map: Record<string, string> = {
      'open': 'bg-blue-50 text-blue-700 border-blue-200',
      'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
      'closed': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return map[status || ''] || 'bg-slate-50 text-slate-700 border-slate-200';
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  placeBid(): void {
    if (this.currentUserRole === 'worker' || this.currentUserRole === 'company') {
      this.router.navigate(['/worker/open-jobs', this.taskId, 'bid']);
    } else {
      this.toast.error('يجب تسجيل الدخول كفني لتقديم عرض سعر', 3500);
    }
  }

  isClientOwner(): boolean {
    if (!this.task || !this.currentUserId) return false;
    return this.task.client?._id === this.currentUserId;
  }

  changeStatus(newStatus: 'open' | 'closed' | 'in-progress'): void {
    if (!this.task) return;
    this.projectService.updateProjectStatus(this.task._id, newStatus).subscribe({
      next: () => {
        if (this.task) {
          this.task.status = newStatus;
          this.toast.success('تم تحديث حالة المهمة بنجاح', 3000);
        }
      },
      error: () => {
        if (this.task) {
          this.task.status = newStatus;
          this.toast.success('تم تحديث حالة المهمة (وضع المحاكاة)', 3000);
        }
      }
    });
  }

  private loadMockTaskDetails(): void {
    const mockTasks: Record<string, Project> = {
      'task-1': {
        _id: 'task-1',
        title: 'تصليح تسريب خط المياه الرئيسي بالحمام',
        description: 'يوجد تسريب خلف الجدار بالحمام الرئيسي يتطلب تكسير جزئي وإصلاح خط التغذية الرئيسي مع إعادة تركيب السيراميك التالف.',
        category: 'plumbing',
        budget: 450,
        status: 'open',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        location: { address: 'الزيتون، بجوار محطة المترو', city: 'القاهرة' },
        client: { name: 'محمد يوسف', email: 'mohammad@mail.com', role: 'user', _id: 'client-1' }
      },
      'task-2': {
        _id: 'task-2',
        title: 'تركيب شاشة تلفاز وصيانة لوحة الكهرباء',
        description: 'تركيب شاشة 65 بوصة على حامل جداري متحرك، بالإضافة إلى مراجعة وتأمين مفاتيح الكهرباء الرئيسية بالمنزل لتجنب حدوث أي ماس كهربائي.',
        category: 'electricity',
        budget: 300,
        status: 'in-progress',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 10000000).toISOString(),
        location: { address: 'الدقي، شارع التحرير', city: 'الجيزة' },
        client: { name: 'سارة محمد', email: 'sara@mail.com', role: 'user', _id: 'client-2' }
      },
      'task-3': {
        _id: 'task-3',
        title: 'دهان وتجديد صالة استقبال كبيرة',
        description: 'دهان حوائط الصالة بالكامل مع تجهيز معجون وصنفرة ووضع طبقتين طلاء عالي الجودة بلون بيج هادئ.',
        category: 'painting',
        budget: 2200,
        status: 'open',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        location: { address: 'مدينة نصر، حي السفارات', city: 'القاهرة' },
        client: { name: 'أحمد الزبون', email: 'ahmed@mail.com', role: 'user', _id: 'client-3' }
      },
      'task-4': {
        _id: 'task-4',
        title: 'صيانة مكيف سبليت 2.25 حصان',
        description: 'المكيف يصدر صوتاً مرتفعاً والتبريد ضعيف، يحتاج إلى فحص شحن الفريون وتنظيف الفلاتر والوحدة الخارجية.',
        category: 'hvac',
        budget: 600,
        status: 'closed',
        createdAt: new Date(Date.now() - 600000000).toISOString(),
        updatedAt: new Date(Date.now() - 400000000).toISOString(),
        location: { address: 'سموحة، شارع فوزي معاذ', city: 'الإسكندرية' },
        client: { name: 'علي إبراهيم', email: 'ali@mail.com', role: 'user', _id: 'client-4' }
      },
      'task-5': {
        _id: 'task-5',
        title: 'تفصيل خزانة ملابس خشبية (دولاب)',
        description: 'تفصيل دولاب خشب زان مقاس 2م * 2.2م مقسم من الداخل بأرفف وأدراج حسب التصميم المتفق عليه.',
        category: 'carpentry',
        budget: 4800,
        status: 'open',
        createdAt: new Date(Date.now() - 12000000).toISOString(),
        updatedAt: new Date(Date.now() - 12000000).toISOString(),
        location: { address: 'المنصورة، المشاية السفلية', city: 'المنصورة' },
        client: { name: 'مريم عادل', email: 'meryem@mail.com', role: 'user', _id: 'client-5' }
      }
    };

    this.task = mockTasks[this.taskId] || mockTasks['task-1'];
  }

  private loadMockProposals(): void {
    this.proposals = [
      {
        _id: 'bid-1',
        projectId: this.taskId,
        worker: { name: 'محمود السباك', avatar: '', _id: 'worker-1' },
        price: 400,
        duration: 3, // hours
        durationUnit: 'hours',
        message: 'خبرة أكثر من ١٠ سنوات في صيانة السباكة المنزلية وتأسيس الحمامات. يمكنني البدء فوراً اليوم وتوفير قطع الغيار بضمان.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        _id: 'bid-2',
        projectId: this.taskId,
        worker: { name: 'أيمن حسن', avatar: '', _id: 'worker-2' },
        price: 450,
        duration: 2, // hours
        durationUnit: 'hours',
        message: 'أقوم بإصلاح كافة أنواع التسريبات بأجهزة كشف حديثة دون تكسير كبير. السعر يشمل الكشف والإصلاح مع ضمان شامل لمدة عام.',
        status: 'pending',
        createdAt: new Date(Date.now() - 900000).toISOString()
      }
    ];
  }
}
