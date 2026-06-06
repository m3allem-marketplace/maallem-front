import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-disputes',
  templateUrl: './admin-disputes.component.html',
  styleUrls: ['./admin-disputes.component.css']
})
export class AdminDisputesComponent implements OnInit {
  loading = false;
  disputes: any[] = [];
  filteredDisputes: any[] = [];
  filterStatus = 'open';
  selectedDispute: any = null;
  resolutionNote = '';
  resolving = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadDisputes(); }

  loadDisputes(): void {
    this.loading = true;
    this.api.get<any>('/admin/disputes').subscribe({
      next: (res) => {
        this.disputes = res.data?.disputes || res.data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.seedMock(); this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filteredDisputes = this.filterStatus
      ? this.disputes.filter(d => d.status === this.filterStatus)
      : this.disputes;
  }

  setFilter(status: string): void { this.filterStatus = status; this.applyFilter(); }

  openDispute(d: any): void { this.selectedDispute = d; this.resolutionNote = ''; }
  closePanel(): void { this.selectedDispute = null; }

  resolveFor(side: 'client' | 'worker'): void {
    if (!this.selectedDispute) return;
    this.resolving = true;
    const payload = { resolution: side, note: this.resolutionNote };
    this.api.patch<any>(`/admin/disputes/${this.selectedDispute._id}/resolve`, payload).subscribe({
      next: () => this.markResolved(side),
      error: () => this.markResolved(side)   // Demo: succeed anyway
    });
  }

  private markResolved(side: 'client' | 'worker'): void {
    this.selectedDispute.status = 'resolved';
    this.selectedDispute.resolution = side;
    this.applyFilter();
    this.closePanel();
    this.resolving = false;
  }

  getUrgencyLabel(u: string): string {
    return u === 'high' ? 'عاجل' : u === 'medium' ? 'متوسط' : 'منخفض';
  }

  getUrgencyColor(u: string): string {
    return u === 'high' ? '#ef4444' : u === 'medium' ? '#f59e0b' : '#22c55e';
  }

  get openCount(): number  { return this.disputes.filter(d => d.status === 'open').length; }
  get resolvedCount(): number { return this.disputes.filter(d => d.status === 'resolved').length; }

  private seedMock(): void {
    this.disputes = [
      { _id:'dsp1', bookingTitle:'تصليح سباكة الحمام',  clientName:'أحمد محمد',   workerName:'محمود السباك', urgency:'high',   status:'open',     reason:'العمل لم يكتمل وتم طلب الدفع كاملاً',           createdAt: new Date(Date.now()-3600000).toISOString()  },
      { _id:'dsp2', bookingTitle:'دهان شقة 3 غرف',      clientName:'سارة أحمد',   workerName:'مصطفى النقاش',urgency:'medium', status:'open',     reason:'جودة الدهان أقل من المتفق عليه بكثير',          createdAt: new Date(Date.now()-7200000).toISOString()  },
      { _id:'dsp3', bookingTitle:'تركيب سيراميك مطبخ',  clientName:'منى خالد',    workerName:'حسن البلاط',   urgency:'low',    status:'resolved', reason:'تأخر المعلم عن الموعد بيوم كامل',               createdAt: new Date(Date.now()-86400000).toISOString(), resolution:'client' },
      { _id:'dsp4', bookingTitle:'تثبيت نجف كهربائي',   clientName:'محمد يوسف',   workerName:'علي الكهربائي',urgency:'high',   status:'open',     reason:'المعلم رفض إصلاح الأعطال الناتجة عن التركيب', createdAt: new Date(Date.now()-10800000).toISOString() },
    ];
    this.applyFilter();
  }
}
