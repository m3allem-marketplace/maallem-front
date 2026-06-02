// ─── TASK 1.3 ── Bid Model ───────────────────────────────────────────────────

export enum BidRequestStatus {
  OPEN      = 'OPEN',
  AWARDED   = 'AWARDED',
  EXPIRED   = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum BidOfferStatus {
  PENDING  = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum UrgencyLevel {
  ASAP     = 'ASAP',
  FLEXIBLE = 'FLEXIBLE',
  SPECIFIC = 'SPECIFIC',
}

export interface BidRequest {
  id:            string;
  customerId:    string;
  categoryId:    string;
  title:         string;
  description:   string;
  budgetMin:     number;
  budgetMax:     number;
  urgency:       UrgencyLevel;
  preferredDate?: string;       // ISO 8601 — only when urgency === SPECIFIC
  photoUrls:     string[];
  status:        BidRequestStatus;
  offerCount:    number;
  createdAt:     string;
  expiresAt:     string;
}

export interface BidOffer {
  id:            string;
  bidRequestId:  string;
  workerId:      string;
  price:         number;
  estimatedDays: number;
  message:       string;
  status:        BidOfferStatus;
  createdAt:     string;
}

export interface PostBidRequestPayload {
  categoryId:    string;
  title:         string;
  description:   string;
  budgetMin:     number;
  budgetMax:     number;
  urgency:       UrgencyLevel;
  preferredDate?: string;
  photoUrls?:    string[];
}

export interface SubmitBidOfferPayload {
  bidRequestId:  string;
  price:         number;
  estimatedDays: number;
  message:       string;
}
