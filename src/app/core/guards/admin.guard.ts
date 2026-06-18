import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

import { Observable, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.userContext.initialized$.pipe(
      filter(init => init),
      take(1),
      map(() => this.userContext.role === 'admin'
        ? true
        : this.router.createUrlTree(['/forbidden'])
      )
    );
  }
}
