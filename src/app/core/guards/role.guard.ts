import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

import { Observable, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRole: string = route.data['role'];
    return this.userContext.initialized$.pipe(
      filter(init => init),
      take(1),
      map(() => this.userContext.role === expectedRole
        ? true
        : this.router.createUrlTree(['/forbidden'])
      )
    );
  }
}
