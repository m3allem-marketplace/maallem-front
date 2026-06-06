import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TierProgressComponent } from './tier-progress/tier-progress.component';

const routes: Routes = [
  { path: '', component: TierProgressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardsRoutingModule {}
