import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  getAllUsers(): Observable<any[]> {
    return of([
      { id: '1', name: 'أحمد محمد', email: 'ahmed@mail.com', role: 'user', isActive: true },
      { id: '2', name: 'مصطفى علي', email: 'worker@mail.com', role: 'worker', isActive: true },
    ]);
  }

  updateUserStatus(id: string, isActive: boolean): Observable<any> {
    return of({ success: true, message: 'User status updated successfully' });
  }

  getAllBookingsAdmin(): Observable<any[]> {
    return of([]);
  }

  overrideBookingStatus(bookingId: string, status: string): Observable<any> {
    return of({ success: true, message: 'Booking status overridden by admin' });
  }

  getDisputes(): Observable<any[]> {
    return of([]);
  }
}
