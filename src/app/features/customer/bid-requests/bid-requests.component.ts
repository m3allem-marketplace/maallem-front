import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '@m3allem/ui-kit';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-bid-requests',
  templateUrl: './bid-requests.component.html',
  styleUrls: ['./bid-requests.component.css']
})
export class BidRequestsComponent implements OnInit {
  loading = false;
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (res) => {
        const list = res.data?.projects || res.data || [];
        this.projects = list;
        this.loading = false;
      },
      error: (err) => {
        this.seedMockData();
        this.loading = false;
      }
    });
  }

  viewOffers(projectId: string): void {
    this.router.navigate(['/customer/bid-requests', projectId, 'offers']);
  }

  postNewJob(): void {
    this.router.navigate(['/customer/bid-requests/post']);
  }

  private seedMockData(): void {
    this.projects = [
      {
        _id: 'mock-proj-1',
        title: 'تصليح خطوط السباكة للحمام',
        description: 'تسريب في صنبور الدش وسيفون الحمام مع وجود بقعة رطوبة على الجدار الخارجي.',
        category: 'plumbing',
        budget: 450,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: { address: 'شارع التحرير، الدقي', city: 'الجيزة' },
        client: { _id: 'client-1', name: 'أحمد العميل', email: 'client@mail.com', role: 'user' }
      },
      {
        _id: 'mock-proj-2',
        title: 'تثبيت نجف ومفاتيح كهربائية صالة الاستقبال',
        description: 'تركيب 3 نجفات كبيرة وتغيير 10 مفاتيح إضاءة تالفة في الشقة.',
        category: 'electricity',
        budget: 300,
        status: 'closed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: { address: 'شارع عباس العقاد، مدينة نصر', city: 'القاهرة' },
        client: { _id: 'client-1', name: 'أحمد العميل', email: 'client@mail.com', role: 'user' }
      }
    ];
  }
}
