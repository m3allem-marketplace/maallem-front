import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="fullPage; else inline" class="spinner-overlay" aria-label="Loading" role="status">
      <span class="spinner" [class]="'spinner--' + size"></span>
    </div>

    <ng-template #inline>
      <span class="spinner" [class]="'spinner--' + size" aria-label="Loading" role="status"></span>
    </ng-template>
  `,
  styles: [`
    /* ── Full-page overlay ── */
    .spinner-overlay {
      position:         fixed;
      inset:            0;
      z-index:          var(--z-overlay);
      background-color: var(--bg-overlay);
      display:          flex;
      align-items:      center;
      justify-content:  center;
    }

    /* ── Spinner ring ── */
    .spinner {
      display:       inline-block;
      border-style:  solid;
      border-color:  var(--color-primary-muted);
      border-top-color: var(--color-primary);
      border-radius: var(--radius-full);
      animation:     spin 0.7s linear infinite;
      flex-shrink:   0;
    }

    /* ── Sizes ── */
    .spinner--sm {
      width:        16px;
      height:       16px;
      border-width: 2px;
    }

    .spinner--md {
      width:        32px;
      height:       32px;
      border-width: 3px;
    }

    .spinner--lg {
      width:        48px;
      height:       48px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() fullPage: boolean      = false;
  @Input() size:     SpinnerSize  = 'md';
}