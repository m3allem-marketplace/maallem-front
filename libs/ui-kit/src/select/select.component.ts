import {
  Component,
  Input,
  forwardRef,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="select-container">

      <!-- Trigger -->
      <div
        class="select-trigger"
        [class.select-open]="isOpen"
        (click)="toggleDropdown()"
        tabindex="0"
        (keydown.enter)="toggleDropdown()"
      >

        <span class="select-value">

          @if (selectedLabels.length) {

            @if (!multiSelect) {

              {{ selectedLabels[0] }}

            } @else {

              <span class="selected-tags">

                @for (label of selectedLabels; track label) {
                  <span class="selected-tag">
                    {{ label }}
                  </span>
                }

              </span>

            }

          } @else {

            <span class="placeholder">
              {{ placeholderText }}
            </span>

          }

        </span>

        <span
          class="select-arrow"
          [class.rotate]="isOpen"
        >
          ▼
        </span>

      </div>

      <!-- Dropdown -->
      @if (isOpen) {

        <div class="select-dropdown">

          @if (searchable) {

            <div class="search-wrapper">

              <input
                [(ngModel)]="searchQuery"
                placeholder="بحث..."
                class="search-input"
                (click)="$event.stopPropagation()"
              />

            </div>

          }

          <ul class="options-list">

            @for (option of filteredOptions; track option.value) {

              <li
                class="option"
                [class.option-selected]="isSelected(option)"
                (click)="selectOption(option)"
              >

                @if (multiSelect) {
                  <span class="checkmark">
                    {{ isSelected(option) ? '✓' : '' }}
                  </span>
                }

                {{ option.label }}

              </li>

            }

            @if (filteredOptions.length === 0) {

              <li class="empty-option">
                لا توجد نتائج
              </li>

            }

          </ul>

        </div>

      }

    </div>
  `,
  styles: [`
    .select-container {
      position: relative;
      width: 100%;
    }

    .select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: var(--input-height);

      padding: 0 var(--input-padding-x);

      background: var(--input-bg);

      border: 1px solid var(--input-border);
      border-radius: var(--input-radius);

      cursor: pointer;

      transition: var(--transition-all);
    }

    .select-open {
      border-color: var(--border-color-focus);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .select-value {
      flex: 1;
      overflow: hidden;
    }

    .placeholder {
      color: var(--text-placeholder);
    }

    .select-arrow {
      font-size: 12px;
      transition: transform .2s ease;
    }

    .rotate {
      transform: rotate(180deg);
    }

    .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;

      z-index: var(--z-dropdown);

      background: var(--bg-surface);

      border: 1px solid var(--border-color-focus);
      border-top: none;

      border-radius: 0 0 var(--input-radius) var(--input-radius);

      box-shadow: var(--shadow-md);

      max-height: 240px;
      overflow-y: auto;
    }

    .search-wrapper {
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }

    .search-input {
      width: 100%;
      height: 36px;

      padding-inline: 12px;

      border: 1px solid var(--input-border);
      border-radius: var(--radius-xs);

      outline: none;
    }

    .options-list {
      list-style: none;
      margin: 0;
      padding: 4px 0;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;

      padding: 10px 16px;

      cursor: pointer;

      transition: background .15s ease;
    }

    .option:hover {
      background: var(--color-primary-subtle);
    }

    .option-selected {
      background: var(--color-primary-subtle);
      color: var(--color-primary);
      font-weight: 600;
    }

    .checkmark {
      width: 16px;
      color: var(--color-primary);
    }

    .empty-option {
      padding: 10px 16px;
      color: var(--text-secondary);
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .selected-tag {
      padding: 2px 8px;

      border-radius: 999px;

      background: var(--color-primary-subtle);
      color: var(--color-primary);

      font-size: 12px;
      font-weight: 500;
    }
  `]
})
export class SelectComponent implements ControlValueAccessor {

  @Input() options: SelectOption[] = [];
  @Input() multiSelect = false;
  @Input() searchable = false;
  @Input() placeholderText = 'اختر...';

  isOpen = false;
  searchQuery = '';
  selected: any[] = [];

  private onChange = (_: any) => {};
  private onTouched = () => {};

  get filteredOptions(): SelectOption[] {

    if (!this.searchQuery) {
      return this.options;
    }

    const query = this.searchQuery.toLowerCase();

    return this.options.filter(
      option => option.label.toLowerCase().includes(query)
    );
  }

  get selectedLabels(): string[] {
    return this.options
      .filter(option => this.selected.includes(option.value))
      .map(option => option.label);
  }

  isSelected(option: SelectOption): boolean {
    return this.selected.includes(option.value);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      this.searchQuery = '';
    }

    this.onTouched();
  }

  selectOption(option: SelectOption): void {

    if (this.multiSelect) {

      this.selected = this.isSelected(option)
        ? this.selected.filter(v => v !== option.value)
        : [...this.selected, option.value];

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

  writeValue(value: any): void {

    this.selected = this.multiSelect
      ? (Array.isArray(value) ? value : [])
      : (value != null ? [value] : []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}