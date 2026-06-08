import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationListComponent } from './notification-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    NotificationListComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
  ]
})
export class NotificationsModule {}
