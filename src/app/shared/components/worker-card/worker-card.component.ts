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
    :host { display: block; }

    .worker-card {
      background:    var(--card-bg);
      border:        var(--border-width) solid var(--card-border);
      border-radius: var(--card-radius);
      box-shadow:    var(--card-shadow);
      overflow:      hidden;
      transition:    box-shadow var(--transition-base),
                     transform  var(--transition-base);
      direction:     ltr;
      width:         300px;
    }

    .worker-card:hover {
      box-shadow: var(--card-shadow-hover);
      transform:  translateY(-4px);
    }

    .worker-card__accent {
      height:     4px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    }

    .worker-card__body {
      padding:        var(--space-6);
      display:        flex;
      flex-direction: column;
      gap:            var(--space-4);
    }

    .worker-card__header {
      display:     flex;
      align-items: flex-start;
      gap:         var(--space-3);
    }

    .worker-card__info {
      flex:    1;
      display: flex;
      flex-direction: column;
      gap:     var(--space-1);
      overflow: hidden;
    }

    .worker-card__name {
      font-size:     var(--text-lg);
      font-weight:   var(--font-bold);
      color:         var(--text-primary);
      margin:        0;
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }

    .worker-card__category {
      font-size: var(--text-sm);
      color:     var(--text-secondary);
      margin:    0;
    }

    .worker-card__rating {
      display:     flex;
      align-items: center;
      gap:         var(--space-2);
    }

    .worker-card__rating-value {
      font-size:   var(--text-sm);
      font-weight: var(--font-medium);
      color:       var(--text-secondary);
    }

    .worker-card__divider {
      height:     1px;
      background: var(--border-color);
    }

    .worker-card__footer {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      gap:             var(--space-4);
    }

    .worker-card__rate-wrapper {
      display:        flex;
      flex-direction: column;
      min-width:      0;
    }

    .worker-card__rate-label {
      font-size: var(--text-xs);
      color:     var(--text-secondary);
    }

    .worker-card__rate {
      font-size:   var(--text-xl);
      font-weight: var(--font-bold);
      color:       var(--color-primary);
      white-space: nowrap;
    }

    .worker-card__btn {
      display:         inline-flex;
      align-items:     center;
      gap:             var(--space-2);
      padding:         var(--space-2) var(--space-4);
      background:      var(--color-accent);
      color:           var(--color-primary-dark);
      border-radius:   var(--btn-radius);
      font-size:       var(--text-sm);
      font-weight:     var(--font-bold);
      text-decoration: none;
      white-space:     nowrap;
      flex-shrink:     0;
      transition:      background-color var(--transition-base);
    }

    .worker-card__btn:hover {
      background-color: var(--color-accent-dark);
    }

    .worker-card__btn-arrow {
      display:    inline-block;
      transition: transform var(--transition-base);
    }

    .worker-card__btn:hover .worker-card__btn-arrow {
      transform: translateX(4px);
    }
  `]
})
export class WorkerCardComponent {
  @Input() worker!: WorkerSummary;
}