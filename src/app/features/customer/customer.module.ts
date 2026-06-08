import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingCardComponent } from './bookings/booking-card/booking-card.component';
import { BookingDetailComponent } from './bookings/booking-detail/booking-detail.component';
import { BidRequestsComponent } from './bid-requests/bid-requests.component';
import { PostJobFormComponent } from './bid-requests/post-job-form/post-job-form.component';
import { BidOffersListComponent } from './bid-requests/bid-offers-list/bid-offers-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    BookingsComponent,
    BookingCardComponent,
    BookingDetailComponent,
    BidRequestsComponent,
    PostJobFormComponent,
    BidOffersListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule {}
