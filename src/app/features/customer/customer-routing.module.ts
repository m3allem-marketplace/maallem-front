import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingDetailComponent } from './bookings/booking-detail/booking-detail.component';
import { BidRequestsComponent } from './bid-requests/bid-requests.component';
import { PostJobFormComponent } from './bid-requests/post-job-form/post-job-form.component';
import { BidOffersListComponent } from './bid-requests/bid-offers-list/bid-offers-list.component';
import { FlatRenovationComponent } from './flat-renovation/flat-renovation.component';

const routes: Routes = [
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'bookings/:bookingId', component: BookingDetailComponent },
  { path: 'bid-requests', component: BidRequestsComponent },
  { path: 'bid-requests/post', component: PostJobFormComponent },
  { path: 'bid-requests/:projectId/offers', component: BidOffersListComponent },
  { path: 'flat-renovation', component: FlatRenovationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
