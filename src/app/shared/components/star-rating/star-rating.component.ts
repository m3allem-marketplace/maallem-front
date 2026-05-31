import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="stars"
      [attr.aria-label]="rating + ' out of 5 stars'"
      role="img"
      (mouseleave)="onLeave()"
    >
      <span
        *ngFor="let star of stars"
        class="star-wrap"
        [class.star-wrap--clickable]="!readonly"
        (mouseenter)="onHover(star)"
        (click)="onClick(star)"
      >
        <!-- Background: empty star -->
        <svg class="star star--empty" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <!-- Foreground: filled star clipped to percentage -->
        <svg class="star star--full" viewBox="0 0 24 24" [style.clip-path]="getClip(star)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>
    </div>
  `,
  styles: [`
    .stars {
      display:     inline-flex;
      align-items: center;
      gap:         3px;
    }

    .star-wrap {
      position: relative;
      display:  inline-block;
      width:    20px;
      height:   20px;
    }

    .star-wrap--clickable { cursor: pointer; }

    .star {
      position: absolute;
      top:      0;
      left:     0;
      width:    20px;
      height:   20px;
    }

    .star--empty { fill: var(--color-neutral-300); }
    .star--full  { fill: var(--color-accent); }
  `]
})
export class StarRatingComponent {
  @Input()  rating:   number  = 0;
  @Input()  readonly: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number = 0;
  stars = [1, 2, 3, 4, 5];

  getClip(star: number): string {
    const active = this.hoverRating || this.rating;
    let pct: number;
    if (active >= star)            pct = 100;
    else if (active >= star - 0.5) pct = 50;
    else                           pct = 0;
    return `inset(0 ${100 - pct}% 0 0)`;
  }

  onHover(star: number): void {
    if (!this.readonly) this.hoverRating = star;
  }

  onLeave(): void {
    this.hoverRating = 0;
  }

  onClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }
}