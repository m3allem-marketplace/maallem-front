import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipComponent),
      multi: true,
    },
  ],
  template: `
    <span class="chip" [class.chip--removable]="removable">
      <span class="chip__label">{{ label }}</span>
      <button
        *ngIf="removable"
        class="chip__remove"
        (click)="onRemove()"
        aria-label="Remove {{ label }}"
        type="button"
      >&#x2715;</button>
    </span>
  `,
  styles: [`
    .chip {
      display:        inline-flex;
      align-items:    center;
      gap:            var(--space-1);
      padding:        var(--space-1) var(--space-3);
      background:     var(--color-primary-subtle);
      color:          var(--color-primary);
      border-radius:  var(--radius-full);
      font-size:      var(--text-sm);
      font-weight:    var(--font-medium);
      border:         var(--border-width) solid var(--color-primary-muted);
      transition:     var(--transition-color);
    }

    .chip__label {
      line-height: 1;
    }

    .chip__remove {
      display:        inline-flex;
      align-items:    center;
      justify-content: center;
      background:     transparent;
      border:         none;
      cursor:         pointer;
      color:          var(--color-primary);
      font-size:      10px;
      padding:        0;
      opacity:        0.7;
      transition:     var(--transition-base);
      line-height:    1;
    }

    .chip__remove:hover {
      opacity: 1;
    }
  `]
})
export class ChipComponent implements ControlValueAccessor {
  @Input()  label:     string  = '';
  @Input()  removable: boolean = false;
  @Output() removed = new EventEmitter<void>();

  private onChange  = (_: string) => {};
  private onTouched = () => {};

  onRemove(): void {
    this.removed.emit();
  }

  writeValue(val: string): void {
    this.label = val ?? '';
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}