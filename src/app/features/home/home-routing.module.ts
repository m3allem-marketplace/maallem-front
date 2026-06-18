import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { TestApiComponent } from './test-api/test-api.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'test-api', component: TestApiComponent },
  { path: 'test-ai', component: AiAssistantComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}