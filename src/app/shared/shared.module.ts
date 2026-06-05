// SharedModule placeholder
// Purpose: Module for shared components, directives, pipes
// export { WorkerSummary }         from './models/worker-summary.model';
// export { Category }              from './models/category.model';
// export { Pagination }            from './models/pagination.model';
// export { HasRoleDirective }      from './directives/has-role.directive';
// export { ClickOutsideDirective } from './directives/click-outside.directive';
// export { TimeAgoPipe }           from './pipes/time-ago.pipe';
// export { CurrencyFormatPipe }    from './pipes/currency-format.pipe';
// export { TruncatePipe }          from './pipes/truncate.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WorkerCardComponent } from './components/worker-card/worker-card.component';
import { TierBadgeComponent } from './components/tier-badge/tier-badge.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CategoryPickerComponent } from './components/category-picker/category-picker.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';

import { HasRoleDirective } from './directives/has-role.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    WorkerCardComponent,
    TierBadgeComponent,
    StarRatingComponent,
    AvatarComponent,
    SearchBarComponent,
    CategoryPickerComponent,
    ConfirmationDialogComponent,
    EmptyStateComponent,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,

    HasRoleDirective,
    ClickOutsideDirective,

    TimeAgoPipe,
    CurrencyFormatPipe,
    TruncatePipe,
  ],

  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    WorkerCardComponent,
    TierBadgeComponent,
    StarRatingComponent,
    AvatarComponent,
    SearchBarComponent,
    CategoryPickerComponent,
    ConfirmationDialogComponent,
    EmptyStateComponent,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,

    HasRoleDirective,
    ClickOutsideDirective,

    TimeAgoPipe,
    CurrencyFormatPipe,
    TruncatePipe,
  ]
})
export class SharedModule {}