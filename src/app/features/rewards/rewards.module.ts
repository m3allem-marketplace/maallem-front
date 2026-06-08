import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardsRoutingModule } from './rewards-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { TierProgressComponent } from './tier-progress/tier-progress.component';

@NgModule({
  declarations: [
    TierProgressComponent,
  ],
  imports: [
    CommonModule,
    RewardsRoutingModule,
    SharedModule,
  ]
})
export class RewardsModule {}
