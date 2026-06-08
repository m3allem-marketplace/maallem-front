import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkerRoutingModule } from './worker-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { WorkerDashboardComponent } from './dashboard/dashboard.component';
import { OpenJobsComponent } from './bids/open-jobs.component';
import { SubmitBidFormComponent } from './bids/submit-bid-form/submit-bid-form.component';

@NgModule({
  declarations: [
    WorkerDashboardComponent,
    OpenJobsComponent,
    SubmitBidFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    WorkerRoutingModule,
    SharedModule,
  ]
})
export class WorkerModule {}
