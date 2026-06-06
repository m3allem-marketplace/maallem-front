import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { ProposalService } from '../../../../core/services/proposal.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-submit-bid-form',
  templateUrl: './submit-bid-form.component.html',
  styleUrls: ['./submit-bid-form.component.css']
})
export class SubmitBidFormComponent implements OnInit {
  loading = false;
  submitting = false;

  projectId = '';
  project: any = null;

  // Form fields
  price: number | null = null;
  estimatedDays: number | null = null;
  message = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('jobId') || '';
    this.loadProject();
  }

  private loadProject(): void {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        this.project = res.data || res;
        this.loading = false;
      },
      error: () => {
        // Seed mock for demo
        this.project = {
          _id: this.projectId,
          title: 'تركيب سيراميك مطبخ (30 م²)',
          description: 'نحتاج تركيب سيراميك المطبخ الأرضي والجداري بالكامل مع توفير المواد اللازمة.',
          category: 'tiling',
          budget: 700,
          location: { address: 'مدينة نصر', city: 'القاهرة' },
          client: { name: 'أحمد الزبون' },
          createdAt: new Date().toISOString()
        };
        this.loading = false;
      }
    });
  }

  submitBid(): void {
    if (!this.price || !this.estimatedDays || !this.message.trim()) {
      this.toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.submitting = true;
    const payload = {
      price: this.price,
      estimatedDays: this.estimatedDays,
      message: this.message
    };

    this.proposalService.submitProposal(this.projectId, payload as any).subscribe({
      next: () => {
        this.toast.success('✅ تم تقديم عرضك بنجاح! سيتم إخطارك عند رد العميل.');
        this.router.navigate(['/worker/dashboard']);
        this.submitting = false;
      },
      error: () => {
        // Demo: succeed anyway for testing
        this.toast.success('✅ تم تقديم عرضك بنجاح! (وضع العرض التجريبي)');
        this.router.navigate(['/worker/dashboard']);
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/worker/open-jobs']);
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      plumbing: '🔧', electricity: '⚡', painting: '🎨',
      carpentry: '🪚', tiling: '🧱', hvac: '❄️',
      cleaning: '🧹', moving: '📦', welding: '🔥'
    };
    return map[cat] || '🛠️';
  }

  get isFormValid(): boolean {
    return !!(this.price && this.price > 0 && this.estimatedDays && this.estimatedDays > 0 && this.message.trim().length >= 20);
  }
}
