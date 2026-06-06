import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Notification, NotificationType } from '../../core/models/notification.model';
import { NotificationsActions } from '../../store/notifications/notifications.actions';
import {
  selectAllNotifications,
  selectNotificationsLoading,
  selectUnreadCount
} from '../../store/notifications/notifications.selectors';

interface NotificationGroup {
  label: string;
  items: Notification[];
}

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  loading = false;
  groups: NotificationGroup[] = [];
  unreadCount = 0;

  private subs: Subscription[] = [];

  constructor(
    private store: Store,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(NotificationsActions.loadNotifications());

    this.subs.push(
      this.store.select(selectNotificationsLoading).subscribe(l => (this.loading = l))
    );

    this.subs.push(
      this.store.select(selectAllNotifications).subscribe(notifs => {
        const source = notifs.length > 0 ? notifs : this.getMockNotifications();
        this.groups = this.groupByDate(source);
      })
    );

    this.subs.push(
      this.store.select(selectUnreadCount).subscribe(c => (this.unreadCount = c))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  markRead(id: string): void {
    this.store.dispatch(NotificationsActions.markNotificationRead({ id }));
    // Optimistic local update
    this.groups = this.groups.map(g => ({
      ...g,
      items: g.items.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
    if (this.unreadCount > 0) this.unreadCount--;
  }

  markAllRead(): void {
    this.store.dispatch(NotificationsActions.markAllNotificationsRead());
    this.groups = this.groups.map(g => ({
      ...g,
      items: g.items.map(n => ({ ...n, isRead: true }))
    }));
    this.unreadCount = 0;
  }

  getIcon(type: NotificationType | string): string {
    const map: Record<string, string> = {
      BOOKING_CONFIRMED: '📅', BOOKING_CANCELLED: '❌', BOOKING_COMPLETED: '✅',
      BID_RECEIVED:      '💼', BID_ACCEPTED:      '🎉', BID_REJECTED:      '😔',
      REVIEW_RECEIVED:   '⭐', SYSTEM:            '🔔',
    };
    return map[type] || '🔔';
  }

  getTypeLabel(type: NotificationType | string): string {
    const map: Record<string, string> = {
      BOOKING_CONFIRMED: 'حجز', BOOKING_CANCELLED: 'حجز', BOOKING_COMPLETED: 'حجز',
      BID_RECEIVED: 'عرض سعر', BID_ACCEPTED: 'عرض سعر', BID_REJECTED: 'عرض سعر',
      REVIEW_RECEIVED: 'تقييم', SYSTEM: 'إشعار عام',
    };
    return map[type] || 'إشعار';
  }

  formatTime(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  private groupByDate(notifs: Notification[]): NotificationGroup[] {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    const todayItems    = notifs.filter(n => new Date(n.createdAt) >= today);
    const yesterdayItems = notifs.filter(n => {
      const d = new Date(n.createdAt);
      return d >= yesterday && d < today;
    });
    const olderItems    = notifs.filter(n => new Date(n.createdAt) < yesterday);

    const groups: NotificationGroup[] = [];
    if (todayItems.length)     groups.push({ label: 'اليوم',    items: todayItems });
    if (yesterdayItems.length) groups.push({ label: 'أمس',      items: yesterdayItems });
    if (olderItems.length)     groups.push({ label: 'سابقاً',   items: olderItems });
    return groups;
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: '1', userId: 'u1',
        type: NotificationType.BID_ACCEPTED,
        title: 'تم قبول عرضك 🎉',
        body: 'قبل أحمد العميل عرضك على وظيفة "تصليح خطوط السباكة للحمام". يمكنك التواصل معه الآن لتحديد ميعاد البدء.',
        referenceId: 'bid-1', referenceType: 'bid_request',
        isRead: false, createdAt: new Date(Date.now() - 2 * 60000).toISOString()
      },
      {
        id: '2', userId: 'u1',
        type: NotificationType.BOOKING_CONFIRMED,
        title: 'تأكيد الحجز',
        body: 'تم تأكيد حجزك بنجاح. سيصل المعلم محمود السباك يوم الخميس القادم الساعة 10 صباحاً.',
        referenceId: 'booking-1', referenceType: 'booking',
        isRead: false, createdAt: new Date(Date.now() - 25 * 60000).toISOString()
      },
      {
        id: '3', userId: 'u1',
        type: NotificationType.BID_RECEIVED,
        title: 'عرض سعر جديد',
        body: 'تلقيت عرض سعر جديد من أحمد الكهربائي على طلبك "تثبيت نجف ومفاتيح كهربائية".',
        referenceId: 'proj-2', referenceType: 'bid_request',
        isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '4', userId: 'u1',
        type: NotificationType.REVIEW_RECEIVED,
        title: 'تقييم جديد',
        body: 'تلقيت تقييماً من سارة محمد بنسبة 5 نجوم وتعليق إيجابي على جودة العمل.',
        referenceId: 'review-1', referenceType: 'review',
        isRead: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        id: '5', userId: 'u1',
        type: NotificationType.BOOKING_COMPLETED,
        title: 'اكتمل العمل ✅',
        body: 'تم وضع علامة اكتمال على وظيفة "دهان غرفة نوم أطفال". يرجى تقييم المعلم مصطفى النقاش.',
        referenceId: 'booking-2', referenceType: 'booking',
        isRead: true, createdAt: new Date(Date.now() - 26 * 3600000).toISOString()
      },
      {
        id: '6', userId: 'u1',
        type: NotificationType.SYSTEM,
        title: 'مرحباً بك في منصة معلم! 👋',
        body: 'شكراً لانضمامك. يمكنك الآن تصفح آلاف المعلمين المهرة في جميع أنحاء مصر.',
        referenceId: null, referenceType: null,
        isRead: true, createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
      }
    ];
  }

  get totalCount(): number {
    return this.groups.reduce((s, g) => s + g.items.length, 0);
  }
}
