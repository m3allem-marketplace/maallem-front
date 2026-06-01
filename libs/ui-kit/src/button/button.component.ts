import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize    = 'sm' | 'md' | 'lg';
type ButtonType    = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="classes"
    >
      <span *ngIf="loading" class="btn-spinner" aria-hidden="true"></span>
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      display:          inline-flex;
      align-items:      center;
      justify-content:  center;
      gap:              var(--space-2);
      border:           none;
      cursor:           pointer;
      font-family:      var(--font-sans);
      font-weight:      var(--font-semibold);
      border-radius:    var(--btn-radius);
      transition:       var(--transition-color), var(--transition-shadow);
      white-space:      nowrap;
      text-decoration:  none;
      outline:          none;
    }

    /* ── Focus ring ── */
    button:focus-visible {
      box-shadow: var(--shadow-focus);
    }

    /* ── Sizes ── */
    button.btn-sm {
      height:     var(--btn-height-sm);
      padding:    0 var(--space-3);
      font-size:  var(--text-sm);
    }
    button.btn-md {
      height:     var(--btn-height);
      padding:    0 var(--space-4);
      font-size:  var(--text-base);
    }
    button.btn-lg {
      height:     var(--btn-height-lg);
      padding:    0 var(--space-6);
      font-size:  var(--text-lg);
    }

    /* ── Full width ── */
    button.btn-full {
      width: 100%;
    }

    /* ── Variants ── */

    /* Primary */
    button.btn-primary {
      background-color: var(--color-primary);
      color:            var(--text-inverse);
    }
    button.btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }
    button.btn-primary:active:not(:disabled) {
      background-color: var(--color-primary-dark);
    }

    /* Secondary */
    button.btn-secondary {
      background-color: var(--color-neutral-0);
      color:            var(--color-primary);
      border:           var(--border-width) solid var(--color-primary);
    }
    button.btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary-subtle);
    }
    button.btn-secondary:active:not(:disabled) {
      background-color: var(--color-primary-muted);
    }

    /* Danger */
    button.btn-danger {
      background-color: var(--color-error);
      color:            var(--text-inverse);
    }
    button.btn-danger:hover:not(:disabled) {
      background-color: var(--color-error-dark);
    }
    button.btn-danger:focus-visible {
      box-shadow: var(--shadow-focus-error);
    }

    /* Ghost */
    button.btn-ghost {
      background-color: transparent;
      color:            var(--color-primary);
    }
    button.btn-ghost:hover:not(:disabled) {
      background-color: var(--color-primary-subtle);
    }
    button.btn-ghost:active:not(:disabled) {
      background-color: var(--color-primary-muted);
    }

    /* ── Disabled ── */
    button:disabled {
      background-color: var(--color-primary-muted);
      color:            var(--text-disabled);
      border-color:     transparent;
      cursor:           not-allowed;
      opacity:          0.6;
    }

    /* ── Spinner ── */
    .btn-spinner {
      display:        inline-block;
      width:          1em;
      height:         1em;
      border:         2px solid currentColor;
      border-top-color: transparent;
      border-radius:  var(--radius-full);
      animation:      btn-spin 0.7s linear infinite;
      flex-shrink:    0;
    }

    @keyframes btn-spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant:   ButtonVariant = 'primary';
  @Input() size:      ButtonSize    = 'md';
  @Input() loading:   boolean       = false;
  @Input() disabled:  boolean       = false;
  @Input() fullWidth: boolean       = false;
  @Input() type:      ButtonType    = 'button';

  get classes(): string {
    return [
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full' : '',
      this.loading   ? 'btn-loading' : '',
    ].filter(Boolean).join(' ');
  }
}