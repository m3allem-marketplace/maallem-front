import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  },
  {
    path: 'supplier-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./supplier-dashboard/supplier-dashboard.module').then(m => m.SupplierDashboardModule)
  },
  {
    path: 'worker-portal',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./worker-portal/worker-portal.module').then(m => m.WorkerPortalModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule {}
