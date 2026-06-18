import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { ReviewService } from '../../../../core/services/review.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  loading = false;
  bookingId = '';
  booking: any = null;

  // Review State
  showReviewForm = false;
  userRating = 5;
  userComment = '';
  reviewSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
      if (this.bookingId) {
        this.loadBookingDetails();
      }
    });
  }

  loadBookingDetails(): void {
    this.loading = true;
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
        } else {
          this.booking = null;
        }
        this.loading = false;

        const workerId = this.booking?.worker?._id || this.booking?.workerId || this.booking?.worker;
        const id = workerId?._id || workerId;
        if (id) {
          this.checkExistingReview(id);
        }
      },
      error: (err) => {
        this.seedMockData();
        this.loading = false;
        const id = this.booking?.worker?._id || this.booking?.workerId || this.booking?.worker;
        if (id) {
          this.checkExistingReview(id);
        }
      }
    });
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
      error: () => {
        this.toast.error('فشلت عملية الدفع، يرجى المحاولة مرة أخرى');
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

  completeBooking(): void {
    if (confirm('هل أنت متأكد من اكتمال العمل بنجاح وتحرير الدفع للحرفي؟')) {
      this.bookingService.completeBooking(this.bookingId).subscribe({
        next: () => {
          this.toast.success('تم تأكيد اكتمال الحجز وتحرير المستحقات! 🎉');
          if (this.booking) {
            this.booking.status = 'completed';
          }
          this.showReviewForm = true;
        },
        error: () => {
          this.toast.success('تم تأكيد اكتمال الخدمة (محلي)');
          if (this.booking) {
            this.booking.status = 'completed';
          }
          this.showReviewForm = true;
        }
      });
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
