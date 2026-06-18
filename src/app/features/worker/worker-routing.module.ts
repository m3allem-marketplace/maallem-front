import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerDashboardComponent } from './dashboard/dashboard.component';
import { OpenJobsComponent } from './bids/open-jobs.component';
import { SubmitBidFormComponent } from './bids/submit-bid-form/submit-bid-form.component';
import { MyBidsComponent } from './bids/my-bids.component';
import { ServicesListComponent } from './services/services-list.component';
import { DirectOffersComponent } from './bids/direct-offers/direct-offers.component';

const routes: Routes = [
  { path: 'dashboard', component: WorkerDashboardComponent },
  { path: 'open-jobs', component: OpenJobsComponent },
  { path: 'open-jobs/:jobId/bid', component: SubmitBidFormComponent },
  { path: 'my-bids', component: MyBidsComponent },
  { path: 'services', component: ServicesListComponent },
  { path: 'direct-offers', component: DirectOffersComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerRoutingModule {}
