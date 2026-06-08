import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  loading = false;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  filterRole = '';
  selectedUser: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.api.get<any>('/admin/users').subscribe({
      next: (res) => {
        this.users = res.data?.users || res.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.seedMock();
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(u => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchRole   = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  onSearch(val: string): void { this.searchQuery = val; this.applyFilters(); }
  onRoleFilter(val: string): void { this.filterRole = val; this.applyFilters(); }

  selectUser(user: any): void { this.selectedUser = user; }
  closeDetail(): void { this.selectedUser = null; }

  toggleUserStatus(user: any): void {
    user.isActive = !user.isActive;
    this.api.patch<any>(`/admin/users/${user._id}/status`, { isActive: user.isActive })
      .subscribe({ error: () => { user.isActive = !user.isActive; } });
  }

  getRoleLabel(role: string): string {
    const m: Record<string, string> = { user: 'عميل', worker: 'معلم', company: 'شركة', admin: 'مشرف' };
    return m[role] || role;
  }

  getRoleColor(role: string): string {
    const m: Record<string, string> = { user: '#3b82f6', worker: '#16a34a', company: '#7c3aed', admin: '#ef4444' };
    return m[role] || '#888';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private seedMock(): void {
    this.users = [
      { _id: 'u1', name: 'أحمد محمد',     email: 'ahmed@mail.com',   role: 'user',   isActive: true,  createdAt: new Date(Date.now()-86400000*2).toISOString(), totalBookings: 5  },
      { _id: 'u2', name: 'محمود السباك',   email: 'mahmoud@mail.com', role: 'worker', isActive: true,  createdAt: new Date(Date.now()-86400000*5).toISOString(), totalBookings: 23 },
      { _id: 'u3', name: 'سارة أحمد',      email: 'sara@mail.com',    role: 'user',   isActive: true,  createdAt: new Date(Date.now()-86400000*7).toISOString(), totalBookings: 2  },
      { _id: 'u4', name: 'شركة المدينة',   email: 'city@corp.com',    role: 'company',isActive: false, createdAt: new Date(Date.now()-86400000*10).toISOString(),totalBookings: 41 },
      { _id: 'u5', name: 'علي الكهربائي', email: 'ali@mail.com',     role: 'worker', isActive: true,  createdAt: new Date(Date.now()-86400000*12).toISOString(),totalBookings: 17 },
      { _id: 'u6', name: 'منى خالد',       email: 'mona@mail.com',    role: 'user',   isActive: true,  createdAt: new Date(Date.now()-86400000*14).toISOString(),totalBookings: 8  },
    ];
    this.applyFilters();
  }
}
