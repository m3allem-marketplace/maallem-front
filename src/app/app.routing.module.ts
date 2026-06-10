import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomerGuard } from './core/guards/customer.guard';
import { WorkerGuard } from './core/guards/worker.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MasterGuard } from './core/guards/master.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'workers',
    loadChildren: () => import('./features/workers/workers.module').then(m => m.WorkersModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [AuthGuard, CustomerGuard]
  },
  {
    path: 'worker',
    loadChildren: () => import('./features/worker/worker.module').then(m => m.WorkerModule),
    canActivate: [AuthGuard, WorkerGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rewards',
    loadChildren: () => import('./features/rewards/rewards.module').then(m => m.RewardsModule),
    canActivate: [AuthGuard, WorkerGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'master',
    loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule),
    canActivate: [AuthGuard, MasterGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'about-us',
    loadChildren: () => import('./features/about-us/about-us.module').then(m => m.AboutUsModule)
  },
  {
    path: 'settings',
    redirectTo: 'profile'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
