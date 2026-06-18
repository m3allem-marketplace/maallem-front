import { createAction, props } from '@ngrx/store';
import { Booking } from '../../app/core/models/booking.model';

export const loadBookings = createAction('[Booking] Load Bookings');
export const loadBookingsSuccess = createAction(
  '[Booking] Load Bookings Success',
  props<{ bookings: Booking[] }>()
);
export const loadBookingsFailure = createAction(
  '[Booking] Load Bookings Failure',
  props<{ error: string }>()
);

export const createDirectBooking = createAction(
  '[Booking] Create Direct Booking',
  props<{ payload: any }>()
);
export const createDirectBookingSuccess = createAction(
  '[Booking] Create Direct Booking Success',
  props<{ booking: Booking }>()
);
export const createDirectBookingFailure = createAction(
  '[Booking] Create Direct Booking Failure',
  props<{ error: string }>()
);

export const updateAvailability = createAction(
  '[Booking] Update Availability',
  props<{ availabilities: any[]; hourlyRate: number; offersFlatRate: boolean }>()
);
export const updateAvailabilitySuccess = createAction(
  '[Booking] Update Availability Success',
  props<{ profile: any }>()
);
export const updateAvailabilityFailure = createAction(
  '[Booking] Update Availability Failure',
  props<{ error: string }>()
);
