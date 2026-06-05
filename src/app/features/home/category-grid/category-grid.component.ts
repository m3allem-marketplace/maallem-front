import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../shared/models/category.model';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
const ICON_MAP: Record<string, string> = {
  plumbing:    'plumbing',
  electrical:  'electrical',
  carpentry:   'carpentry',
  painting:    'painting',
  ac:          'ac',
  cleaning:    'cleaning',
  moving:      'moving',
  tiling:      'tiling',
};

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
    this.activeCategory?.id === cat.id
      ? null
      : cat;
}

  navigateTo(cat: Category): void {
    this.router.navigate(['/workers'], { queryParams: { category: cat.id } });
  }

  resolveIcon(icon: string): string {
    return ICON_MAP[icon] ?? 'default';
  }
}