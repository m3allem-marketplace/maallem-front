import { UserPublic } from './user.model';

export type BookingStatus =
  | 'pending_payment'
  | 'paid'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded'
  | 'cancelled';

export interface Booking {
  _id: string;
  client: UserPublic;
  provider: UserPublic;
  project?: string | null;
  proposal?: string | null;
  service?: string | null;
  price: number;
  escrowAmount: number;
  commissionAmount: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  providerId: string;
  price: number;
  projectId?: string;
  proposalId?: string;
  serviceId?: string;
}
