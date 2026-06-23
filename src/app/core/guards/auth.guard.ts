import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

import { Observable, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.userContext.initialized$.pipe(
      filter(init => init),
      take(1),
      map(() => this.userContext.isLoggedIn
        ? true
        : this.router.createUrlTree(['/auth/login'])
      )
    );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
