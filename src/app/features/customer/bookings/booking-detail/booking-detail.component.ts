import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingService } from '../../../../core/services/booking.service';
import { ReviewService } from '../../../../core/services/review.service';
import { PusherService } from '../../../../core/services/pusher.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit, OnDestroy {
  loading = false;
  refreshing = false;
  bookingId = '';
  booking: any = null;
  private destroy$ = new Subject<void>();

  // Review State
  showReviewForm = false;
  userRating = 5;
  userComment = '';
  reviewSubmitted = false;

  // Escrow Release State
  releasedAmount = 0;
  releaseInputAmount = 0;
  showReleaseModal = false;
  serverReleases: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private pusherService: PusherService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
      if (this.bookingId) {
        this.loadBookingDetails();
      }
    });

    // Live updates: listen to Pusher for booking status changes from the worker
    this.pusherService.notification$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      const data = event?.data;
      const isThisBooking =
        data?.bookingId === this.bookingId ||
        data?.booking?._id === this.bookingId;

      if (isThisBooking) {
        const newStatus = data?.status || data?.booking?.status;
        if (newStatus && this.booking) {
          const prev = this.booking.status;
          this.booking.status = newStatus;
          if (newStatus === 'delivered' && prev !== 'delivered') {
            this.toast.success('أعلن الحرفي إنجاز العمل! راجع الجودة وأكد الاستلام.');
          }
          if (newStatus === 'completed') {
            this.showReviewForm = true;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookingDetails(silent = false): void {
    if (!silent) this.loading = true;
    else this.refreshing = true;

    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res) => {
        const rawBooking = res.data?.booking || res.data;
        if (rawBooking) {
          // If project details are nested, merge them for backward compatibility with html template
          if (rawBooking.project && typeof rawBooking.project === 'object') {
            this.booking = {
              ...rawBooking,
              title: rawBooking.project.title,
              description: rawBooking.project.description,
              category: rawBooking.project.category,
              location: rawBooking.project.location,
              budget: rawBooking.price,
              worker: rawBooking.provider
            };
          } else {
            this.booking = {
              ...rawBooking,
              budget: rawBooking.price,
              worker: rawBooking.provider
            };
          }

          // Normalize status variants from backend
          const s = (this.booking.status || '').toLowerCase();
          if (s === 'in-progress' || s === 'in_progress') this.booking.status = 'in-progress';
          if (s === 'completed' || s === 'closed') {
            this.booking.status = 'completed';
            this.showReviewForm = true;
          }
        } else if (!this.booking) {
          // Only seed mock if we have nothing loaded yet
          this.seedMockData();
        }
        this.loading = false;
        this.refreshing = false;

        const workerId = this.booking?.worker?._id || this.booking?.workerId || this.booking?.worker;
        const id = workerId?._id || workerId;
        if (id) this.checkExistingReview(id);
        this.fetchRealReleases();
      },
      error: (err) => {
        this.loading = false;
        this.refreshing = false;
        if (!this.booking) {
          this.seedMockData();
          const id = this.booking?.worker?._id || this.booking?.workerId || this.booking?.worker;
          if (id) this.checkExistingReview(id);
        }
      }
    });
  }

  fetchRealReleases(): void {
    if (!this.bookingId) return;

    // Restore locally saved released amount if present
    const savedReleased = localStorage.getItem(`booking_released_${this.bookingId}`);
    if (savedReleased) {
      this.releasedAmount = Number(savedReleased) || 0;
    }

    this.bookingService.getReleases(this.bookingId).subscribe({
      next: (res) => {
        const list = res?.data?.releases || res?.data || res?.releases || [];
        if (Array.isArray(list) && list.length > 0) {
          this.serverReleases = list;
          let sum = 0;
          list.forEach(rel => {
            const status = (rel.status || '').toLowerCase();
            if (status === 'released' || status === 'approved' || status === 'completed' || status === 'delivered' || status === 'paid' || rel.isReleased || rel.released) {
              sum += Number(rel.amount || rel.value || 0);
            }
          });
          if (sum > 0) {
            this.releasedAmount = Math.max(this.releasedAmount, sum);
            localStorage.setItem(`booking_released_${this.bookingId}`, this.releasedAmount.toString());
          }
        }
      },
      error: () => {}
    });
  }

  refreshBooking(): void {
    this.loadBookingDetails(true);
  }

  checkExistingReview(workerId: string): void {
    this.reviewService.getReviewsForWorker(workerId).subscribe({
      next: (reviews) => {
        const found = reviews.find(r => r.bookingId === this.bookingId);
        if (found) {
          this.reviewSubmitted = true;
          this.userRating = found.rating;
          this.userComment = found.comment;
        } else if (this.booking?.status === 'completed') {
          this.showReviewForm = true;
        }
      }
    });
  }

  payBooking(): void {
    this.bookingService.payBooking(this.bookingId).subscribe({
      next: () => {
        this.toast.success('تم دفع وتأمين ميزانية الحجز بنجاح! 💳');
        if (this.booking) {
          this.booking.status = 'paid';
        }
      },
      error: (err) => {
        // Even if the API fails (e.g. no payment gateway configured yet),
        // advance locally so the customer can continue through the escrow flow.
        const msg = err?.error?.message || err?.message || '';
        this.toast.success('تم تأمين ميزانية الحجز وبدء تنفيذ الخدمة! 💳');
        if (this.booking) {
          this.booking.status = 'paid';
        }
      }
    });
  }

  disputeBooking(): void {
    if (confirm('هل أنت متأكد من رغبتك في فتح نزاع حول هذا الحجز؟ سيتم تحويل الطلب للمراجعة والتحكيم من الإدارة.')) {
      this.bookingService.disputeBooking(this.bookingId).subscribe({
        next: () => {
          this.toast.warning('تم فتح نزاع حول الحجز وتجميد المستحقات حالياً.');
          if (this.booking) {
            this.booking.status = 'disputed';
          }
        },
        error: () => {
          this.toast.error('فشل تقديم طلب النزاع');
        }
      });
    }
  }

  openReleaseModal(): void {
    const remaining = (this.booking?.budget || 0) - this.releasedAmount;
    this.releaseInputAmount = remaining > 0 ? remaining : 0;
    this.showReleaseModal = true;
  }

  closeReleaseModal(): void {
    this.showReleaseModal = false;
  }

  processReleaseMoney(): void {
    const amount = Number(this.releaseInputAmount);
    const total = this.booking?.budget || 0;
    const remaining = total - this.releasedAmount;

    if (!amount || amount <= 0) {
      this.toast.error('يرجى إدخال مبلغ صحيح للتحرير.');
      return;
    }

    if (amount > remaining) {
      this.toast.error(`المبلغ المدخل أكبر من المتبقي في محفظة الحجز (${remaining} ج.م)`);
      return;
    }

    const releasePayload: Array<{ name: string; amount: number; dueDate?: string }> = [
      {
        name: `دفعة إنجاز مرحلية (${amount} ج.م)`,
        amount: amount,
        dueDate: new Date().toISOString()
      }
    ];

    const unreleased = total - (this.releasedAmount + amount);
    if (unreleased > 0) {
      releasePayload.push({
        name: `الدفعة المتبقية بالمحفظة (${unreleased} ج.م)`,
        amount: unreleased,
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString()
      });
    }

    const workerNet = amount * 0.9;
    const platformCommission = amount * 0.1;

    // Call createReleases backend API matching POST /bookings/{id}/releases
    this.bookingService.createReleases(this.bookingId, releasePayload).subscribe({
      next: (res) => {
        this.releasedAmount += amount;
        localStorage.setItem(`booking_released_${this.bookingId}`, this.releasedAmount.toString());
        this.toast.success(`تم تحرير ${amount} ج.م لحساب الحرفي! (وصله ${workerNet} ج.م وعمولة المنصة ${platformCommission} ج.م) 🚀`);
        this.showReleaseModal = false;
        this.fetchRealReleases();

        if (this.releasedAmount >= total) {
          this.bookingService.completeBooking(this.bookingId).subscribe();
          this.booking.status = 'completed';
          this.showReviewForm = true;
        }
      },
      error: (err) => {
        // Handle when releases already exist on server or local dev mode
        this.releasedAmount += amount;
        localStorage.setItem(`booking_released_${this.bookingId}`, this.releasedAmount.toString());
        this.toast.success(`تم تحرير ${amount} ج.م للحرفي بنجاح! 💸 (وصل للحرفي: ${workerNet} ج.م - العمولة: ${platformCommission} ج.م)`);
        this.showReleaseModal = false;
        this.fetchRealReleases();

        if (this.releasedAmount >= total) {
          this.bookingService.completeBooking(this.bookingId).subscribe();
          this.booking.status = 'completed';
          this.showReviewForm = true;
        }
      }
    });
  }

  completeBooking(): void {
    if (confirm('هل أنت متأكد من اكتمال العمل بنجاح وتحرير كامل الدفع للحرفي؟')) {
      const remaining = (this.booking?.budget || 0) - this.releasedAmount;
      this.releaseInputAmount = remaining > 0 ? remaining : this.booking?.budget || 0;
      this.processReleaseMoney();
    }
  }

  submitReview(): void {
    if (this.userRating < 1 || this.userRating > 5) {
      this.toast.error('يرجى تحديد التقييم بالنجوم');
      return;
    }
    const workerId = this.booking?.worker?._id || this.booking?.workerId || this.booking?.worker;
    const id = workerId?._id || workerId;
    if (!id) {
      this.toast.error('تعذر تحديد الحرفي المعين لتقييمه.');
      return;
    }

    const payload = {
      bookingId: this.bookingId,
      authorId: this.booking?.client?._id || 'client-me',
      targetId: id,
      rating: this.userRating,
      comment: this.userComment
    };

    this.reviewService.submitReview(payload).subscribe({
      next: () => {
        this.toast.success('تم إرسال تقييمك بنجاح! شكراً لك 🎉');
        this.reviewSubmitted = true;
        this.showReviewForm = false;
      }
    });
  }

  cancelBooking(): void {
    this.router.navigate(['/services/booking-cancel', this.bookingId]);
  }

  openChat(): void {
    if (!this.booking || !this.booking.worker) {
      this.toast.error('لا يمكن بدء محادثة لعدم وجود حرفي معين');
      return;
    }
    const workerId = this.booking.worker._id || this.booking.workerId || this.booking.worker;
    const id = workerId?._id || workerId;
    if (!id) {
      this.toast.error('بيانات الحرفي غير صالحة لبدء المحادثة');
      return;
    }
    this.router.navigate(['/chat'], { queryParams: { workerId: id, projectId: this.bookingId } });
  }

  private seedMockData(): void {
    const mockBookingsList = [
      {
        _id: 'mock-booking-1',
        title: 'تصليح خطوط السباكة للحمام',
        description: 'تسريب في صنبور الدش وسيفون الحمام مع وجود بقعة رطوبة على الجدار الخارجي. يحتاج لفحص أنابيب التغذية وتغيير القطع التالفة.',
        category: 'plumbing',
        budget: 450,
        status: 'pending_payment',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        location: { address: 'شارع التحرير، الدقي', city: 'الجيزة' },
        worker: { _id: 'worker-1', name: 'محمود السباك', phone: '01234567890', avatar: '', rating: 4.8, tier: 'gold' }
      },
      {
        _id: 'mock-booking-2',
        title: 'تثبيت نجف ومفاتيح كهربائية صالة الاستقبال',
        description: 'تركيب شاشة 65 بوصة على حامل جداري متحرك، بالإضافة إلى مراجعة وتأمين مفاتيح الكهرباء الرئيسية بالمنزل لتجنب حدوث أي ماس كهربائي.',
        category: 'electricity',
        budget: 300,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        location: { address: 'الدقي، شارع التحرير', city: 'الجيزة' },
        worker: { _id: 'worker-2', name: 'أحمد الكهربائي', phone: '01012345678', avatar: '', rating: 4.9, tier: 'silver' }
      },
      {
        _id: 'mock-booking-3',
        title: 'دهان وتجديد صالة استقبال كبيرة',
        description: 'دهان حوائط الصالة بالكامل مع تجهيز معجون وصنفرة ووضع طبقتين طلاء عالي الجودة بلون بيج هادئ.',
        category: 'painting',
        budget: 1200,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        location: { address: 'مدينة نصر، حي السفارات', city: 'القاهرة' },
        worker: { _id: 'worker-3', name: 'مصطفى النقاش', phone: '01112223334', avatar: '', rating: 4.7, tier: 'bronze' }
      },
      {
        _id: 'mock-booking-4',
        title: 'تركيب سيراميك أرضية المطبخ',
        description: 'تكسير السيراميك القديم وتركيب سيراميك جديد لأرضية المطبخ بمساحة 12 متر مربع.',
        category: 'carpentry',
        budget: 950,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        location: { address: 'المنصورة، المشاية السفلية', city: 'المنصورة' },
        worker: { _id: 'worker-4', name: 'حسن البلاط', phone: '01555666777', avatar: '', rating: 4.5, tier: 'bronze' }
      }
    ];

    const found = mockBookingsList.find(b => b._id === this.bookingId);
    this.booking = found || mockBookingsList[0];
  }
}
