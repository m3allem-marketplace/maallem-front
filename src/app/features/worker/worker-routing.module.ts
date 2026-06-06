import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerDashboardComponent } from './dashboard/dashboard.component';
import { OpenJobsComponent } from './bids/open-jobs.component';
import { SubmitBidFormComponent } from './bids/submit-bid-form/submit-bid-form.component';

const routes: Routes = [
  { path: 'dashboard', component: WorkerDashboardComponent },
  { path: 'open-jobs', component: OpenJobsComponent },
  { path: 'open-jobs/:jobId/bid', component: SubmitBidFormComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerRoutingModule {}
