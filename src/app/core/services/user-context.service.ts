import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private readonly http           = inject(HttpClient);
  private readonly tokenStorage   = inject(TokenStorageService);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public  readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(user => user !== null)
  );
  public  readonly role$: Observable<UserRole | null> = this.currentUser$.pipe(
    map(user => user?.role ?? null)
  );

  constructor() {
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<{ success: boolean; data: { user: User } }>(
        `${environment.apiUrl}/auth/me`, { headers }
      ).subscribe({
        next:  (res) => res?.success && res?.data?.user
          ? this.setUser(res.data.user)
          : this.clearUser(),
        error: () => this.clearUser(),
      });
    } else {
      this.clearUser();
    }
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  get role(): UserRole | null {
    return this.currentUser?.role ?? null;
  }
}
