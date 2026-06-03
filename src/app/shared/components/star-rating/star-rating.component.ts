import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styles: [`
    .star-wrap {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    .star {
      position: absolute;
      inset: 0;
      width: 20px;
      height: 20px;
    }

    .star--empty {
      fill: var(--color-neutral-300);
    }

    .star--full {
      fill: #fbbf24;
    }
  `]
})
export class StarRatingComponent {

  @Input() rating = 0;
  @Input() readonly = true;

  @Output()
  ratingChange = new EventEmitter<number>();

  hoverRating = 0;

  stars = [1, 2, 3, 4, 5];

  getClip(star: number): string {

    const active = this.hoverRating || this.rating;

    let percent = 0;

    if (active >= star) {
      percent = 100;
    }
    else if (active >= star - 0.5) {
      percent = 50;
    }

    return `inset(0 ${100 - percent}% 0 0)`;
  }

  onHover(star: number): void {
    if (!this.readonly) {
      this.hoverRating = star;
    }
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