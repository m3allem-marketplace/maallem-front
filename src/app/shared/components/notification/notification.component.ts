import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NotificationItem {
  id: string;
  type: 'booking' | 'bid' | 'system';
  message: string;
  timeAgo: string;
  read: boolean;
}

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

  transition:
    transform 200ms ease,
    opacity 200ms ease;
}

.clear-btn:hover {
  transform: translateY(-1px);
 
}

.clear-btn:focus,
.clear-btn:focus-visible {
  outline: none;
  border: none;
}

.clear-btn:active {
  transform: translateY(0);
}
  @keyframes notification-enter {
    from {
      opacity: 0;
      transform: translateY(12px) scale(.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .notification-item {
    transition: all 200ms ease;
  }

  .notification-item:hover {
    background: var(--color-primary-subtle);
  }

  .notification-icon {
    transition: transform 200ms ease;
  }

  .notification-item:hover .notification-icon {
    transform: scale(1.08);
  }
`]

})
export class NotificationComponent {

  // TODO: Replace with Store selectors
  notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'booking',
      message: 'تم استلام طلب حجز جديد',
      timeAgo: 'منذ دقيقتين',
      read: false
    },
    {
      id: '2',
      type: 'bid',
      message: 'تم قبول عرضك',
      timeAgo: 'منذ 15 دقيقة',
      read: false
    }
  ];

  clearAll(): void {
    // TODO: dispatch(ClearAll())
    this.notifications = [];
  }

  icon(type: string): string {
    switch (type) {
      case 'booking':
        return '📅';

      case 'bid':
        return '💰';

      default:
        return '🔔';
    }
  }
}