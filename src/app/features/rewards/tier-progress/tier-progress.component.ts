import { Component, OnInit } from '@angular/core';
import { RewardService } from '../../../core/services/reward.service';
import { UserReward, RewardTier, TierConfig } from '../../../core/models/reward.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tier-progress',
  templateUrl: './tier-progress.component.html',
  styleUrls: ['./tier-progress.component.css']
})
export class TierProgressComponent implements OnInit {
  loading = true;
  reward: UserReward | null = null;
  tiers: TierConfig[] = [];
  activeTab: 'progress' | 'history' | 'master' = 'progress';

  readonly tierMeta: Record<RewardTier, { icon: string; label: string; color: string; bg: string; glow: string }> = {
    [RewardTier.BRONZE]: { icon: '🥉', label: 'برونز', color: '#cd7f32', bg: '#fdf3e7', glow: 'rgba(205,127,50,0.35)' },
    [RewardTier.SILVER]: { icon: '🥈', label: 'فضي',  color: '#a8a9ad', bg: '#f4f4f6', glow: 'rgba(168,169,173,0.35)' },
    [RewardTier.GOLD]:   { icon: '🥇', label: 'ذهبي', color: '#FFB400', bg: '#fff9e6', glow: 'rgba(255,180,0,0.4)'   },
    [RewardTier.MASTER]: { icon: '⭐', label: 'ماستر', color: '#7c3aed', bg: '#f5f3ff', glow: 'rgba(124,58,237,0.4)' },
  };

  readonly tierOrder: RewardTier[] = [
    RewardTier.BRONZE, RewardTier.SILVER, RewardTier.GOLD, RewardTier.MASTER
  ];

  constructor(
    private rewardService: RewardService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.rewardService.getUserRewards().subscribe((r: UserReward) => {
      this.reward = r;
      this.loading = false;
    });
    this.rewardService.getTierConfig().subscribe((t: TierConfig[]) => {
      this.tiers = t;
    });
  }

  get progressPercent(): number {
    if (!this.reward || this.reward.pointsToNextTier === null) return 100;
    const currentTierConfig = this.tiers.find(t => t.tier === this.reward!.currentTier);
    const tierStart = currentTierConfig?.minPoints ?? 0;
    const tierRange = (this.reward.currentPoints - tierStart) + this.reward.pointsToNextTier;
    return Math.round(((this.reward.currentPoints - tierStart) / tierRange) * 100);
  }

  get circumference(): number { return 2 * Math.PI * 54; }

  get strokeDashoffset(): number {
    return this.circumference - (this.progressPercent / 100) * this.circumference;
  }

  get currentMeta() {
    return this.reward ? this.tierMeta[this.reward.currentTier] : this.tierMeta[RewardTier.BRONZE];
  }

  get nextMeta() {
    return this.reward?.nextTier ? this.tierMeta[this.reward.nextTier] : null;
  }

  get isMaster(): boolean {
    return this.reward?.currentTier === RewardTier.MASTER;
  }

  getBenefits(): string[] {
    return this.tiers.find(t => t.tier === this.reward?.currentTier)?.benefits ?? [];
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  setTab(tab: 'progress' | 'history' | 'master'): void {
    this.activeTab = tab;
  }
}
