import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ── Directives ────────────────────────────────────────────────────────────────
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { HasRoleDirective }      from './directives/has-role.directive';

// ── Pipes ─────────────────────────────────────────────────────────────────────
import { TimeAgoPipe }        from './pipes/time-ago.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TruncatePipe }       from './pipes/truncate.pipe';

// ── Components ────────────────────────────────────────────────────────────────
import { AvatarComponent }     from './components/avatar/avatar.component';
import { SearchBarComponent }  from './components/search-bar/search-bar.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { TierBadgeComponent }  from './components/tier-badge/tier-badge.component';
import { WorkerCardComponent } from './components/worker-card/worker-card.component';

// ── UI Kit ────────────────────────────────────────────────────────────────────
import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  ChipComponent,
  SpinnerComponent,
  SelectComponent,
  ToastService,
  ToastContainerComponent,
} from '@m3allem/ui-kit';

const DIRECTIVES = [ClickOutsideDirective, HasRoleDirective];
const PIPES      = [TimeAgoPipe, CurrencyFormatPipe, TruncatePipe];
const COMPONENTS = [
  AvatarComponent, SearchBarComponent, StarRatingComponent,
  TierBadgeComponent, WorkerCardComponent,
];
const UI_KIT = [
  ButtonComponent, InputComponent, ModalComponent,
  ChipComponent, SpinnerComponent, SelectComponent, ToastContainerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...DIRECTIVES,
    ...PIPES,
    ...COMPONENTS,
    ...UI_KIT,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...DIRECTIVES,
    ...PIPES,
    ...COMPONENTS,
    ...UI_KIT,
  ],
  providers: [ToastService],
})
export class SharedModule {}

// ── Model barrel exports ───────────────────────────────────────────────────────
export { WorkerSummary }    from './models/worker-summary.model';
export { Category }         from './models/category.model';
export { PaginationMeta, PaginatedResponse, PaginationParams } from './models/pagination.model';