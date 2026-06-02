import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceCategory } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: ServiceCategory[] = [
    {
      id: 'plumbing',
      name: 'سباكة',
      icon: 'plumbing',
      subcategories: [],
      nameAr: 'سباكة',
      slug: 'plumbing',
      isActive: true,
      serviceCount: 15,
    },
    {
      id: 'electrical',
      name: 'كهرباء',
      icon: 'flash_on',
      subcategories: [],
      nameAr: 'كهرباء',
      slug: 'electrical',
      isActive: true,
      serviceCount: 10,
    },
    {
      id: 'carpentry',
      name: 'نجارة',
      icon: 'handyman',
      subcategories: [],
      nameAr: 'نجارة',
      slug: 'carpentry',
      isActive: true,
      serviceCount: 8,
    },
    {
      id: 'painting',
      name: 'نقاشة ودهانات',
      icon: 'brush',
      subcategories: [],
      nameAr: 'نقاشة ودهانات',
      slug: 'painting',
      isActive: true,
      serviceCount: 12,
    },
  ];

  getAllCategories(): Observable<ServiceCategory[]> {
    return of(this.categories);
  }

  getCategoryById(id: string): Observable<ServiceCategory | undefined> {
    const category = this.categories.find((c) => c.id === id);
    return of(category);
  }
}
