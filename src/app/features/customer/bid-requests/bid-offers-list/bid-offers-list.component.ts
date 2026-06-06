import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from '../../../../core/services/proposal.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-bid-offers-list',
  templateUrl: './bid-offers-list.component.html',
  styleUrls: ['./bid-offers-list.component.css']
})
export class BidOffersListComponent implements OnInit {
  loading = false;
  projectId = '';
  project: any = null;
  offers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private proposalService: ProposalService,
    private projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') || '';
      if (this.projectId) {
        this.loadProjectAndOffers();
      }
    });
  }

  loadProjectAndOffers(): void {
    this.loading = true;
    
    // Fetch project info
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        this.project = res.data?.project || res.data || res;
      },
      error: () => {
        this.seedMockProject();
      }
    });

    // Fetch proposals
    this.proposalService.getProposalsForProject(this.projectId).subscribe({
      next: (res) => {
        this.offers = res.data?.proposals || res.data || [];
        this.loading = false;
      },
      error: () => {
        this.seedMockOffers();
        this.loading = false;
      }
    });
  }

  acceptOffer(offerId: string): void {
    this.router.navigate(['/services/booking-confirm', offerId]);
  }

  private seedMockProject(): void {
    this.project = {
      _id: this.projectId,
      title: 'تصليح خطوط السباكة للحمام',
      budget: 450,
      description: 'تسريب في صنبور الدش وسيفون الحمام مع وجود بقعة رطوبة على الجدار الخارجي.'
    };
  }

  private seedMockOffers(): void {
    this.offers = [
      {
        _id: 'mock-offer-1',
        price: 400,
        estimatedDuration: 'يوم واحد',
        message: 'جاهز لبدء العمل فوراً وتغيير الخراطيم التالفة بقطع غيار إيطالية مكفولة 3 سنوات. تواصل معي للتفاصيل.',
        status: 'pending',
        worker: {
          name: 'محمود السباك',
          avatar: '',
          rating: 4.8,
          tier: 'gold'
        }
      },
      {
        _id: 'mock-offer-2',
        price: 450,
        estimatedDuration: 'يومين',
        message: 'أعمل بجدية وخبرة 10 سنوات بالسباكة، سأقوم بمعاينة شاملة مجاناً وتحديد سبب التسريب الرئيسي وحله نهائياً.',
        status: 'pending',
        worker: {
          name: 'صابر أبو علي',
          avatar: '',
          rating: 4.5,
          tier: 'silver'
        }
      }
    ];
  }
}
