import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserReward, TierConfig, RewardTier } from '../models/reward.model';

@Injectable({
  providedIn: 'root',
})
export class RewardService {
  private userReward: UserReward = {
    userId: 'me',
    currentTier: RewardTier.BRONZE,
    points: 120,
    pointsToNextTier: 180,
    benefitsClaimed: [],
    history: [
      {
        id: 'h-1',
        pointsChanged: 50,
        reason: 'Completed plumbing job',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'h-2',
        pointsChanged: 70,
        reason: 'Bonus points for 5-star rating',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  private tierConfigs: TierConfig[] = [
    {
      tier: RewardTier.BRONZE,
      minPoints: 0,
      benefits: ['أولوية متوسطة في استلام الطلبات', 'عمولة Platform المخفضة 15%'],
    },
    {
      tier: RewardTier.SILVER,
      minPoints: 300,
      benefits: ['أولوية مرتفعة في استلام الطلبات', 'عمولة Platform المخفضة 12%', 'شارة فضية مميزة'],
    },
    {
      tier: RewardTier.GOLD,
      minPoints: 1000,
      benefits: ['أولوية قصوى وجوباً للعملاء', 'عمولة Platform المخفضة 10%', 'شارة ذهبية مميزة', 'دعم فني خاص 24/7'],
    },
    {
      tier: RewardTier.MASTER,
      minPoints: 2500,
      benefits: ['صفر عمولة Platform', 'شارة الماستر الذهبية اللامعة', 'أولوية فورية وحصرية', 'عروض مجانية ممولة'],
    },
  ];

  getUserRewards(userId: string = 'me'): Observable<UserReward> {
    return of(this.userReward);
  }

  getTierConfig(): Observable<TierConfig[]> {
    return of(this.tierConfigs);
  }
}
