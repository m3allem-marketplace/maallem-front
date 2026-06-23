import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { TestApiComponent } from './test-api/test-api.component';
import { QScaleWorkspaceComponent } from './qscale-workspace/qscale-workspace.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'test-api', component: TestApiComponent },
  { path: 'test-ai', component: QScaleWorkspaceComponent },
  { path: 'qscale-workspace', component: QScaleWorkspaceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}