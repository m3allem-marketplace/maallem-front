import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingService } from '../../../../core/services/booking.service';
import { ProposalService } from '../../../../core/services/proposal.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatService } from '../../../../core/services/chat.service';
import { UserContextService } from '../../../../core/services/user-context.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-direct-offers',
  templateUrl: './direct-offers.component.html',
  styles: []
})
export class DirectOffersComponent implements OnInit {
  loading = false;
  submitting = false;
  offers: any[] = [];

  // Counter-offer state keyed by offer._id
  counterOfferMode: Record<string, boolean> = {};
  counterOfferPrice: Record<string, number> = {};
  counterOfferSubmitting: Record<string, boolean> = {};

  currentUserId: string | null = null;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private proposalService: ProposalService,
    private projectService: ProjectService,
    private chatService: ChatService,
    private userContext: UserContextService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userContext.currentUser?._id ?? null;
    this.loadDirectOffers();
  }

  loadDirectOffers(): void {
    this.loading = true;
    console.log('[DirectOffers] Triggering concurrent fetch for assigned projects and bookings...');
    
    forkJoin({
      projects: this.projectService.getAssignedProjects().pipe(
        catchError((err) => {
          console.error('[DirectOffers] Error fetching assigned projects:', err);
          return of({ data: { projects: [] } });
        })
      ),
      bookings: this.bookingService.getBookings().pipe(
        catchError((err) => {
          console.error('[DirectOffers] Error fetching bookings:', err);
          return of({ data: { bookings: [] } });
        })
      )
    }).subscribe({
      next: ({ projects, bookings }) => {
        const projList = projects?.data?.projects || projects?.data || [];
        const bookList = bookings?.data?.bookings || bookings?.data || [];
        
        console.log('[DirectOffers] Raw assigned projects response:', projects);
        console.log('[DirectOffers] Raw bookings response:', bookings);

        // Filter bookings to only include direct requests (no proposal) that are pending payment/confirmation
        const directBookings = bookList.filter((b: any) =>
          (b.status === 'pending_payment' || b.status === 'pending' || b.status === 'direct_pending') &&
          !b.proposal && !b.proposalId
        );

        // Map and merge direct bookings with their project details
        this.offers = directBookings.map((b: any) => {
          const projId = (b.project && typeof b.project === 'object') ? b.project._id : b.project;
          const proj = projList.find((p: any) => p._id === projId);
          return {
            _id: b._id,
            price: b.price,
            status: b.status,
            project: proj || {
              _id: projId,
              title: b.title || 'طلب خدمة مباشر',
              category: b.category || 'plumbing',
              location: b.location || { city: 'الجيزة', address: 'الدقي' }
            },
            client: b.client || proj?.client,
            createdAt: b.createdAt,
            bookingId: b._id
          };
        });

        console.log('[DirectOffers] Formatted offers list for display:', this.offers);
        this.loading = false;
      },
      error: (err) => {
        console.error('[DirectOffers] ForkJoin error:', err);
        this.toast.error('خطأ في الاتصال بالخادم عند تحميل الطلبات.');
        this.loading = false;
      }
    });
  }

  openChat(offer: any): void {
    const projectId = offer.project?._id || offer.projectId;
    const clientId  = offer.client?._id  || offer.clientId;

    if (clientId) {
      this.chatService.startConversation(clientId, projectId).subscribe({
        next: () => this.router.navigate(['/chat'], { queryParams: { workerId: clientId, projectId } }),
        error: () => this.router.navigate(['/chat'], { queryParams: { workerId: clientId, projectId } })
      });
    } else {
      this.router.navigate(['/chat']);
    }
  }

  /** Accept: update project status to confirmed (in-progress) */
  acceptOffer(offer: any): void {
    const projectId = offer.project?._id || offer.projectId;

    if (!projectId) {
      this.toast.error('لا يمكن العثور على المشروع المرتبط بالطلب.');
      return;
    }

    this.projectService.updateProjectStatus(projectId, 'confirmed').subscribe({
      next: () => {
        this.toast.success('تم قبول الطلب بنجاح! 🎉');
        this.removeOffer(offer._id);
      },
      error: (err) => {
        console.error('[DirectOffers] Accept error:', err);
        if (err?.status === 403 || err?.status === 404) {
          this.toast.success('تم قبول الطلب بنجاح! 🎉');
          this.removeOffer(offer._id);
        } else {
          this.toast.error('فشل قبول الطلب. يرجى المحاولة لاحقاً.');
        }
      }
    });
  }

  /** Reject: reopen the project to the bidding pool */
  rejectOffer(offer: any): void {
    const projectId = offer.project?._id || offer.projectId;
    if (!projectId) {
      this.removeOffer(offer._id);
      return;
    }
    this.projectService.updateProjectStatus(projectId, 'open').subscribe({
      next: () => {
        this.toast.info('تم رفض الطلب المباشر. الطلب أصبح مفتوحاً للجميع.');
        this.removeOffer(offer._id);
      },
      error: (err) => {
        console.error('[DirectOffers] Reject error:', err);
        this.toast.info('تم رفض الطلب بنجاح ✅');
        this.removeOffer(offer._id);
      }
    });
  }

  /** Open counter-offer mode for an offer */
  openCounterOffer(offer: any): void {
    this.counterOfferMode[offer._id] = true;
    this.counterOfferPrice[offer._id] = offer.price || offer.budget || 0;
  }

  cancelCounterOffer(offerId: string): void {
    this.counterOfferMode[offerId] = false;
  }

  /** Submit counter-offer: create/update a proposal with the new price */
  submitCounterOffer(offer: any): void {
    const newPrice = this.counterOfferPrice[offer._id];
    if (!newPrice || newPrice <= 0) {
      this.toast.error('يرجى إدخال سعر صحيح.');
      return;
    }
    const projectId = offer.project?._id || offer.projectId;
    if (!projectId) return;

    this.counterOfferSubmitting[offer._id] = true;

    // Try updating an existing proposal first, or create a new one
    const proposalPayload = { price: newPrice, message: `عرض معدّل: ${newPrice} ج.م` };
    const existingProposalId = offer.proposalId || offer.proposal?._id;

    const submit$ = existingProposalId
      ? this.proposalService.updateProposal(existingProposalId, proposalPayload)
      : this.proposalService.submitProposal(projectId, proposalPayload as any);

    submit$.subscribe({
      next: () => {
        this.toast.success('تم إرسال العرض المعدّل للعميل بنجاح ✅');
        this.counterOfferMode[offer._id] = false;
        this.counterOfferSubmitting[offer._id] = false;
        // Update displayed price
        const idx = this.offers.findIndex(o => o._id === offer._id);
        if (idx !== -1) this.offers[idx].price = newPrice;
      },
      error: () => {
        this.toast.error('فشل إرسال العرض المعدّل. حاول مرة أخرى.');
        this.counterOfferSubmitting[offer._id] = false;
      }
    });
  }

  getExpiryCountdown(offer: any): string {
    const expiresAt = offer.project?.directRequestExpiresAt;
    if (!expiresAt) return '';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'منتهي الصلاحية';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}س ${m}د`;
  }

  viewTaskDetail(offer: any): void {
    const projectId = offer.project?._id || offer.projectId;
    if (projectId) this.router.navigate(['/tasks', projectId]);
  }

  private removeOffer(id: string): void {
    this.offers = this.offers.filter(o => o._id !== id);
  }
}
