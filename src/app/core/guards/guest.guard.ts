import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (!this.userContext.isLoggedIn) {
      return true;
    }
    const role = this.userContext.role;
    if (role === 'user') {
      return this.router.createUrlTree(['/customer/dashboard']);
    }
    return this.router.createUrlTree(['/worker/dashboard']);
  }
}
