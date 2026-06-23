import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../services/user-context.service';

import { Observable, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkerGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.userContext.initialized$.pipe(
      filter(init => init),
      take(1),
      map(() => {
        const role = this.userContext.role;
        return role === 'worker' || role === 'company' || role === 'admin'
          ? true
          : this.router.createUrlTree(['/forbidden']);
      })
    );
  }
}
