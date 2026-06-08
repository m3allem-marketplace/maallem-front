import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Notification } from '../../core/models/notification.model';

export const NotificationsActions = createActionGroup({
  source: 'Notifications API',
  events: {
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{ notifications: Notification[] }>(),
    'Load Notifications Failure': props<{ error: string }>(),

    'Mark Notification Read': props<{ id: string }>(),
    'Mark Notification Read Success': props<{ id: string }>(),
    'Mark Notification Read Failure': props<{ error: string }>(),

    'Mark All Notifications Read': emptyProps(),
    'Mark All Notifications Read Success': emptyProps(),
    'Mark All Notifications Read Failure': props<{ error: string }>(),

    'Receive Notification': props<{ notification: Notification }>(),
  },
});
