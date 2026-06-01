import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'spinner-sm',
  md: 'spinner-md',
  lg: 'spinner-lg'
};

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (fullPage) {

      <div
        class="spinner-overlay"
        aria-label="Loading"
        role="status"
      >
        <span
          class="spinner"
          [class]="sizeClass"
        ></span>
      </div>

    } @else {

      <span
        class="spinner"
        [class]="sizeClass"
        aria-label="Loading"
        role="status"
      ></span>

    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      background: var(--bg-overlay);

      backdrop-filter: blur(4px);

      z-index: var(--z-overlay);
    }

    .spinner {
      display: inline-block;

      border-style: solid;
      border-radius: 50%;

      border-color: var(--color-primary-muted);
      border-top-color: var(--color-primary);

      animation: spin .7s linear infinite;

      flex-shrink: 0;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }

    .spinner-md {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .spinner-lg {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class SpinnerComponent {

  @Input() fullPage = false;
  @Input() size: SpinnerSize = 'md';

  get sizeClass(): string {
    return SIZE_CLASSES[this.size];
  }
}