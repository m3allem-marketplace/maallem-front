import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  loading = false;
  categories: any[] = [];
  addingNew = false;
  newCategoryName = '';
  newCategoryIcon = '🛠️';

  iconOptions = ['🔧','⚡','🎨','🪚','🧱','❄️','🧹','📦','🔥','🏠','🚿','🪟'];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadCategories(); }

  loadCategories(): void {
    this.loading = true;
    this.api.get<any>('/categories').subscribe({
      next: (res) => {
        this.categories = res.data?.categories || res.data || [];
        this.loading = false;
      },
      error: () => { this.seedMock(); this.loading = false; }
    });
  }

  toggleStatus(cat: any): void {
    cat.isActive = !cat.isActive;
    this.api.patch<any>(`/categories/${cat._id}/status`, { isActive: cat.isActive })
      .subscribe({ error: () => { cat.isActive = !cat.isActive; } });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    const newCat = {
      _id: 'cat-new-' + Date.now(),
      name: this.newCategoryName,
      icon: this.newCategoryIcon,
      workerCount: 0,
      isActive: true
    };
    this.api.post<any>('/categories', { name: this.newCategoryName, icon: this.newCategoryIcon })
      .subscribe({
        next: (res) => {
          this.categories.unshift(res.data || newCat);
        },
        error: () => { this.categories.unshift(newCat); }
      });
    this.newCategoryName = '';
    this.addingNew = false;
  }

  private seedMock(): void {
    this.categories = [
      { _id:'c1', name:'سباكة',          icon:'🔧', workerCount: 87, isActive:true  },
      { _id:'c2', name:'كهرباء',          icon:'⚡', workerCount: 65, isActive:true  },
      { _id:'c3', name:'دهانات',          icon:'🎨', workerCount: 54, isActive:true  },
      { _id:'c4', name:'نجارة',           icon:'🪚', workerCount: 41, isActive:true  },
      { _id:'c5', name:'سيراميك وبلاط',   icon:'🧱', workerCount: 33, isActive:true  },
      { _id:'c6', name:'تكييف وتبريد',    icon:'❄️', workerCount: 28, isActive:false },
      { _id:'c7', name:'تنظيف',           icon:'🧹', workerCount: 22, isActive:true  },
      { _id:'c8', name:'حدادة ولحام',     icon:'🔥', workerCount: 18, isActive:false },
    ];
  }
}
