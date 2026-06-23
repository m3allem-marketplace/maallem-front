import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { ReviewService } from '../../../core/services/review.service';
import { BookingService } from '../../../core/services/booking.service';
import { Project } from '../../../core/models/project.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  loading = false;
  taskId = '';
  task: Project | null = null;
  proposals: any[] = [];
  currentUserRole: string | null = null;
  currentUserId: string | null = null;
  private userSub?: any;

  countdownText = '';
  private timerIntervalId: any;

  // Review state
  taskReview: any = null;

  // Booking state
  booking: any = null;
  bookingId: string | null = null;
  bookingStatus: string | null = null;
  isDirectBooking = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private userContext: UserContextService,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.userSub = this.userContext.currentUser$.subscribe(user => {
      this.currentUserRole = user?.role ?? null;
      this.currentUserId = user?._id ?? null;
    });

    this.route.params.subscribe(params => {
      this.taskId = params['id'];
      if (this.taskId) {
        this.loadTaskDetails();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }


  loadTaskDetails(): void {
    this.loading = true;
    this.projectService.getProjectById(this.taskId).subscribe({
      next: (res) => {
        this.task = res.data?.project || res.data || null;
        this.startExpiryTimer();
        this.loadProposals();
        this.loadBookingForProject();
        this.loading = false;
      },
      error: () => {
        this.loadMockTaskDetails();
        this.startExpiryTimer();
        this.loadMockProposals();
        this.loadBookingForProject();
        this.loading = false;
      }
    });
  }

  startExpiryTimer(): void {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
    
    if (this.task && this.task.status === 'direct_pending') {
      const expiryTime = this.task.directRequestExpiresAt 
        ? new Date(this.task.directRequestExpiresAt).getTime()
        : Date.now() + 2 * 60 * 60 * 1000; // Fallback to 2 hours if not provided
      
      const updateTimer = () => {
        const now = Date.now();
        const diff = expiryTime - now;
        
        if (diff <= 0) {
          this.countdownText = 'منتهي الصلاحية / Expired';
          clearInterval(this.timerIntervalId);
          // Auto fallback to open bidding pool status on UI
          if (this.task) {
            this.task.status = 'open';
          }
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          const pad = (num: number) => num < 10 ? '0' + num : num;
          this.countdownText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
      };
      
      updateTimer();
      this.timerIntervalId = setInterval(updateTimer, 1000);
    } else {
      this.countdownText = '';
    }
  }


  loadProposals(): void {
    if (this.currentUserRole === 'worker' || this.currentUserRole === 'company') {
      // Workers cannot view all proposals (returns 403), so we fetch their own proposals and filter by project
      this.proposalService.getMyProposals().subscribe({
        next: (res: any) => {
          const myBids = res.data?.proposals || res.data || [];
          this.proposals = myBids.filter((p: any) => 
            p.projectId === this.taskId || p.project?._id === this.taskId || p.project === this.taskId
          );
          this.loadReviewsIfCompleted();
        },
        error: () => {
          this.loadMockProposals();
          this.loadReviewsIfCompleted();
        }
      });
    } else {
      // Clients can view all proposals for their project
      this.proposalService.getProposalsForProject(this.taskId).subscribe({
        next: (res: any) => {
          this.proposals = res.data?.proposals || res.data || [];
          this.loadReviewsIfCompleted();
        },
        error: () => {
          this.loadMockProposals();
          this.loadReviewsIfCompleted();
        }
      });
    }
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
      'pending': 'قيد الانتظار',
      'confirmed': 'مؤكد',
      'in-progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'closed': 'مغلق',
      'direct_pending': 'حجز مباشر قيد الانتظار'
    };
    return map[status || ''] || status || '';
  }

  getStatusClass(status?: string): string {
    const map: Record<string, string> = {
      'open': 'bg-blue-50 text-blue-700 border-blue-200',
      'pending': 'bg-primary-50 text-primary-700 border-primary-200',
      'confirmed': 'bg-green-50 text-green-700 border-green-200',
      'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
      'completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200',
      'closed': 'bg-slate-50 text-slate-700 border-slate-200',
      'direct_pending': 'bg-purple-50 text-purple-700 border-purple-200'
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
    const clientId = this.task.client?._id || this.task.client;
    return clientId === this.currentUserId;
  }

  isAssignedWorker(): boolean {
    if (!this.task || !this.currentUserId) return false;
    
    // If a booking is loaded, and the logged-in user role is worker, then they are assigned
    if (this.bookingId && (this.currentUserRole === 'worker' || this.currentUserRole === 'company')) {
      return true;
    }

    // Check if any proposal for this project is accepted
    const acceptedProposal = this.proposals.find(p => p.status === 'accepted');
    if (acceptedProposal) {
      const workerId = acceptedProposal.worker?._id || acceptedProposal.workerId || acceptedProposal.worker;
      if (workerId === this.currentUserId) return true;
      
      // If a worker loaded their own proposals and one is accepted, they are the assigned worker
      if (this.currentUserRole === 'worker' || this.currentUserRole === 'company') return true;
    }
    // Fallback: check if the project has the worker property matching the logged-in worker ID
    const taskWorkerId = (this.task as any)?.worker?._id || (this.task as any)?.workerId || (this.task as any)?.worker;
    if (taskWorkerId) {
      const id = typeof taskWorkerId === 'object' ? taskWorkerId._id : taskWorkerId;
      return id === this.currentUserId;
    }
    return false;
  }

  get isDirectProject(): boolean {
    if (!this.task) return false;
    const taskWorkerId = (this.task as any).worker?._id || (this.task as any).workerId || (this.task as any).worker;
    return !!taskWorkerId || this.isDirectBooking;
  }

  get showDirectAcceptReject(): boolean {
    if (this.currentUserRole !== 'worker' && this.currentUserRole !== 'company') return false;
    if (this.task?.status === 'direct_pending') return true;
    if (this.isDirectBooking) {
      const isPendingBooking = ['pending_payment', 'pending', 'direct_pending'].includes(this.bookingStatus || '');
      const isPendingProject = ['open', 'direct_pending'].includes(this.task?.status || '');
      return isPendingBooking && isPendingProject;
    }
    return false;
  }

  loadReviewsIfCompleted(): void {
    if (!this.task) return;
    if (this.task.status === 'completed' || this.task.status === 'closed' || this.bookingStatus === 'completed') {
      let workerUserId = (this.task as any).worker?._id || (this.task as any).workerId || (this.task as any).worker;
      if (!workerUserId && this.proposals) {
        const accepted = this.proposals.find(p => p.status === 'accepted');
        workerUserId = accepted?.worker?._id || accepted?.workerId || accepted?.worker;
      }
      if (!workerUserId && (this.currentUserRole === 'worker' || this.currentUserRole === 'company')) {
        workerUserId = this.currentUserId;
      }
      const id = workerUserId?._id || workerUserId;
      if (id) {
        this.reviewService.getReviewsForWorker(id).subscribe({
          next: (reviews) => {
            this.taskReview = reviews.find(r => r.bookingId === this.taskId || r.bookingId === this.bookingId) || null;
          },
          error: () => {
            this.taskReview = null;
          }
        });
      }
    }
  }

  loadBookingForProject(): void {
    if (!this.taskId) return;
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        const list = res.data?.bookings || res.data || [];
        const found = list.find((b: any) => 
          b.project === this.taskId || (b.project && b.project._id === this.taskId)
        );
        if (found) {
          this.booking = found;
          this.bookingId = found._id;
          this.bookingStatus = found.status;
          this.isDirectBooking = !found.proposal && !found.proposalId;
          this.loadReviewsIfCompleted();
        } else {
          if (this.taskId.startsWith('task-') || this.taskId.startsWith('mock-')) {
            this.seedMockBookingForProject();
          } else {
            this.booking = null;
            this.bookingId = null;
            this.bookingStatus = null;
            this.isDirectBooking = false;
          }
        }
      },
      error: () => {
        if (this.taskId.startsWith('task-') || this.taskId.startsWith('mock-')) {
          this.seedMockBookingForProject();
        } else {
          this.booking = null;
          this.bookingId = null;
          this.bookingStatus = null;
          this.isDirectBooking = false;
        }
      }
    });
  }

  getTimelineStatus(): string {
    if (this.bookingStatus) {
      return this.bookingStatus;
    }
    // If there is an accepted proposal, but booking status is not loaded yet,
    // it means proposal is confirmed and is waiting for payment (first phase).
    const hasAcceptedProposal = this.proposals && this.proposals.some(p => p.status === 'accepted');
    if (hasAcceptedProposal) {
      return 'pending_payment';
    }
    return this.task?.status || 'pending';
  }

  seedMockBookingForProject(): void {
    const idNum = this.taskId.replace('task-', '');
    this.bookingId = `mock-booking-${idNum}`;
    
    // Determine status based on task status
    if (this.task) {
      if (this.task.status === 'completed' || this.task.status === 'closed') {
        this.bookingStatus = 'completed';
      } else if (this.task.status === 'in-progress') {
        this.bookingStatus = 'paid';
      } else {
        this.bookingStatus = 'pending_payment';
      }
    } else {
      this.bookingStatus = 'paid';
    }
    this.loadReviewsIfCompleted();
  }

  deliverTask(): void {
    if (!this.bookingId) return;
    this.bookingService.deliverBooking(this.bookingId).subscribe({
      next: () => {
        this.toast.success('تم تأكيد إنجاز العمل وتسليمه بنجاح! 🎉');
        this.bookingStatus = 'delivered';
      },
      error: () => {
        this.toast.error('فشل تأكيد تسليم العمل');
      }
    });
  }

  hasSubmittedProposal(): boolean {
    if (!this.currentUserId || !this.proposals) return false;
    
    // For workers, if they have any proposal loaded (since we filter by their ID), they submitted one
    if ((this.currentUserRole === 'worker' || this.currentUserRole === 'company') && this.proposals.length > 0) {
      return true;
    }

    return this.proposals.some(p => {
      const workerId = p.worker?._id || p.workerId || p.worker;
      return workerId === this.currentUserId;
    });
  }

  changeStatus(newStatus: 'open' | 'closed' | 'in-progress' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'direct_pending'): void {
    if (!this.task) return;
    this.projectService.updateProjectStatus(this.task._id, newStatus).subscribe({
      next: () => {
        if (this.task) {
          this.task.status = newStatus;
          this.toast.success('تم تحديث حالة المهمة بنجاح', 3000);
          this.startExpiryTimer();
          this.loadReviewsIfCompleted();
        }
      },
      error: () => {
        if (this.task) {
          this.task.status = newStatus;
          this.toast.success('تم تحديث حالة المهمة (وضع المحاكاة)', 3000);
          this.startExpiryTimer();
          this.loadReviewsIfCompleted();
        }
      }
    });
  }

  openChatWithWorker(workerId: any): void {

    const id = workerId?._id || workerId;
    if (!id) return;
    this.router.navigate(['/chat'], { queryParams: { workerId: id, projectId: this.taskId } });
  }

  openChatWithClient(): void {
    if (!this.task || !this.task.client?._id) return;
    this.router.navigate(['/chat'], { queryParams: { workerId: this.task.client._id, projectId: this.taskId } });
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
