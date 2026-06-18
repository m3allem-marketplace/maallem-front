import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileDashboardComponent } from './profile-dashboard.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { MapPickerComponent } from '../../shared/components/map-picker/map-picker.component';

@NgModule({
  declarations: [
    ProfileDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    AvatarComponent,
    MapPickerComponent
  ]
})
export class ProfileModule {}
