import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { BookingService } from '../../app/core/services/booking.service';
import { WorkerProfileService } from '../../app/core/services/worker-profile.service';
import * as BookingActions from './booking.actions';

@Injectable()
export class BookingEffects {
  private readonly actions$ = inject(Actions);
  private readonly bookingService = inject(BookingService);
  private readonly workerProfileService = inject(WorkerProfileService);

  loadBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.loadBookings),
      mergeMap(() =>
        this.bookingService.getBookings().pipe(
          map((res: any) => {
            const list = res?.data?.bookings || res?.data?.projects || (Array.isArray(res?.data) ? res.data : (res?.data ? [] : (Array.isArray(res) ? res : [])));
            return BookingActions.loadBookingsSuccess({ bookings: list });
          }),
          catchError((error) =>
            of(BookingActions.loadBookingsFailure({ error: error.message || 'Failed to load bookings' }))
          )
        )
      )
    )
  );

  createDirectBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.createDirectBooking),
      mergeMap(({ payload }) =>
        this.bookingService.createBooking(payload).pipe(
          map((res: any) => {
            const booking = res?.data?.project || res?.data || res;
            return BookingActions.createDirectBookingSuccess({ booking });
          }),
          catchError((error) =>
            of(BookingActions.createDirectBookingFailure({ error: error.message || 'Failed to create direct booking' }))
          )
        )
      )
    )
  );

  updateAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.updateAvailability),
      mergeMap(({ availabilities, hourlyRate, offersFlatRate }) =>
        this.workerProfileService.updateAvailability(availabilities, hourlyRate, offersFlatRate).pipe(
          map((res: any) => {
            const profile = res?.data?.profile || res?.data || res;
            return BookingActions.updateAvailabilitySuccess({ profile });
          }),
          catchError((error) =>
            of(BookingActions.updateAvailabilityFailure({ error: error.message || 'Failed to update availability' }))
          )
        )
      )
    )
  );
}
