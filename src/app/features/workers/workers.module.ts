import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkersRoutingModule } from './workers-routing.module';
import { WorkersListComponent } from './workers-list/workers-list.component';
import { WorkerDetailComponent } from './worker-detail/worker-detail.component';
import { WorkerCardComponent } from '../../shared/components/worker-card/worker-card.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { MapPickerComponent } from '../../shared/components/map-picker/map-picker.component';
 
@NgModule({
  declarations: [
    WorkersListComponent,
    WorkerDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkersRoutingModule,
    WorkerCardComponent,
    AvatarComponent,
    MapPickerComponent
  ]
})
export class WorkersModule {}
