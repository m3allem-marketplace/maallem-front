import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { TestApiComponent } from './test-api/test-api.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'test-api', component: TestApiComponent },
];

@NgModule({
  declarations: [HomePageComponent, TestApiComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
