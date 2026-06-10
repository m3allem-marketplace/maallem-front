import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../shared/models/category.model';

// =====================================================
// ضيف الـ URLs بتاعتك هنا
// =====================================================
const CATEGORY_IMAGES: Record<string, string> = {
  plumbing:   'https://i.pinimg.com/1200x/64/48/ac/6448ac9127092a01045daf088ece959d.jpg',
  electrical: 'https://i.pinimg.com/1200x/d3/d2/2a/d3d22a0bbf45ae94ae53229087c6d36d.jpg',
  carpentry:  'https://i.pinimg.com/1200x/f9/72/ec/f972ec4c7c312f1254b842d91057b1bc.jpg',
  painting:   'https://i.pinimg.com/1200x/91/e7/00/91e7001f7faa1774127ad29cec93eed4.jpg',
  ac:         'https://i.pinimg.com/736x/71/7c/7f/717c7faf69e9fa56ca4f9a4bdcf1014a.jpg',
  cleaning:   'https://i.pinimg.com/736x/cc/47/eb/cc47ebca01cad1adf413f2ae7c0ec99e.jpg',
  moving:     'https://i.pinimg.com/1200x/f6/63/62/f6636227a53cebc36201055eb569a899.jpg',
  tiling:     'https://i.pinimg.com/1200x/61/7c/3d/617c3da2863d8711b8a34dd95446f94e.jpg',
  default:    'https://i.pinimg.com/736x/59/1c/c7/591cc75482712a4093e0baeda68a9776.jpg',
};
// =====================================================

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
})
export class CategoryGridComponent {
  @Input() categories: Category[] = [];

  activeCategory: Category | null = null;

  constructor(private router: Router) {}

  setActive(cat: Category): void {
    this.activeCategory =
      this.activeCategory?.id === cat.id ? null : cat;
  }

  navigateTo(cat: Category): void {
    this.router.navigate(['/workers'], { queryParams: { category: cat.id } });
  }

  getCategoryImage(icon: string): string {
    return CATEGORY_IMAGES[icon] ?? CATEGORY_IMAGES['default'];
  }

  getCardSize(index: number): string {
    const sizes = ['featured', 'tall', 'medium', 'small', 'wide', 'small', 'small', 'small'];
    return sizes[index] ?? 'small';
  }

  formatIndex(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}