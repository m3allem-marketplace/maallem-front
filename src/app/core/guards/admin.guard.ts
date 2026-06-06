import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    return this.userContext.role === 'admin'
      ? true
      : this.router.createUrlTree(['/forbidden']);
  }
}
