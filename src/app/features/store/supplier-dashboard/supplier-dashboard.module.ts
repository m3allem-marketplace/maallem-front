import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSharedModule } from '../shared/store-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierDashboardRoutingModule } from './supplier-dashboard-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { SubmitItemComponent } from './pages/submit-item/submit-item.component';

@NgModule({
  declarations: [
    InventoryComponent,
    SubmitItemComponent
  ],
  imports: [
    CommonModule,
    StoreSharedModule,
    SupplierDashboardRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    InventoryComponent
  ]
})
export class SupplierDashboardModule {}

