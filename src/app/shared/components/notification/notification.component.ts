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

    this.sub = this.notifications$.subscribe(n => {
      this.notifications = n || [];
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

  getIconBgClass(type: string): string {
    const map: Record<string, string> = {
      BOOKING_CONFIRMED: 'bg-emerald-50 text-emerald-600 border border-emerald-100/60',
      BOOKING_COMPLETED: 'bg-emerald-50 text-emerald-600 border border-emerald-100/60',
      BOOKING_CANCELLED: 'bg-rose-50 text-rose-600 border border-rose-100/60',
      BID_RECEIVED:      'bg-amber-50 text-amber-600 border border-amber-100/60',
      BID_ACCEPTED:      'bg-amber-50 text-amber-600 border border-amber-100/60',
      BID_REJECTED:      'bg-rose-50 text-rose-600 border border-rose-100/60',
      REVIEW_RECEIVED:   'bg-indigo-50 text-indigo-600 border border-indigo-100/60',
      SYSTEM:            'bg-slate-50 text-slate-600 border border-slate-100/60',
    };
    return map[type] || 'bg-slate-50 text-slate-600 border border-slate-100/60';
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
}