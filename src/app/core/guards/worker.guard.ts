import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

@Injectable({ providedIn: 'root' })
export class WorkerGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    const role = this.userContext.role;
    return role === 'worker' || role === 'company' || role === 'admin'
      ? true
      : this.router.createUrlTree(['/forbidden']);
  }
}
