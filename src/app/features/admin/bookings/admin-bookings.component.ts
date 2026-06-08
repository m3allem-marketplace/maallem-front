import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  loading = false;
  bookings: any[] = [];
  filteredBookings: any[] = [];
  searchQuery = '';
  filterStatus = '';

  statusOptions = [
    { value: '',           label: 'كل الحالات' },
    { value: 'open',       label: 'مفتوح' },
    { value: 'in-progress',label: 'قيد التنفيذ' },
    { value: 'completed',  label: 'مكتمل' },
    { value: 'cancelled',  label: 'ملغي' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadBookings(); }

  loadBookings(): void {
    this.loading = true;
    this.api.get<any>('/admin/bookings').subscribe({
      next: (res) => {
        this.bookings = res.data?.bookings || res.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.seedMock(); this.loading = false; }
    });
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(b => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || b.title?.toLowerCase().includes(q) || b.clientName?.toLowerCase().includes(q);
      const matchStatus = !this.filterStatus || b.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  onSearch(val: string): void { this.searchQuery = val; this.applyFilters(); }
  onStatusFilter(val: string): void { this.filterStatus = val; this.applyFilters(); }

  getStatusLabel(s: string): string {
    const m: Record<string,string> = { open:'مفتوح', 'in-progress':'جاري', completed:'مكتمل', cancelled:'ملغي', closed:'مغلق' };
    return m[s] || s;
  }

  getStatusColor(s: string): string {
    const m: Record<string,string> = { open:'#3b82f6', 'in-progress':'#f59e0b', completed:'#22c55e', cancelled:'#ef4444', closed:'#888' };
    return m[s] || '#888';
  }

  private seedMock(): void {
    this.bookings = [
      { _id:'b1', title:'تصليح سباكة الحمام',         clientName:'أحمد محمد',   workerName:'محمود السباك',   budget:450,  status:'completed',   createdAt: new Date(Date.now()-86400000*1).toISOString() },
      { _id:'b2', title:'تثبيت نجف كهربائي',          clientName:'سارة أحمد',   workerName:'علي الكهربائي', budget:300,  status:'in-progress', createdAt: new Date(Date.now()-86400000*2).toISOString() },
      { _id:'b3', title:'دهان شقة 3 غرف',             clientName:'منى خالد',    workerName:'مصطفى النقاش',  budget:1800, status:'open',        createdAt: new Date(Date.now()-86400000*3).toISOString() },
      { _id:'b4', title:'تركيب سيراميك مطبخ',          clientName:'محمد يوسف',   workerName:'حسن البلاط',    budget:700,  status:'cancelled',   createdAt: new Date(Date.now()-86400000*4).toISOString() },
      { _id:'b5', title:'صيانة تكييف مركزي',           clientName:'علي إبراهيم', workerName:'كريم التبريد',  budget:500,  status:'completed',   createdAt: new Date(Date.now()-86400000*5).toISOString() },
      { _id:'b6', title:'تركيب غرفة نوم كاملة',        clientName:'سارة أحمد',   workerName:'أحمد النجار',   budget:3500, status:'in-progress', createdAt: new Date(Date.now()-86400000*6).toISOString() },
    ];
    this.applyFilters();
  }
}
