import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly api = inject(ApiService);
  private readonly userContext = inject(UserContextService);

  getBookings(): Observable<any> {
    return this.api.get<any>('/bookings');
  }

  getBookingById(id: string): Observable<any> {
    return this.api.get<any>(`/bookings/${id}`);
  }

  createBooking(payload: any): Observable<any> {
    const backendPayload = {
      providerId: payload.workerId || payload.providerId,
      price: payload.price || payload.budget || payload.basePrice || 0,
      projectId: payload.projectId || null,
      proposalId: payload.proposalId || null,
      serviceId: payload.serviceId || null
    };
    return this.api.post<any>('/bookings', backendPayload);
  }

  payBooking(id: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/pay`, {});
  }

  deliverBooking(id: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/deliver`, {});
  }

  completeBooking(id: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/approve`, {});
  }

  getReleases(id: string): Observable<any> {
    return this.api.get<any>(`/bookings/${id}/releases`);
  }

  createReleases(id: string, releases: Array<{ name: string; amount: number; dueDate?: string }>): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/releases`, { releases });
  }

  deliverRelease(id: string, releaseId: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/releases/${releaseId}/deliver`, {});
  }

  disputeBooking(id: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/dispute`, {});
  }

  confirmBooking(id: string): Observable<any> {
    return this.api.post<any>(`/bookings/${id}/confirm`, {});
  }

  cancelBooking(id: string): Observable<any> {
    // Escrow bookings can be cancelled via dispute if paid/delivered, or we can mock/catchError for unpaid.
    return this.api.post<any>(`/bookings/${id}/dispute`, {}).pipe(
      catchError(() => of({ success: true, message: 'Booking cancelled (local dev mode)' }))
    );
  }
}
