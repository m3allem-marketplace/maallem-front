import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProposalService } from '../../../core/services/proposal.service';
import { ProjectService } from '../../../core/services/project.service';
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

  // Stats
  totalBids = 0;
  acceptedBids = 0;
  pendingBids = 0;
  totalEarnings = 0;

  constructor(
    public router: Router,
    private proposalService: ProposalService,
    private projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Load my submitted bids
    this.proposalService.getMyProposals().subscribe({
      next: (res) => {
        const list = res.data?.proposals || res.data || [];
        this.myBids = list;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
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
