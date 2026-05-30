import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styles: [`
    .stars {
      display:     inline-flex;
      align-items: center;
      gap:         2px;
    }

    .star {
      position:    relative;
      display:     inline-block;
      width:       1.25em;
      height:      1.25em;
      font-size:   1.25rem;
      line-height: 1;
      cursor:      default;
    }

    .star--clickable { cursor: pointer; }

    /* empty star (background) */
    .star__empty,
    .star__full {
      position: absolute;
      inset:    0;
      display:  flex;
      align-items: center;
    }

    .star__empty { color: var(--color-neutral-300); }
    .star__full  { color: var(--color-accent); overflow: hidden; }

    /* full  → show 100% */
    .star--full  .star__full { width: 100%; }
    /* half  → show 50%  */
    .star--half  .star__full { width: 50%;  }
    /* empty → show 0%   */
    .star--empty .star__full { width: 0%;   }

    /* hover tint in write mode */
    .star--hovered .star__full,
    .star--hovered .star__empty { color: var(--color-accent-light); }
  `]
})
export class StarRatingComponent {
  @Input()  rating:   number  = 0;
  @Input()  readonly: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number = 0;
  stars = [1, 2, 3, 4, 5];

  getStarClass(star: number): string {
    const active = this.hoverRating || this.rating;
    let state: string;
    if (active >= star)        state = 'full';
    else if (active >= star - 0.5) state = 'half';
    else                           state = 'empty';

    const hovered = !this.readonly && this.hoverRating >= star ? 'star--hovered' : '';
    return `star star--${state} ${this.readonly ? '' : 'star--clickable'} ${hovered}`;
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