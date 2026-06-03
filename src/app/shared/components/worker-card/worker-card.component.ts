import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WorkerSummary } from '../../models/worker-summary.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { TierBadgeComponent } from '../tier-badge/tier-badge.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-worker-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarComponent,
    TierBadgeComponent,
    StarRatingComponent,
    CurrencyFormatPipe,
  ],
  templateUrl: './worker-card.component.html',
  styles: [`
    .card-accent {
      height: 4px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    }
    .worker-card {
      transition: box-shadow 200ms ease, transform 200ms ease;
    }
    .worker-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-4px);
    }
    .btn-cta {
      transition: background-color 200ms ease;
    }
    .btn-cta:hover {
      background-color: var(--color-accent-dark);
    }
    .btn-arrow {
      transition: transform 200ms ease;
    }
    .btn-cta:hover .btn-arrow {
      transform: translateX(4px);
    }
  `]
})
export class WorkerCardComponent {
  @Input() worker!: WorkerSummary;
}