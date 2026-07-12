import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ── Directives ────────────────────────────────────────────────────────────────
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { HasRoleDirective } from './directives/has-role.directive';

// ── Pipes ─────────────────────────────────────────────────────────────────────
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

// ── Components ────────────────────────────────────────────────────────────────
import { AvatarComponent } from './components/avatar/avatar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { TierBadgeComponent } from './components/tier-badge/tier-badge.component';
import { WorkerCardComponent } from './components/worker-card/worker-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalAiAssistantComponent } from './components/global-ai-assistant/global-ai-assistant.component';

// ── Shared UI Components ──────────────────────────────────────────────────────
import { StatusChipComponent } from './ui/status-chip/status-chip.component';
import { BookingTimelineComponent } from './ui/booking-timeline/booking-timeline.component';
import { ConfirmModalComponent } from './ui/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { PriceSummaryCardComponent } from './ui/price-summary-card/price-summary-card.component';
import { StepWizardComponent } from './ui/step-wizard/step-wizard.component';
import { StatsCardComponent } from './ui/stats-card/stats-card.component';
import { MapPickerComponent } from './components/map-picker/map-picker.component';
import { MockPaymentModalComponent } from './ui/mock-payment-modal/mock-payment-modal.component';

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
const PIPES = [TimeAgoPipe, CurrencyFormatPipe, TruncatePipe];
const COMPONENTS = [
  AvatarComponent, SearchBarComponent, StarRatingComponent,
  TierBadgeComponent, WorkerCardComponent, NavbarComponent, FooterComponent,
  GlobalAiAssistantComponent,
  StatusChipComponent, BookingTimelineComponent, ConfirmModalComponent,
  EmptyStateComponent, PriceSummaryCardComponent, StepWizardComponent, StatsCardComponent,
  MapPickerComponent, MockPaymentModalComponent
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
export class SharedModule { }

// ── Model barrel exports ───────────────────────────────────────────────────────
export { WorkerSummary } from './models/worker-summary.model';
export { Category } from './models/category.model';
export { PaginationMeta, PaginatedResponse, PaginationParams } from './models/pagination.model';
export { HasRoleDirective } from './directives/has-role.directive';
export { ClickOutsideDirective } from './directives/click-outside.directive';
export { TimeAgoPipe } from './pipes/time-ago.pipe';
export { CurrencyFormatPipe } from './pipes/currency-format.pipe';
export { TruncatePipe } from './pipes/truncate.pipe';
