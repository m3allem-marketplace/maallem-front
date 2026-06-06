import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { BookingCancelComponent } from './booking-cancel/booking-cancel.component';

const routes: Routes = [
  { path: 'booking-confirm/:proposalId', component: BookingConfirmComponent },
  { path: 'booking-success/:bookingId', component: BookingSuccessComponent },
  { path: 'booking-cancel/:bookingId', component: BookingCancelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
