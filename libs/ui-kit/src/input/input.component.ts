import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="!!errorMessage">

      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
      </label>

      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="input-field"
      />

      <span *ngIf="hint && !errorMessage" class="input-hint">
        {{ hint }}
      </span>

      <span *ngIf="!!errorMessage" class="input-error">
        {{ errorMessage }}
      </span>

    </div>
  `,
  styles: [`
    .input-wrapper {
      display:        flex;
      flex-direction: column;
      gap:            var(--space-1);
      width:          100%;
    }

    /* ── Label ── */
    .input-label {
      font-size:    var(--text-sm);
      font-weight:  var(--font-medium);
      color:        var(--text-primary);
      cursor:       pointer;
    }

    /* ── Field ── */
    .input-field {
      width:            100%;
      height:           var(--input-height);
      padding:          0 var(--input-padding-x);
      font-family:      var(--font-sans);
      font-size:        var(--text-base);
      color:            var(--text-body);
      background-color: var(--input-bg);
      border:           var(--border-width) solid var(--input-border);
      border-radius:    var(--input-radius);
      outline:          none;
      transition:       var(--transition-color), var(--transition-shadow);
    }

    .input-field::placeholder {
      color: var(--text-placeholder);
    }

    .input-field:focus {
      border-color: var(--border-color-focus);
      box-shadow:   var(--shadow-focus);
    }

    .input-field:disabled {
      background-color: var(--color-neutral-100);
      color:            var(--text-disabled);
      cursor:           not-allowed;
    }

    /* ── Error state ── */
    .has-error .input-field {
      border-color: var(--border-color-error);
    }

    .has-error .input-field:focus {
      box-shadow: var(--shadow-focus-error);
    }

    /* ── Hint ── */
    .input-hint {
      font-size: var(--text-sm);
      color:     var(--text-secondary);
    }

    /* ── Error message ── */
    .input-error {
      font-size: var(--text-sm);
      color:     var(--color-error);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label:        string = '';
  @Input() placeholder:  string = '';
  @Input() hint:         string = '';
  @Input() errorMessage: string = '';
  @Input() type:         string = 'text';

  value:      string  = '';
  isDisabled: boolean = false;

  private static idCounter = 0;
  inputId = `app-input-${++InputComponent.idCounter}`;

  private onChange  = (_: string) => {};
  onTouched = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
}