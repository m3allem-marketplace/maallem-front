import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProposalService } from '../../../core/services/proposal.service';
import { ProjectService } from '../../../core/services/project.service';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-worker-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class WorkerDashboardComponent implements OnInit {
  loading = false;

  myBids: any[] = [];
  openJobs: any[] = [];
  incomingBookings: any[] = [];

  // Stats
  totalBids = 0;
  acceptedBids = 0;
  pendingBids = 0;
  totalEarnings = 0;

  constructor(
    public router: Router,
    private proposalService: ProposalService,
    private projectService: ProjectService,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    console.log('[WorkerDashboard] Triggering concurrent fetch for dashboard data...');
    
    forkJoin({
      proposals: this.proposalService.getMyProposals().pipe(
        catchError((err) => {
          console.error('[WorkerDashboard] Error fetching proposals:', err);
          return of({ data: { proposals: [] } });
        })
      ),
      projects: this.projectService.getAssignedProjects().pipe(
        catchError((err) => {
          console.error('[WorkerDashboard] Error fetching assigned projects:', err);
          return of({ data: { projects: [] } });
        })
      ),
      bookings: this.bookingService.getBookings().pipe(
        catchError((err) => {
          console.error('[WorkerDashboard] Error fetching bookings:', err);
          return of({ data: { bookings: [] } });
        })
      )
    }).subscribe({
      next: ({ proposals, projects, bookings }) => {
        const propList = proposals?.data?.proposals || proposals?.data || proposals || [];
        const projList = projects?.data?.projects || projects?.data || [];
        const bookList = bookings?.data?.bookings || bookings?.data || [];
        
        console.log('[WorkerDashboard] Proposals fetched:', propList);
        console.log('[WorkerDashboard] Assigned projects fetched:', projList);
        console.log('[WorkerDashboard] Bookings fetched:', bookList);

        // 1. Map and merge direct bookings for tracking (active, accepted, closed)
        const directOffersMapped = bookList
          .filter((b: any) => !b.proposal && !b.proposalId)
          .map((b: any) => {
            const projId = (b.project && typeof b.project === 'object') ? b.project._id : b.project;
            const proj = projList.find((p: any) => p._id === projId);
            
            // Map booking/project status to proposal status
            let proposalStatus = 'pending';
            if (['paid', 'delivered', 'completed', 'disputed'].includes(b.status) || (proj && ['in-progress', 'confirmed'].includes(proj.status))) {
              proposalStatus = 'accepted';
            } else if (['cancelled', 'refunded'].includes(b.status) || (proj && ['closed', 'cancelled'].includes(proj.status))) {
              proposalStatus = 'rejected';
            }
            
            return {
              _id: b._id,
              projectId: projId,
              projectTitle: proj?.title || b.title || 'طلب صيانة مباشر',
              project: proj || { _id: projId, title: b.title, category: b.category, client: b.client },
              category: proj?.category || b.category || 'plumbing',
              price: b.price,
              status: proposalStatus,
              createdAt: b.createdAt || proj?.createdAt || new Date().toISOString(),
              client: b.client || proj?.client,
              message: 'طلب حجز مباشر من العميل (مباشر) / Direct Booking Request from Client',
              isDirect: true
            };
          });

        this.myBids = [...propList, ...directOffersMapped];
        // Sort by createdAt descending
        this.myBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 2. Filter incoming direct requests (new bookings that are pending payment/confirmation and not accepted yet)
        const pendingDirectBookings = bookList.filter((b: any) => {
          const projId = (b.project && typeof b.project === 'object') ? b.project._id : b.project;
          const proj = projList.find((p: any) => p._id === projId);
          const isAccepted = proj && ['in-progress', 'confirmed', 'completed', 'closed'].includes(proj.status);
          return (b.status === 'pending_payment' || b.status === 'pending' || b.status === 'direct_pending') &&
            !b.proposal && !b.proposalId && !isAccepted;
        });

        this.incomingBookings = pendingDirectBookings.map((b: any) => {
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

        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('[WorkerDashboard] Error loading dashboard:', err);
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.totalBids = this.myBids.length;
    this.acceptedBids = this.myBids.filter(b => b.status === 'accepted').length;
    this.pendingBids = this.myBids.filter(b => b.status === 'pending').length;
    this.totalEarnings = this.myBids
      .filter(b => b.status === 'accepted')
      .reduce((sum, b) => sum + (b.price || 0), 0);
  }

  private seedMockData(): void {
    this.myBids = [
      {
        _id: 'bid-1',
        projectTitle: 'تصليح خطوط السباكة للحمام',
        category: 'plumbing',
        price: 450,
        status: 'pending',
        createdAt: new Date().toISOString(),
        client: { name: 'أحمد العميل' }
      },
      {
        _id: 'bid-2',
        projectTitle: 'تثبيت نجف ومفاتيح كهربائية',
        category: 'electricity',
        price: 300,
        status: 'accepted',
        createdAt: new Date().toISOString(),
        client: { name: 'سارة المشتركة' }
      },
      {
        _id: 'bid-3',
        projectTitle: 'دهان غرفة نوم أطفال',
        category: 'painting',
        price: 800,
        status: 'rejected',
        createdAt: new Date().toISOString(),
        client: { name: 'محمد الزبون' }
      }
    ];

    this.openJobs = [
      {
        _id: 'job-1',
        title: 'تركيب سيراميك مطبخ',
        category: 'tiling',
        budget: 700,
        location: { city: 'القاهرة' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'job-2',
        title: 'صيانة تكييف مركزي',
        category: 'hvac',
        budget: 500,
        location: { city: 'الجيزة' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'job-3',
        title: 'تركيب غرفة نوم مودرن',
        category: 'carpentry',
        budget: 3500,
        location: { city: 'الإسكندرية' },
        createdAt: new Date().toISOString()
      }
    ];

    this.calculateStats();
  }

  browsAllJobs(): void {
    this.router.navigate(['/worker/open-jobs']);
  }

  viewMyBids(): void {
    this.router.navigate(['/worker/my-bids']);
  }

  onBidClick(bid: any): void {
    const projectId = bid.projectId || bid.project?._id || bid.project;
    if (projectId) {
      this.router.navigate(['/tasks', projectId]);
    }
  }

  onReservationClick(reservation: any): void {
    const projectId = reservation.projectId || reservation.project?._id || reservation.project;
    if (projectId) {
      this.router.navigate(['/tasks', projectId]);
    } else {
      this.toast.error('لا يمكن العثور على تفاصيل هذه المهمة');
    }
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      plumbing: '🔧', electricity: '⚡', painting: '🎨',
      carpentry: '🪚', tiling: '🧱', hvac: '❄️',
      cleaning: '🧹', moving: '📦', welding: '🔥'
    };
    return map[cat] || '🛠️';
  }

  getBidStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'قيد المراجعة', accepted: 'مقبول', rejected: 'مرفوض'
    };
    return labels[status] || status;
  }
}
