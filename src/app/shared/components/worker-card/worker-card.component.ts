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
    /* Task Standard Base Styles */
    .card-accent {
      height: 4px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    }
    
    /* Premium M-CARD Architecture */
    .m-card {
      position: relative;
      width: 100%;
      max-width: 380px;
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.02);
      transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
      direction: rtl;
    }

    .m-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-primary-200);
      box-shadow: var(--shadow-hover);
    }

    .m-card__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: var(--space-5);
    }

    .m-card__avatar-wrapper {
      position: relative;
      display: inline-flex;
      margin-bottom: var(--space-3);
      border: 2px solid var(--bg-surface);
      border-radius: var(--radius-full);
    }

    .m-card__tier-tag {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      z-index: var(--z-raised);
    }

    .m-card__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .m-card__name {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: 0;
      font-family: var(--font-arabic);
    }

    .m-card__cat-wrapper {
      display: block;
    }

    .m-card__cat {
      display: inline-flex;
      padding: 3px var(--space-3);
      background: rgba(0, 75, 145, 0.06);
      color: #004b91;
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      font-family: var(--font-arabic);
    }

    .m-card__rating {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: var(--space-3);
      background: var(--bg-surface-alt);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
    }

    .m-card__count {
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
      color: var(--text-secondary);
    }

    .m-card__meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
      width: 100%;
    }

    .m-card__meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-family: var(--font-arabic);
    }

    .m-card__meta-item svg {
      color: var(--text-muted);
    }

    .m-card__meta-dot {
      width: 4px;
      height: 4px;
      background-color: var(--border-color-thick);
      border-radius: var(--radius-full);
    }

    .m-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-5);
      border-top: 1px solid var(--border-color);
      gap: var(--space-2);
    }

    /* Fixed Price Wrapper to prevent text cutting or shifting */
    .m-card__price-wrapper {
      display: flex;
      align-items: baseline;
      gap: 2px;
      white-space: nowrap; /* Prevents EGP and 130 from wrapping on two rows */
      flex-shrink: 0; /* Ensures the button never squishes the price */
    }

    .m-card__amount {
      font-size: var(--text-xl);
      font-weight: var(--font-extrabold);
      color: var(--color-primary);
      line-height: var(--leading-tight);
      font-family: var(--font-sans), system-ui; /* Safe fallback for mixed alphanumeric text */
    }

    .m-card__unit {
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      color: var(--text-secondary);
      font-family: var(--font-arabic);
    }

    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      height: var(--btn-height); 
      padding: 0 var(--space-3);
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
      font-family: var(--font-arabic);
      cursor: pointer;
      text-decoration: none;
      transition: background-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
      white-space: nowrap;
      flex-grow: 1; /* Allows button to dynamically occupy remaining space nicely */
      max-width: 180px;
      justify-content: center;
      border: 2px solid transparent;
    }

    .hero-btn--primary {
      background: var(--color-accent);
      color: var(--color-primary-900);
      border-color: var(--color-accent);
    }

    .hero-btn--primary:hover {
      background: var(--color-accent-dark);
      border-color: var(--color-accent-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 180, 0, 0.25);
    }

    .hero-btn:hover svg {
      transform: translateX(-3px);
      transition: transform 150ms ease;
    }
  `]
})
export class WorkerCardComponent {
  @Input() worker!: WorkerSummary;
}