import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Notification, NotificationType } from '../../../core/models/notification.model';
import { NotificationsActions } from '../../../store/notifications/notifications.actions';
import {
  selectAllNotifications,
  selectUnreadCount
} from '../../../store/notifications/notifications.selectors';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styles: [`
    .notification-panel {
      animation: notification-enter 250ms cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: top right;
      position: relative;
    }

    .clear-btn {
      border: none !important;
      outline: none !important;
      box-shadow: none;
      transition: transform 200ms ease, opacity 200ms ease;
    }
    .clear-btn:hover { transform: translateY(-1px); }
    .clear-btn:focus, .clear-btn:focus-visible { outline: none; border: none; }
    .clear-btn:active { transform: translateY(0); }

    @keyframes notification-enter {
      from { opacity: 0; transform: translateY(12px) scale(.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .notification-item {
      transition: all 200ms ease;
      cursor: pointer;
    }
    .notification-item:hover { background: var(--color-primary-subtle); }
    .notification-item.unread { background: rgba(27, 43, 110, 0.03); }

    .notification-icon { transition: transform 200ms ease; }
    .notification-item:hover .notification-icon { transform: scale(1.08); }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications$!: Observable<Notification[]>;
  unreadCount$!: Observable<number>;

  private sub?: Subscription;
  notifications: Notification[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(NotificationsActions.loadNotifications());
    this.notifications$ = this.store.select(selectAllNotifications);
    this.unreadCount$ = this.store.select(selectUnreadCount);

    // Subscribe for local template usage (for @for / @if control flow)
    this.sub = this.notifications$.subscribe(n => {
      // Seed mock if store is empty
      if (n.length === 0) {
        this.notifications = this.getMockNotifications();
      } else {
        this.notifications = n;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  markRead(id: string): void {
    this.store.dispatch(NotificationsActions.markNotificationRead({ id }));
    // Optimistic local update for mock
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      (item as any).isRead = true;
    }
  }

  clearAll(): void {
    this.store.dispatch(NotificationsActions.markAllNotificationsRead());
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
  }

  icon(type: NotificationType | string): string {
    const map: Record<string, string> = {
      BOOKING_CONFIRMED: '📅',
      BOOKING_CANCELLED: '❌',
      BOOKING_COMPLETED: '✅',
      BID_RECEIVED:      '💼',
      BID_ACCEPTED:      '🎉',
      BID_REJECTED:      '😔',
      REVIEW_RECEIVED:   '⭐',
      SYSTEM:            '🔔',
      booking:           '📅',
      bid:               '💰',
    };
    return map[type] || '🔔';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        userId: 'user-1',
        type: NotificationType.BID_ACCEPTED,
        title: 'تم قبول عرضك',
        body: 'قبل أحمد العميل عرضك على وظيفة "تصليح خطوط السباكة"',
        referenceId: 'bid-1',
        referenceType: 'bid_request',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60000).toISOString()
      },
      {
        id: '2',
        userId: 'user-1',
        type: NotificationType.BOOKING_CONFIRMED,
        title: 'تأكيد الحجز',
        body: 'تم تأكيد حجزك بنجاح. سيصل المعلم يوم الخميس القادم.',
        referenceId: 'booking-1',
        referenceType: 'booking',
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: '3',
        userId: 'user-1',
        type: NotificationType.REVIEW_RECEIVED,
        title: 'تقييم جديد',
        body: 'تلقيت تقييماً من محمد الزبون بنسبة 5 نجوم ⭐',
        referenceId: 'review-1',
        referenceType: 'review',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      }
    ];
  }
}