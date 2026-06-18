import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProposalService } from '../../../core/services/proposal.service';
import { ProjectService } from '../../../core/services/project.service';
import { BookingService } from '../../../core/services/booking.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-my-bids',
  templateUrl: './my-bids.component.html',
  styleUrls: ['./my-bids.component.css']
})
export class MyBidsComponent implements OnInit {
  loading = false;
  bids: any[] = [];
  activeTab: 'all' | 'pending' | 'accepted' | 'rejected' = 'all';

  constructor(
    public router: Router,
    private proposalService: ProposalService,
    private projectService: ProjectService,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyBids();
  }

  loadMyBids(): void {
    this.loading = true;
    forkJoin({
      proposals: this.proposalService.getMyProposals().pipe(
        catchError(() => of({ data: { proposals: [] } }))
      ),
      projects: this.projectService.getAssignedProjects().pipe(
        catchError(() => of({ data: { projects: [] } }))
      ),
      bookings: this.bookingService.getBookings().pipe(
        catchError(() => of({ data: { bookings: [] } }))
      )
    }).subscribe({
      next: ({ proposals, projects, bookings }) => {
        const propList = proposals?.data?.proposals || proposals?.data || proposals || [];
        const projList = projects?.data?.projects || projects?.data || [];
        const bookList = bookings?.data?.bookings || bookings?.data || [];
        
        // Map and merge direct bookings
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

        this.bids = [...propList, ...directOffersMapped];
        // Sort by createdAt descending
        this.bids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        this.loading = false;
      },
      error: () => {
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  get filteredBids(): any[] {
    if (this.activeTab === 'all') {
      return this.bids;
    }
    return this.bids.filter(b => b.status === this.activeTab);
  }

  setActiveTab(tab: 'all' | 'pending' | 'accepted' | 'rejected'): void {
    this.activeTab = tab;
  }

  onBidClick(bid: any): void {
    const projectId = bid.projectId || bid.project?._id || bid.project;
    if (projectId) {
      this.router.navigate(['/tasks', projectId]);
    } else {
      this.toast.error('لا يمكن العثور على تفاصيل هذه المهمة');
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
    const categories: Record<string, string> = {
      plumbing: 'سباكة',
      electricity: 'كهرباء',
      painting: 'دهانات',
      carpentry: 'نجارة',
      tiling: 'سيراميك وبلاط',
      hvac: 'تكييف وتبريد',
      cleaning: 'تنظيف',
      welding: 'حدادة ولحام'
    };
    return categories[cat || ''] || cat || '';
  }

  getBidStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'قيد المراجعة',
      accepted: 'مقبول (حجز نشط)',
      rejected: 'مرفوض'
    };
    return labels[status] || status;
  }

  private seedMockData(): void {
    this.bids = [
      {
        _id: 'bid-1',
        projectTitle: 'تصليح خطوط السباكة للحمام',
        projectId: 'task-1',
        category: 'plumbing',
        price: 450,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        client: { name: 'أحمد العميل' },
        message: 'جاهز لبدء العمل فوراً وتغيير الخراطيم التالفة بقطع غيار إيطالية.'
      },
      {
        _id: 'bid-2',
        projectTitle: 'تثبيت نجف ومفاتيح كهربائية صالة الاستقبال',
        projectId: 'task-2',
        category: 'electricity',
        price: 300,
        status: 'accepted',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        client: { name: 'سارة المشتركة' },
        message: 'أقوم بإصلاح كافة أنواع التسريبات بأجهزة كشف حديثة دون تكسير.'
      },
      {
        _id: 'bid-3',
        projectTitle: 'دهان وتجديد صالة استقبال كبيرة',
        projectId: 'task-3',
        category: 'painting',
        price: 2200,
        status: 'rejected',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        client: { name: 'محمد الزبون' },
        message: 'أعمل بجدية وخبرة 10 سنوات بالدهانات.'
      }
    ];
  }
}
