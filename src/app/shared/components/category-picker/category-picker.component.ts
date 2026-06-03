import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  SelectComponent,
  SelectOption
} from '../../../../../libs/ui-kit/src/select/select.component';

import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryPickerComponent),
      multi: true
    }
  ],
  templateUrl: './category-picker.component.html'
})
export class CategoryPickerComponent
  implements ControlValueAccessor {

  @Input() categories: Category[] = [];

  @Output()
  categorySelected = new EventEmitter<Category>();

  selectedCategoryId = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get options(): SelectOption[] {
    return this.categories.map(category => ({
      label: category.name,
      value: category.id
    }));
  }

  writeValue(value: string): void {
    this.selectedCategoryId = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelect(categoryId: any): void {

    this.selectedCategoryId = categoryId;

    this.onChange(categoryId);
    this.onTouched();

    const category = this.categories.find(
      c => c.id === categoryId
    );

    if (category) {
      this.categorySelected.emit(category);
    }
  }
}