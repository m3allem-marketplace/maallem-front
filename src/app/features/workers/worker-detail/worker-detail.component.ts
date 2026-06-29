import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerProfileService } from '../../../core/services/worker-profile.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { BookingService } from '../../../core/services/booking.service';
import { ChatService } from '../../../core/services/chat.service';
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
  bookingStep = 1;
  bookingTitle = '';
  bookingDescription = '';
  bookingBudget = 150;
  bookingAddress = '';
  bookingCity = 'القاهرة';
  bookingLat = 30.0444; // Default Cairo
  bookingLng = 31.2357;

  cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'المنوفية', 'الغربية'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workerProfileService: WorkerProfileService,
    private projectService: ProjectService,
    private userContext: UserContextService,
    private bookingService: BookingService,
    private chatService: ChatService,
    private toast: ToastService
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.workerId = params.get('id') || '';
      if (this.workerId) {
        this.loadProfile();
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['book'] === 'true') {
        setTimeout(() => {
          this.openBookingModal();
        }, 800);
      }
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.workerProfileService.getWorkerProfileById(this.workerId).subscribe({
      next: (res) => {
        this.worker = res?.data?.profile || res?.data || null;
        if (this.worker) {
          if (this.worker.location?.city) {
            this.bookingCity = this.worker.location.city;
          }
          // Load portfolio images from localStorage if available
          const localImagesStr = localStorage.getItem(`worker_portfolio_images_${this.workerId}`) ||
                                 (this.worker.user?._id ? localStorage.getItem(`worker_portfolio_images_${this.worker.user._id}`) : null) ||
                                 (this.worker._id ? localStorage.getItem(`worker_portfolio_images_${this.worker._id}`) : null);
          if (localImagesStr) {
            try {
              this.worker.portfolioImages = JSON.parse(localImagesStr);
            } catch (e) {
              // ignore
            }
          }
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

    // Load saved location from localStorage
    const savedLocStr = localStorage.getItem('user_selected_location');
    if (savedLocStr) {
      try {
        const saved = JSON.parse(savedLocStr);
        if (saved && saved.lat && saved.lng) {
          this.bookingLat = saved.lat;
          this.bookingLng = saved.lng;
          this.bookingAddress = saved.address || '';
          this.bookingCity = saved.city || 'القاهرة';
        }
      } catch (e) {
        console.warn('Failed to parse user_selected_location from localStorage:', e);
      }
    }

    this.bookingStep = 1;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  nextStep(): void {
    if (!this.bookingTitle.trim()) {
      this.toast.error('يرجى كتابة عنوان واضح للطلب.');
      return;
    }
    if (this.bookingTitle.trim().length < 5) {
      this.toast.error('العنوان قصير جداً، يرجى كتابة عنوان يوضح المشكلة.');
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
    this.bookingStep = 2;
  }

  prevStep(): void {
    this.bookingStep = 1;
  }

  onBookingLocationChange(loc: any): void {
    this.bookingLat = loc.lat;
    this.bookingLng = loc.lng;
    this.bookingAddress = loc.address;
    this.bookingCity = loc.city;
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
      this.toast.error('يرجى تحديد موقع العمل على الخريطة وكتابة العنوان.');
      return;
    }

    this.submitting = true;

    const workerUserId = this.worker?.user?._id || this.workerId;

    // 1. Create a Project first with the direct request details
    const projectPayload = {
      title: this.bookingTitle.trim(),
      description: this.bookingDescription.trim(),
      budget: this.bookingBudget,
      location: {
        address: this.bookingAddress.trim(),
        city: this.bookingCity
      },
      category: this.worker?.specializations?.[0] || 'plumbing',
      workerId: workerUserId
    };

    this.projectService.createProject(projectPayload).subscribe({
      next: (projectRes) => {
        const createdProject = projectRes.data?.project || projectRes.data || projectRes;
        const projectId = createdProject?._id;

        if (projectId) {
          // Update user_selected_location in localStorage with the confirmed details
          const confirmedLocation = {
            lat: this.bookingLat,
            lng: this.bookingLng,
            city: this.bookingCity,
            address: this.bookingAddress.trim()
          };
          localStorage.setItem('user_selected_location', JSON.stringify(confirmedLocation));

          // 2. Save direct request metadata in localStorage for matchingType and countdown timer
          const meta = {
            matchingType: 'direct',
            directRequestExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            worker: this.worker?.user || this.worker
          };
          localStorage.setItem(`direct_booking_${projectId}`, JSON.stringify(meta));

          // 3. Create the Booking linked to this project (with serviceId as null to avoid 422 validation error)
          const bookingPayload = {
            workerId: workerUserId,
            price: this.bookingBudget,
            projectId: projectId,
            serviceId: null
          };

          this.bookingService.createBooking(bookingPayload).subscribe({
            next: (bookingRes) => {
              // 4. Auto-start conversation between worker and client
              this.chatService.startConversation(workerUserId, projectId).subscribe({
                error: (chatErr) => console.warn('Failed to auto-start chat conversation on backend:', chatErr)
              });

              this.submitting = false;
              this.showBookingModal = false;
              this.toast.success('تم إرسال طلب الحجز المباشر للحرفي بنجاح! 🎉');
              this.router.navigate(['/customer/bookings']);
            },
            error: (bookingErr) => {
              this.submitting = false;
              this.toast.error('فشل إرسال طلب الحجز المباشر. يرجى المحاولة لاحقاً.');
            }
          });
        } else {
          this.submitting = false;
          this.toast.error('فشل إنشاء مشروع الطلب المباشر.');
        }
      },
      error: (projectErr) => {
        this.submitting = false;
        this.toast.error('فشل إرسال طلب الصيانة. يرجى المحاولة لاحقاً.');
      }
    });
  }
}

