import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  Subscription
} from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-bar.component.html',
  styles: [`
    .search-bar-container {
      background: var(--input-bg, #ffffff);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .search-bar__icon {
      color: var(--text-secondary, #64748b);
    }

    .search-bar__input {
      direction: rtl;
      color: var(--text-body, #1e293b);
      font-family: 'Cairo', var(--font-sans), sans-serif;
    }

    .search-bar__input:focus {
      outline: none;
      box-shadow: none;
    }

    .search-bar__input::placeholder {
      color: var(--text-placeholder, #94a3b8);
      font-weight: 500;
      transition: opacity 0.3s ease;
    }

    .search-bar__clear {
      background: var(--color-neutral-100, #f1f5f9);
      color: var(--text-secondary, #64748b);
    }

    .search-bar__btn {
      background-color: var(--color-accent, #f59e0b);
      color: var(--color-primary-dark, #0f172a);
      font-family: 'Cairo', var(--font-sans), sans-serif;
      transition: all 0.3s ease;
    }

    .btn-arrow {
      transition: transform var(--transition-base, 0.3s ease);
      display: inline-block;
    }

    .search-bar__btn:hover .btn-arrow {
      transform: translateX(-4px);
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @Input()
  placeholder: string = 'ابحث عن حرفي...';

  @Input()
  initialValue: string = '';

  @Output()
  searchChange = new EventEmitter<string>();

  @ViewChild('inputRef')
  inputRef!: ElementRef<HTMLInputElement>;

  control = new FormControl('');

  private sub?: Subscription;

  get hasValue(): boolean {
    return !!this.control.value;
  }

  ngOnInit(): void {

    if (this.initialValue) {
      this.control.setValue(
        this.initialValue,
        { emitEvent: false }
      );
    }

    this.sub = this.control.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchChange.emit(value ?? '');
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  clear(): void {
    this.control.setValue('');
    this.inputRef.nativeElement.focus();
  }
}