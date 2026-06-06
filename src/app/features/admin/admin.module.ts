import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AdminShellComponent }       from './admin-shell.component';
import { AdminDashboardComponent }   from './dashboard/admin-dashboard.component';
import { AdminUsersComponent }       from './users/admin-users.component';
import { AdminBookingsComponent }    from './bookings/admin-bookings.component';
import { AdminCategoriesComponent }  from './categories/admin-categories.component';
import { AdminDisputesComponent }    from './disputes/admin-disputes.component';

@NgModule({
  declarations: [
    AdminShellComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminBookingsComponent,
    AdminCategoriesComponent,
    AdminDisputesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule {}
