import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { TestApiComponent } from './test-api/test-api.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'test-api', component: TestApiComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}