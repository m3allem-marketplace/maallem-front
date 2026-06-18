import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MapPickerComponent } from '../../shared/components/map-picker/map-picker.component';

import { HomePageComponent } from './home-page/home-page.component';
import { TestApiComponent } from './test-api/test-api.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
import { HeroComponent } from './hero/hero.component';
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { FeaturedWorkersComponent } from './featured-workers/featured-workers.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';

@NgModule({
  declarations: [
    HomePageComponent,
    TestApiComponent,
    AiAssistantComponent,
    HeroComponent,
    CategoryGridComponent,
    FeaturedWorkersComponent,
    HowItWorksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule,
    MapPickerComponent
  ]
})
export class HomeModule {}
