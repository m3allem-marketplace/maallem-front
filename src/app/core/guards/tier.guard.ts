import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

@Injectable({ providedIn: 'root' })
export class TierGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot): boolean | UrlTree {
    // TODO: Implement tier checking once the Backend API provides the user.tier field.
    // Currently hardcoded to redirect to /forbidden to prevent unauthorized access to master features.
    return this.router.createUrlTree(['/forbidden']);
  }
}
