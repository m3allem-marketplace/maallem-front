import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { BookingCancelComponent } from './booking-cancel/booking-cancel.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BookingConfirmComponent,
    BookingSuccessComponent,
    BookingCancelComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule
  ]
})
export class ServicesModule {}
