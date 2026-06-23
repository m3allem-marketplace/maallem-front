import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

import { Observable, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.userContext.initialized$.pipe(
      filter(init => init),
      take(1),
      map(() => {
        if (!this.userContext.isLoggedIn) {
          return true;
        }
        const role = this.userContext.role;
        if (role === 'user') {
          return this.router.createUrlTree(['/customer/dashboard']);
        }
        return this.router.createUrlTree(['/worker/dashboard']);
      })
    );
  }
}
