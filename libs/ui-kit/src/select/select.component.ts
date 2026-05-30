import {
  Component,
  Input,
  forwardRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-wrapper" [class.select-wrapper--open]="isOpen">

      <!-- Trigger -->
      <div class="select-trigger" (click)="toggleDropdown()" tabindex="0" (keydown.enter)="toggleDropdown()">
        <span class="select-trigger__value">
          <ng-container *ngIf="selectedLabels.length; else placeholder">
            <span *ngIf="!multiSelect">{{ selectedLabels[0] }}</span>
            <span *ngIf="multiSelect" class="select-trigger__tags">
              <span class="select-tag" *ngFor="let lbl of selectedLabels">{{ lbl }}</span>
            </span>
          </ng-container>
          <ng-template #placeholder>
            <span class="select-trigger__placeholder">{{ placeholderText }}</span>
          </ng-template>
        </span>
        <span class="select-trigger__arrow" [class.select-trigger__arrow--open]="isOpen">&#x25BE;</span>
      </div>

      <!-- Dropdown -->
      <div *ngIf="isOpen" class="select-dropdown">

        <!-- Search -->
        <div *ngIf="searchable" class="select-search">
          <input
            [(ngModel)]="searchQuery"
            placeholder="بحث..."
            class="select-search__input"
            (click)="$event.stopPropagation()"
          />
        </div>

        <!-- Options -->
        <ul class="select-options" role="listbox">
          <li
            *ngFor="let option of filteredOptions"
            class="select-option"
            [class.select-option--selected]="isSelected(option)"
            (click)="selectOption(option)"
            role="option"
            [attr.aria-selected]="isSelected(option)"
          >
            <span *ngIf="multiSelect" class="select-option__check">
              {{ isSelected(option) ? '✓' : '' }}
            </span>
            {{ option.label }}
          </li>

          <li *ngIf="filteredOptions.length === 0" class="select-option select-option--empty">
            لا توجد نتائج
          </li>
        </ul>
      </div>

    </div>
  `,
  styles: [`
    .select-wrapper {
      position: relative;
      width:    100%;
    }

    /* ── Trigger ── */
    .select-trigger {
      display:          flex;
      align-items:      center;
      justify-content:  space-between;
      height:           var(--input-height);
      padding:          0 var(--input-padding-x);
      background:       var(--input-bg);
      border:           var(--border-width) solid var(--input-border);
      border-radius:    var(--input-radius);
      cursor:           pointer;
      font-size:        var(--text-base);
      color:            var(--text-body);
      transition:       var(--transition-color), var(--transition-shadow);
      user-select:      none;
    }

    .select-trigger:focus {
      outline:      none;
      border-color: var(--border-color-focus);
      box-shadow:   var(--shadow-focus);
    }

    .select-wrapper--open .select-trigger {
      border-color:        var(--border-color-focus);
      border-bottom-color: transparent;
      border-radius:       var(--input-radius) var(--input-radius) 0 0;
    }

    .select-trigger__placeholder {
      color: var(--text-placeholder);
    }

    .select-trigger__value {
      flex: 1;
      overflow: hidden;
    }

    .select-trigger__tags {
      display:   flex;
      flex-wrap: wrap;
      gap:       var(--space-1);
    }

    .select-tag {
      background:    var(--color-primary-subtle);
      color:         var(--color-primary);
      border-radius: var(--radius-full);
      font-size:     var(--text-xs);
      padding:       2px var(--space-2);
      font-weight:   var(--font-medium);
    }

    .select-trigger__arrow {
      font-size:  12px;
      color:      var(--text-secondary);
      transition: transform var(--transition-base);
      flex-shrink: 0;
    }

    .select-trigger__arrow--open {
      transform: rotate(180deg);
    }

    /* ── Dropdown ── */
    .select-dropdown {
      position:         absolute;
      top:              100%;
      left:             0;
      right:            0;
      z-index:          var(--z-dropdown);
      background:       var(--bg-surface);
      border:           var(--border-width) solid var(--border-color-focus);
      border-top:       none;
      border-radius:    0 0 var(--input-radius) var(--input-radius);
      box-shadow:       var(--shadow-md);
      max-height:       240px;
      overflow-y:       auto;
    }

    /* ── Search ── */
    .select-search {
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width) solid var(--border-color);
    }

    .select-search__input {
      width:         100%;
      height:        var(--input-height-sm);
      padding:       0 var(--space-2);
      border:        var(--border-width) solid var(--input-border);
      border-radius: var(--radius-xs);
      font-size:     var(--text-sm);
      outline:       none;
      background:    var(--input-bg);
      color:         var(--text-body);
    }

    .select-search__input:focus {
      border-color: var(--border-color-focus);
    }

    /* ── Options ── */
    .select-options {
      list-style: none;
      margin:     0;
      padding:    var(--space-1) 0;
    }

    .select-option {
      display:     flex;
      align-items: center;
      gap:         var(--space-2);
      padding:     var(--space-2) var(--space-4);
      font-size:   var(--text-sm);
      cursor:      pointer;
      color:       var(--text-body);
      transition:  background-color var(--transition-fast);
    }

    .select-option:hover {
      background-color: var(--color-primary-subtle);
    }

    .select-option--selected {
      background-color: var(--color-primary-subtle);
      color:            var(--color-primary);
      font-weight:      var(--font-medium);
    }

    .select-option__check {
      width:      16px;
      color:      var(--color-primary);
      font-weight: var(--font-bold);
      font-size:  var(--text-xs);
    }

    .select-option--empty {
      color:  var(--text-secondary);
      cursor: default;
    }

    .select-option--empty:hover {
      background: transparent;
    }
  `]
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() options:      SelectOption[] = [];
  @Input() multiSelect:  boolean        = false;
  @Input() searchable:   boolean        = false;
  @Input() placeholderText: string      = 'اختر...';

  isOpen:      boolean  = false;
  searchQuery: string   = '';
  selected:    any[]    = [];

  private onChange  = (_: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {}

  get filteredOptions(): SelectOption[] {
    if (!this.searchQuery) return this.options;
    const q = this.searchQuery.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  get selectedLabels(): string[] {
    return this.options
      .filter(o => this.selected.includes(o.value))
      .map(o => o.label);
  }

  isSelected(option: SelectOption): boolean {
    return this.selected.includes(option.value);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.searchQuery = '';
    this.onTouched();
  }

  selectOption(option: SelectOption): void {
    if (this.multiSelect) {
      if (this.isSelected(option)) {
        this.selected = this.selected.filter(v => v !== option.value);
      } else {
        this.selected = [...this.selected, option.value];
      }
      this.onChange(this.selected);
    } else {
      this.selected = [option.value];
      this.onChange(option.value);
      this.isOpen = false;
      this.searchQuery = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-select')) {
      this.isOpen = false;
      this.searchQuery = '';
    }
  }

  writeValue(val: any): void {
    if (this.multiSelect) {
      this.selected = Array.isArray(val) ? val : [];
    } else {
      this.selected = val != null ? [val] : [];
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}