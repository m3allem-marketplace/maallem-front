import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private api = inject(ApiService);

  getNotifications(): Observable<any> {
    return this.api.get<any>('/profiles/notifications');
  }

  markAsRead(id: string): Observable<any> {
    return this.api.patch<any>(`/profiles/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.api.post<any>(`/profiles/notifications/read-all`, {});
  }
}
