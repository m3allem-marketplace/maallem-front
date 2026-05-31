import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styles: [`
  .search-wrap {
    direction: ltr;
    width: 100%;
  }

  .search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--input-bg);
  border-radius: var(--radius-full);
  padding: 6px;
}

  .search-bar:focus-within {
    box-shadow: none;
    border: none;
    outline: none;
  }

  .search-bar__icon {
    display: flex;
    align-items: center;
    padding: 0 var(--space-4) 0 var(--space-5);
    color: var(--text-secondary);
    pointer-events: none;
    flex-shrink: 0;
  }

  .search-bar__input {
    flex: 1;
    height: 52px;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--text-body);
    direction: rtl;
    min-width: 0;
  }

  .search-bar__input:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  .search-bar__input::placeholder {
    color: var(--text-placeholder);
  }

  .search-bar__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: var(--space-2);
    background: var(--color-neutral-100);
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 12px;
    flex-shrink: 0;
  }

  .search-bar__clear:hover {
    background-color: var(--color-neutral-200);
    color: var(--text-primary);
  }

  .search-bar__btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  height: 44px;
  padding: 0 28px;

  background: var(--color-accent);
  color: var(--color-primary-dark);

  border: none;
  border-radius: 999px;

  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-bold);

  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}

  .search-bar__btn:hover {
    background-color: var(--color-accent-dark);
  }

  .search-bar__btn-arrow {
    font-size: 18px;
    transition: transform var(--transition-base);
  }

  .search-bar__btn:hover .search-bar__btn-arrow {
    transform: translateX(4px);
  }
`]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input()  placeholder:  string = 'ابحث عن حرفي...';
  @Input()  initialValue: string = '';
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  control = new FormControl('');
  private sub!: Subscription;

  get hasValue(): boolean { return !!this.control.value; }

  ngOnInit(): void {
    if (this.initialValue) this.control.setValue(this.initialValue, { emitEvent: false });
    this.sub = this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(val => this.searchChange.emit(val ?? ''));
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  clear(): void {
    this.control.setValue('');
    this.searchChange.emit('');
    this.inputRef.nativeElement.focus();
  }
}