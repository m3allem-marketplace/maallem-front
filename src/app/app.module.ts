import { NgModule }              from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule }          from '@ngrx/store';
import { EffectsModule }        from '@ngrx/effects';
import { StoreDevtoolsModule }  from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { CoreModule }           from './core/core.module';
import { SharedModule }         from './shared/shared.module';
import { AppRoutingModule }     from './app.routing.module';
import { AppComponent }         from './app.component';

import { environment }          from '../environments/environment';
import { projectsReducer }       from './store/projects/projects.reducer';
import { ProjectsEffects }       from './store/projects/projects.effects';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // ── Core (singleton services + HttpClient) ──────────────────────────
    CoreModule,

    // ── Shared (components, pipes, directives) ──────────────────────────
    SharedModule,

    // ── Routing ──────────────────────────────────────────────────────────
    AppRoutingModule,

    // ── NgRx ─────────────────────────────────────────────────────────────
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('projects', projectsReducer),
    EffectsModule.forFeature([ProjectsEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge:   25,
      logOnly:  environment.production,
      autoPause: true,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
