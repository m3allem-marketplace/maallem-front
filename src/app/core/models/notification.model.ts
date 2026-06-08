// ─── TASK 1.5 ── Notification Model ─────────────────────────────────────────

export enum NotificationType {
  BOOKING_CONFIRMED  = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED  = 'BOOKING_CANCELLED',
  BOOKING_COMPLETED  = 'BOOKING_COMPLETED',
  BID_RECEIVED       = 'BID_RECEIVED',     // customer: a worker submitted a bid
  BID_ACCEPTED       = 'BID_ACCEPTED',     // worker: customer accepted your bid
  BID_REJECTED       = 'BID_REJECTED',     // worker: customer rejected your bid
  REVIEW_RECEIVED    = 'REVIEW_RECEIVED',
  SYSTEM             = 'SYSTEM',
}

export type NotificationReferenceType =
  | 'booking'
  | 'bid_request'
  | 'review'
  | null;

export interface Notification {
  id:              string;
  userId:          string;
  type:            NotificationType;
  title:           string;
  body:            string;
  referenceId:     string | null;
  referenceType:   NotificationReferenceType;
  isRead:          boolean;
  createdAt:       string;
}

export interface NotificationGroup {
  date:  string;              // e.g. "Today", "Yesterday", "May 30"
  items: Notification[];
}
