import { createReducer, on } from '@ngrx/store';
import { Booking } from '../../app/core/models/booking.model';
import * as BookingActions from './booking.actions';

export interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  availabilityUpdated: boolean;
}

export const initialBookingState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
  availabilityUpdated: false,
};

export const bookingReducer = createReducer(
  initialBookingState,

  // Load Bookings
  on(BookingActions.loadBookings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingActions.loadBookingsSuccess, (state, { bookings }) => ({
    ...state,
    bookings,
    loading: false,
  })),
  on(BookingActions.loadBookingsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Direct Booking
  on(BookingActions.createDirectBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingActions.createDirectBookingSuccess, (state, { booking }) => ({
    ...state,
    bookings: [...state.bookings, booking],
    loading: false,
  })),
  on(BookingActions.createDirectBookingFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update Availability
  on(BookingActions.updateAvailability, (state) => ({
    ...state,
    loading: true,
    error: null,
    availabilityUpdated: false,
  })),
  on(BookingActions.updateAvailabilitySuccess, (state) => ({
    ...state,
    loading: false,
    availabilityUpdated: true,
  })),
  on(BookingActions.updateAvailabilityFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    availabilityUpdated: false,
  }))
);
