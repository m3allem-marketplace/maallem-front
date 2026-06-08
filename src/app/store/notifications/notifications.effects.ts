import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationsActions } from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      mergeMap(() =>
        this.notificationService.getNotifications().pipe(
          map((notifications) => NotificationsActions.loadNotificationsSuccess({ notifications })),
          catchError((error) =>
            of(
              NotificationsActions.loadNotificationsFailure({
                error: error.message || 'Failed to load notifications',
              })
            )
          )
        )
      )
    )
  );

  markNotificationRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markNotificationRead),
      mergeMap((action) =>
        this.notificationService.markAsRead(action.id).pipe(
          map(() => NotificationsActions.markNotificationReadSuccess({ id: action.id })),
          catchError((error) =>
            of(
              NotificationsActions.markNotificationReadFailure({
                error: error.message || 'Failed to mark notification as read',
              })
            )
          )
        )
      )
    )
  );

  markAllNotificationsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAllNotificationsRead),
      mergeMap(() =>
        this.notificationService.markAllAsRead().pipe(
          map(() => NotificationsActions.markAllNotificationsReadSuccess()),
          catchError((error) =>
            of(
              NotificationsActions.markAllNotificationsReadFailure({
                error: error.message || 'Failed to mark all as read',
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) {}
}
