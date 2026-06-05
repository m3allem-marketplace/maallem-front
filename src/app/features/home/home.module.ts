// HomeModule placeholder
// Purpose: Feature module for home feature (lazy-loaded)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeroComponent } from './hero/hero.component';
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { FeaturedWorkersComponent } from './featured-workers/featured-workers.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { WorkerCardComponent } from '../../shared/components/worker-card/worker-card.component';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
@NgModule({
  declarations: [
    HomePageComponent,
    HeroComponent,
    CategoryGridComponent,
    FeaturedWorkersComponent,
    HowItWorksComponent,
  ],
imports: [
  CommonModule,
  RouterModule,
  HomeRoutingModule,
  SearchBarComponent,
  WorkerCardComponent,
  ClickOutsideDirective
]
})
export class HomeModule {}