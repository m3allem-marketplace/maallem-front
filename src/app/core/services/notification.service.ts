import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([
    {
      id: 'notif-1',
      userId: 'me',
      type: NotificationType.BID_ACCEPTED,
      title: 'تم قبول عرضك',
      message: 'قام العميل أحمد محمد بقبول عرضك على مشروع تصليح سباكة.',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      userId: 'me',
      type: NotificationType.BOOKING_CONFIRMED,
      title: 'حجز مؤكد',
      message: 'تم تأكيد حجزك لمشروع صيانة كهرباء بنجاح.',
      isRead: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  markAsRead(id: string): Observable<boolean> {
    const list = this.notifications$.getValue().map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifications$.next(list);
    return of(true);
  }

  markAllAsRead(): Observable<boolean> {
    const list = this.notifications$.getValue().map((n) => ({
      ...n,
      isRead: true,
    }));
    this.notifications$.next(list);
    return of(true);
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const list = [newNotif, ...this.notifications$.getValue()];
    this.notifications$.next(list);
  }
}
