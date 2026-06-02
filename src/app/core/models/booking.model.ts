// ─── TASK 1.2 ── Booking Model ───────────────────────────────────────────────

export enum BookingStatus {
  PENDING     = 'PENDING',
  CONFIRMED   = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED   = 'COMPLETED',
  CANCELLED   = 'CANCELLED',
}

export interface BookingAddress {
  street:       string;
  city:         string;
  district:     string;
  coordinates?: { lat: number; lng: number };
}

export interface BookingExtra {
  label: string;
  price: number;
}

export interface Booking {
  id:          string;
  customerId:  string;
  workerId:    string;
  serviceId:   string;
  status:      BookingStatus;
  scheduledAt: string;           // ISO 8601
  address:     BookingAddress;
  notes:       string | null;
  basePrice:   number;
  extras:      BookingExtra[];
  totalPrice:  number;
  createdAt:   string;
  updatedAt:   string;
}

export interface CreateBookingPayload {
  workerId:    string;
  serviceId:   string;
  scheduledAt: string;
  address:     BookingAddress;
  notes?:      string;
}

export interface CancelBookingPayload {
  bookingId: string;
  reason:    string;
}

export const CANCEL_REASONS = [
  'Change of plans',
  'Found another worker',
  'Price too high',
  'Worker not responding',
  'Scheduled wrong date',
  'Other',
] as const;

export type CancelReason = typeof CANCEL_REASONS[number];
