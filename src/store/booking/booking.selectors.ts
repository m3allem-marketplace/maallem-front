import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from './booking.reducer';

export const selectBookingState = createFeatureSelector<BookingState>('booking');

export const selectAllBookings = createSelector(
  selectBookingState,
  (state) => state.bookings
);

export const selectBookingLoading = createSelector(
  selectBookingState,
  (state) => state.loading
);

export const selectBookingError = createSelector(
  selectBookingState,
  (state) => state.error
);

export const selectAvailabilityUpdated = createSelector(
  selectBookingState,
  (state) => state.availabilityUpdated
);
