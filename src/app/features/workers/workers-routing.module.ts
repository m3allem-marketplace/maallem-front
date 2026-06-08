import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkersListComponent } from './workers-list/workers-list.component';
import { WorkerDetailComponent } from './worker-detail/worker-detail.component';

const routes: Routes = [
  { path: '', component: WorkersListComponent },
  { path: ':id', component: WorkerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkersRoutingModule {}
