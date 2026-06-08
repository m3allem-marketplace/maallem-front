import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileDashboardComponent } from './profile-dashboard.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@NgModule({
  declarations: [
    ProfileDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    AvatarComponent
  ]
})
export class ProfileModule {}
