import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState, selectAll } from './notifications.reducer';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  selectAll
);

export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state) => state.loading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state) => state.error
);

export const selectUnreadCount = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter((n) => !n.isRead).length
);
