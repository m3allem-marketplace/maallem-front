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
    .search-bar__input {
      direction: rtl;
    }

    .search-bar__input:focus {
      outline: none;
      box-shadow: none;
    }

    .search-bar__input::placeholder {
      color: var(--text-placeholder);
    }

    .btn-arrow {
      transition: transform var(--transition-base);
    }

    .search-bar__btn:hover .btn-arrow {
      transform: translateX(4px);
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