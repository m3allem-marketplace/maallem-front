import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./features/services/services.module').then(m => m.ServicesModule),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./features/customer/customer.module').then(m => m.CustomerModule),
  },
  {
    path: 'worker',
    loadChildren: () =>
      import('./features/worker/worker.module').then(m => m.WorkerModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
  },
  {
    path: 'rewards',
    loadChildren: () =>
      import('./features/rewards/rewards.module').then(m => m.RewardsModule),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks.module').then(m => m.TasksModule),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./features/chat/chat.module').then(m => m.ChatModule),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('./features/master/master.module').then(m => m.MasterModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
