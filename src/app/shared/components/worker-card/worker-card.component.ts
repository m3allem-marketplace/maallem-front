import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WorkerSummary } from '../../models/worker-summary.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { TierBadgeComponent } from '../tier-badge/tier-badge.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

/** Category → color palette map */
const CATEGORY_PALETTES: Record<string, { bg: string; shadow: string; text: string; badge: string }> = {
  'plumbing':    { bg: '#2563EB', shadow: 'rgba(37,99,235,0.35)',    text: '#fff', badge: '#eff6ff' },
  'electricity': { bg: '#F59E0B', shadow: 'rgba(245,158,11,0.35)',   text: '#fff', badge: '#fffbeb' },
  'painting':    { bg: '#8B5CF6', shadow: 'rgba(139,92,246,0.35)',   text: '#fff', badge: '#f5f3ff' },
  'carpentry':   { bg: '#EA580C', shadow: 'rgba(234,88,12,0.35)',    text: '#fff', badge: '#fff7ed' },
  'tiling':      { bg: '#0D9488', shadow: 'rgba(13,148,136,0.35)',   text: '#fff', badge: '#f0fdfa' },
  'hvac':        { bg: '#0284C7', shadow: 'rgba(2,132,199,0.35)',    text: '#fff', badge: '#e0f2fe' },
  'cleaning':    { bg: '#16A34A', shadow: 'rgba(22,163,74,0.35)',    text: '#fff', badge: '#f0fdf4' },
  'welding':     { bg: '#DC2626', shadow: 'rgba(220,38,38,0.35)',    text: '#fff', badge: '#fef2f2' },
  'moving':      { bg: '#CA8A04', shadow: 'rgba(202,138,4,0.35)',    text: '#fff', badge: '#fefce8' },
};

const DEFAULT_PALETTE = { bg: '#1B2B6E', shadow: 'rgba(27,43,110,0.35)', text: '#fff', badge: '#eff3ff' };

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
    :host { display: block; width: 100%; }

    /* ═══════════════════════════════════════════════════
       WORKER CARD — Split-color layout, reference design
    ═══════════════════════════════════════════════════ */

    .wc {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      background: #ffffff;
      border-radius: 22px;
      overflow: hidden;
      cursor: pointer;
      direction: rtl;
      font-family: 'Cairo', sans-serif;
      box-shadow:
        0 4px 16px rgba(0,0,0,0.08),
        0 1px 4px rgba(0,0,0,0.04);
      transition:
        transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
        box-shadow 0.3s ease;
      will-change: transform;
      text-decoration: none;
      color: inherit;
    }

    .wc:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow:
        0 16px 48px rgba(0,0,0,0.14),
        0 4px 16px rgba(0,0,0,0.08);
    }

    /* ── Colored top section ── */
    .wc__top {
      position: relative;
      padding: 22px 20px 56px 20px;
      min-height: 155px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: visible;
    }

    /* Decorative wave / curve at bottom of colored section */
    .wc__top::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: #ffffff;
      border-radius: 50% 50% 0 0 / 30px 30px 0 0;
      z-index: 1;
    }

    /* ── Worker name in colored area ── */
    .wc__name {
      font-size: 1.05rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 6px;
      line-height: 1.25;
      letter-spacing: -0.2px;
      position: relative;
      z-index: 2;
      text-shadow: 0 1px 8px rgba(0,0,0,0.2);
    }

    .wc__sub {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgba(255,255,255,0.78);
      line-height: 1.5;
      margin: 0;
      position: relative;
      z-index: 2;
    }

    /* ── Price badge (white circle in top-right) ── */
    .wc__price-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 3;
      box-shadow: 0 3px 14px rgba(0,0,0,0.15);
      line-height: 1;
    }

    .wc__price-amount {
      font-size: 0.78rem;
      font-weight: 900;
      color: #0f1f4d;
      font-family: system-ui, sans-serif;
      white-space: nowrap;
    }

    .wc__price-unit {
      font-size: 0.55rem;
      font-weight: 600;
      color: #8892a4;
      white-space: nowrap;
    }

    /* ── Floating avatar (overlaps top/bottom boundary) ── */
    .wc__avatar-zone {
      position: absolute;
      bottom: -38px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .wc__avatar-ring {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      padding: 3px;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }

    .wc:hover .wc__avatar-ring {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }

    .wc__tier {
      margin-top: -8px;
      position: relative;
      z-index: 12;
    }

    /* ── Bottom white section ── */
    .wc__bottom {
      padding: 50px 20px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      background: #ffffff;
    }

    /* ── Category pill ── */
    .wc__category {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* ── Star rating row ── */
    .wc__rating-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .wc__rating-score {
      font-size: 0.78rem;
      font-weight: 800;
      color: #0f1f4d;
    }

    .wc__rating-count {
      font-size: 0.68rem;
      color: #9aa3bc;
      font-weight: 500;
    }

    /* ── Location ── */
    .wc__location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #8892a4;
    }

    .wc__location svg { opacity: 0.7; }

    /* ── Separator dots ── */
    .wc__dots {
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      opacity: 0.22;
      transition: opacity 0.2s;
    }

    .dot.active {
      opacity: 1;
      width: 20px;
      border-radius: 4px;
    }

    /* ── CTA Button ── */
    .wc__cta {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      width: 100%;
      justify-content: center;
      padding: 11px 20px;
      background: #1B2B6E;
      color: #ffffff;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 800;
      text-decoration: none;
      border: none;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      transition:
        background 0.25s ease,
        transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
        box-shadow 0.25s ease;
    }

    .wc:hover .wc__cta {
      background: #0f1f4d;
      box-shadow: 0 6px 20px rgba(27,43,110,0.35);
      transform: translateY(-1px);
    }

    .wc__cta svg {
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
      flex-shrink: 0;
    }

    .wc:hover .wc__cta svg {
      transform: translateX(-3px);
    }
  `]
})
export class WorkerCardComponent {
  @Input() worker!: WorkerSummary;

  get palette() {
    const key = (this.worker?.category || '').toLowerCase();
    return CATEGORY_PALETTES[key] ?? DEFAULT_PALETTE;
  }

  /** Generate 5 dots for rating visual */
  get ratingDots(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isActiveDot(i: number): boolean {
    return i <= Math.round(this.worker?.rating ?? 0);
  }

  get cityLabel(): string {
    return (this.worker as any)?.city ?? 'القاهرة';
  }

  get categoryLabel(): string {
    const MAP: Record<string, string> = {
      plumbing: 'سباكة', electricity: 'كهرباء', painting: 'دهانات',
      carpentry: 'نجارة', tiling: 'سيراميك', hvac: 'تكييفات',
      cleaning: 'تنظيف', welding: 'حدادة', moving: 'نقل عفش',
    };
    return MAP[(this.worker?.category || '').toLowerCase()] ?? this.worker?.category ?? 'حرفي';
  }
}