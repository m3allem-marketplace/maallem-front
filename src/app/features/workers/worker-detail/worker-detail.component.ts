import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { WorkerProfile } from '../../../core/models/user.model';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-worker-detail',
  templateUrl: './worker-detail.component.html',
  styleUrls: ['./worker-detail.component.css']
})
export class WorkerDetailComponent implements OnInit {
  workerId = '';
  worker: WorkerProfile | null = null;
  loading = false;
  submitting = false;

  // Booking Modal State
  showBookingModal = false;
  bookingTitle = '';
  bookingDescription = '';
  bookingBudget = 150;
  bookingAddress = '';
  bookingCity = 'القاهرة';

  cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'المنوفية', 'الغربية'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workerProfileService: WorkerProfileService,
    private projectService: ProjectService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.workerId = params.get('id') || '';
      if (this.workerId) {
        this.loadProfile();
      }
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.workerProfileService.getWorkerProfileById(this.workerId).subscribe({
      next: (res) => {
        this.worker = res?.data?.profile || res?.data || null;
        if (this.worker && this.worker.location?.city) {
          this.bookingCity = this.worker.location.city;
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('فشل في تحميل تفاصيل ملف الحرفي.');
        this.loading = false;
      }
    });
  }

  get isClient(): boolean {
    return this.userContext.role === 'user';
  }

  get isLoggedIn(): boolean {
    return this.userContext.isLoggedIn;
  }

  openBookingModal(): void {
    if (!this.isLoggedIn) {
      this.toast.info('يرجى تسجيل الدخول أولاً كعميل لتتمكن من حجز موعد.');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.isClient) {
      this.toast.error('يجب تسجيل الدخول بحساب عميل لطلب خدمات صيانة.');
      return;
    }
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  submitDirectBooking(): void {
    if (!this.bookingTitle.trim()) {
      this.toast.error('يرجى كتابة عنوان واضح للطلب.');
      return;
    }
    if (!this.bookingDescription.trim()) {
      this.toast.error('يرجى كتابة تفاصيل العمل المطلوب.');
      return;
    }
    if (this.bookingBudget <= 0) {
      this.toast.error('يرجى كتابة الميزانية التقديرية.');
      return;
    }
    if (!this.bookingAddress.trim()) {
      this.toast.error('يرجى كتابة موقع العمل.');
      return;
    }

    this.submitting = true;
    const payload = {
      title: this.bookingTitle,
      description: this.bookingDescription,
      category: this.worker?.specializations?.[0] || 'plumbing',
      budget: this.bookingBudget,
      location: {
        address: this.bookingAddress,
        city: this.bookingCity
      }
    };

    this.projectService.createProject(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        this.showBookingModal = false;
        this.toast.success('تم إرسال طلب الصيانة ونشره كطلب عروض! 🎉');
        this.router.navigate(['/customer/bid-requests']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error('فشل إرسال طلب الصيانة. يرجى المحاولة لاحقاً.');
      }
    });
  }
}
