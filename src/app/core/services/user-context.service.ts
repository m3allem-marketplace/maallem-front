import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private _user$ = new BehaviorSubject<User | null>(null);

  readonly user$: Observable<User | null> = this._user$.asObservable();

  readonly role$: Observable<string | null> = this._user$.pipe(
    map(u => u?.role ?? null),
  );

  readonly isLoggedIn$: Observable<boolean> = this._user$.pipe(
    map(u => u !== null),
  );

  get snapshot(): User | null {
    return this._user$.getValue();
  }

  get role(): UserRole | null {
    return this._user$.getValue()?.role ?? null;
  }

  setUser(user: User): void {
    this._user$.next(user);
  }

  clearUser(): void {
    this._user$.next(null);
  }

  hasRole(...roles: UserRole[]): boolean {
    const current = this.role;
    return current !== null && roles.includes(current);
  }
}
