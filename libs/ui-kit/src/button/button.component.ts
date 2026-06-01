import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-busy]="loading || null"
      [attr.aria-disabled]="disabled || loading || null"
    >
      <span *ngIf="loading" class="btn-spinner" aria-hidden="true"></span>

      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      border-width: 1px;
      border-style: solid;
      font-family: inherit;
      appearance: none;
      -webkit-appearance: none;
      text-decoration: none;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);

      border-radius: var(--radius-md);
      font-weight: var(--btn-font-weight);

      transition: var(--transition-all);

      box-shadow: var(--shadow-xs);

      cursor: pointer;
      white-space: nowrap;

      position: relative;
      overflow: hidden;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-full-width {
      width: 100%;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Primary */

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      border-color: transparent;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }

    .btn-primary:active:not(:disabled) {
      background-color: var(--color-primary-dark);
    }

    /* Secondary */

    .btn-secondary {
      background-color: var(--color-neutral-0);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary-subtle);
    }

    .btn-secondary:active:not(:disabled) {
      background-color: var(--color-primary-muted);
    }

    /* Danger */

    .btn-danger {
      background-color: var(--color-error);
      color: var(--text-inverse);
      border-color: transparent;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: var(--color-error-dark);
    }

    .btn-danger:focus-visible {
      box-shadow: var(--shadow-focus-error) !important;
    }

    /* Ghost */

    .btn-ghost {
      background-color: transparent;
      color: var(--color-primary);
      border-color: transparent;
      box-shadow: none;
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-primary-subtle);
    }

    .btn-ghost:active:not(:disabled) {
      background-color: var(--color-primary-muted);
    }

    /* Sizes */

    .btn-sm {
      height: var(--btn-height-sm);
      padding-inline: var(--space-3);
      font-size: var(--text-sm);
    }

    .btn-md {
      height: var(--btn-height);
      padding-inline: var(--space-5);
      font-size: var(--text-base);
    }

    .btn-lg {
      height: var(--btn-height-lg);
      padding-inline: var(--space-6);
      font-size: var(--text-lg);
    }

    /* Loading */

    .btn-spinner {
      width: 1rem;
      height: 1rem;

      border: 2px solid currentColor;
      border-right-color: transparent;

      border-radius: 50%;

      animation: btn-spin .8s linear infinite;

      flex-shrink: 0;
    }

    @keyframes btn-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() type: ButtonType = 'button';

  get buttonClasses(): string {
    return [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : ''
    ]
      .filter(Boolean)
      .join(' ');
  }
}