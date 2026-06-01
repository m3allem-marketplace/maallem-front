import {
  Component,
  Input,
  forwardRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper">

      <label
        *ngIf="label"
        class="input-label"
        [for]="inputId"
      >
        {{ label }}
      </label>

      <input
        class="input-field"
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <div
        *ngIf="errorMessage"
        class="input-error"
      >
        {{ errorMessage }}
      </div>

      <div
        *ngIf="!errorMessage && hint"
        class="input-hint"
      >
        {{ hint }}
      </div>

    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      width: 100%;
    }

    .input-label {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      cursor: pointer;
      margin-bottom: 2px;
    }

    .input-field {
      width: 100%;
      height: var(--input-height);

      padding-inline: var(--input-padding-x);

      border: 1px solid var(--input-border);
      border-radius: var(--radius-md);

      background-color: var(--input-bg);
      color: var(--text-body);

      box-shadow: var(--shadow-xs);

      transition: var(--transition-all);
    }

    .input-field:hover {
      border-color: var(--color-primary-300);
    }

    .input-field:focus {
      outline: none;
    }

    .input-field:focus-visible {
      border-color: var(--border-color-focus);
      box-shadow:
        var(--shadow-focus),
        var(--shadow-sm);
    }

    .input-field:disabled {
      background-color: var(--color-neutral-100);
      color: var(--text-disabled);
      cursor: not-allowed;
      box-shadow: none;
    }

    .input-hint {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      padding-inline: 2px;
    }

    .input-error {
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      color: var(--color-error);
      padding-inline: 2px;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() type = 'text';

  value = '';
  disabled = false;

  inputId = `input-${Math.random().toString(36).slice(2, 9)}`;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;
    this.onChange(value);
  }
}