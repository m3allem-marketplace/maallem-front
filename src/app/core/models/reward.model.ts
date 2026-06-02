// ─── TASK 1.6 ── Reward Model ────────────────────────────────────────────────

export enum RewardTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD   = 'GOLD',
  MASTER = 'MASTER',
}

export interface TierThreshold {
  tier:      RewardTier;
  minPoints: number;
  maxPoints: number | null;   // null for MASTER (no upper limit)
  label:     string;
  colorHex:  string;          // drives dynamic chip/badge styling
  benefits:  string[];
}

export interface UserReward {
  userId:           string;
  currentTier:      RewardTier;
  currentPoints:    number;
  pointsToNextTier: number | null;  // null when already at MASTER
  nextTier:         RewardTier | null;
  tierHistory:      TierHistoryEntry[];
}

export interface TierHistoryEntry {
  tier:           RewardTier;
  achievedAt:     string;
  pointsAtTime:   number;
}

export interface PointTransaction {
  id:          string;
  userId:      string;
  points:      number;           // positive = earned, negative = spent
  reason:      string;
  referenceId: string | null;    // bookingId that triggered points
  createdAt:   string;
}
