import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter$ = new BehaviorSubject<number>(0);
  readonly isLoading$: Observable<boolean> = this.counter$.pipe(
    map(count => count > 0),
    distinctUntilChanged()
  );
  increment(): void {
    this.counter$.next(this.counter$.value + 1);
  }
  decrement(): void {
    const newValue = Math.max(this.counter$.value - 1, 0);
    this.counter$.next(newValue);
  }
}
