import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { UserContextService } from '../services/user-context.service';
import { RewardService } from '../services/reward.service';
import { RewardTier } from '../models/reward.model';

@Injectable({ providedIn: 'root' })
export class MasterGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private readonly rewardService = inject(RewardService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    const role = this.userContext.role;
    if (role === 'admin') {
      return of(true);
    }
    if (role !== 'worker' && role !== 'company') {
      return of(this.router.createUrlTree(['/forbidden']));
    }

    return this.rewardService.getUserRewards('me').pipe(
      map(rewards => {
        if (rewards && rewards.currentTier === RewardTier.MASTER) {
          return true;
        }
        return this.router.createUrlTree(['/forbidden']);
      })
    );
  }
}
