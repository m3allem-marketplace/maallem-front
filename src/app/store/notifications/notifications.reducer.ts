import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Notification } from '../../core/models/notification.model';
import { NotificationsActions } from './notifications.actions';

export interface NotificationsState extends EntityState<Notification> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
  selectId: (notification: Notification) => notification.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const initialState: NotificationsState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const notificationsReducer = createReducer(
  initialState,
  on(
    NotificationsActions.loadNotifications,
    NotificationsActions.markNotificationRead,
    NotificationsActions.markAllNotificationsRead,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(NotificationsActions.loadNotificationsSuccess, (state, { notifications }) =>
    adapter.setAll(notifications, { ...state, loading: false, error: null })
  ),
  on(NotificationsActions.markNotificationReadSuccess, (state, { id }) =>
    adapter.updateOne(
      { id, changes: { isRead: true } },
      { ...state, loading: false, error: null }
    )
  ),
  on(NotificationsActions.markAllNotificationsReadSuccess, (state) => {
    const updates = state.ids.map((id) => ({
      id: id as string,
      changes: { isRead: true },
    }));
    return adapter.updateMany(updates, { ...state, loading: false, error: null });
  }),
  on(
    NotificationsActions.loadNotificationsFailure,
    NotificationsActions.markNotificationReadFailure,
    NotificationsActions.markAllNotificationsReadFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(NotificationsActions.receiveNotification, (state, { notification }) =>
    adapter.addOne(notification, state)
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
