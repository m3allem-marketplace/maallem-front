import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Tier = 'bronze' | 'silver' | 'gold' | 'master';

interface TierConfig {
  label: string;
  icon:  string;
  bg:    string;
  color: string;
}

@Component({
  selector: 'app-tier-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tier-badge.component.html',
})
export class TierBadgeComponent {
  @Input() tier: Tier = 'bronze';

  readonly config: Record<Tier, TierConfig> = {
    bronze: { label: 'Bronze', icon: '🥉', bg: 'var(--color-tier-bronze-bg)', color: 'var(--color-tier-bronze)' },
    silver: { label: 'Silver', icon: '🥈', bg: 'var(--color-tier-silver-bg)', color: 'var(--color-tier-silver)' },
    gold:   { label: 'Gold',   icon: '🥇', bg: 'var(--color-tier-gold-bg)',   color: 'var(--color-tier-gold)'   },
    master: { label: 'Master', icon: '⭐', bg: 'var(--color-tier-master-bg)', color: 'var(--color-tier-master)' },
  };

  get current(): TierConfig {
    return this.config[this.tier];
  }
}