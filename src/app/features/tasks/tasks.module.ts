import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TasksRoutingModule
  ]
})
export class TasksModule {}
