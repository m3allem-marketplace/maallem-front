// ─── TASK 1.4 ── Review Model ────────────────────────────────────────────────

export interface Review {
  id:        string;
  bookingId: string;
  authorId:  string;       // customer who wrote the review
  targetId:  string;       // worker being reviewed
  rating:    number;       // 1–5, supports decimals (e.g. 4.5)
  comment:   string;
  createdAt: string;
}

export interface SubmitReviewPayload {
  bookingId: string;
  rating:    number;
  comment:   string;
}

export interface WorkerRatingSummary {
  averageRating:    number;
  totalReviews:     number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
