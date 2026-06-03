import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipComponent),
      multi: true
    }
  ],
  template: `
    <span class="chip">

      <span class="chip-label">
        {{ label }}
      </span>

      @if (removable) {
        <button
          type="button"
          class="chip-remove"
          [attr.aria-label]="'Remove ' + label"
          (click)="onRemove()"
        >
          ×
        </button>
      }

    </span>
  `,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      padding: 6px 12px;

      border-radius: 999px;

      background: var(--color-primary-subtle);
      border: 1px solid var(--color-primary-muted);

      color: var(--color-primary);

      font-size: var(--text-sm);
      font-weight: var(--font-medium);

      transition: var(--transition-all);
    }

    .chip-label {
      line-height: 1;
    }

    .chip-remove {
      border: none;
      background: transparent;

      cursor: pointer;

      color: inherit;

      padding: 0;

      font-size: 12px;
      line-height: 1;

      opacity: .7;
    }

    .chip-remove:hover {
      opacity: 1;
    }
  `]
})
export class ChipComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() removable = false;

  @Output() removed = new EventEmitter<void>();

  private onChange = (_: string) => {};
  private onTouched = () => {};

  onRemove(): void {
    this.removed.emit();
  }

  writeValue(value: string): void {
    this.label = value ?? '';
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}