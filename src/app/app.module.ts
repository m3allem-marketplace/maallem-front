import { NgModule }              from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }     from '@angular/common/http';

import { StoreModule }          from '@ngrx/store';
import { EffectsModule }        from '@ngrx/effects';
import { StoreDevtoolsModule }  from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { CoreModule }           from './core/core.module';
import { SharedModule }         from './shared/shared.module';
import { AppRoutingModule }     from './app.routing.module';
import { AppComponent }         from './app.component';

import { environment }          from '../environments/environment';

// ── Our store slices (Projects + Proposals + Notifications) ─────────────────
import { projectsReducer }      from './store/projects/projects.reducer';
import { ProjectsEffects }      from './store/projects/projects.effects';
import { proposalsReducer }     from './store/proposals/proposals.reducer';
import { ProposalsEffects }     from './store/proposals/proposals.effects';
import { notificationsReducer } from './store/notifications/notifications.reducer';
import { NotificationsEffects } from './store/notifications/notifications.effects';

// ── Engineer 2's auth store slice ────────────────────────────────────────────
import { authReducer }          from '../store/auth/auth.reducer';
import { AuthEffects }          from '../store/auth/auth.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // ── Core (singleton services + interceptors) ───────────────────────
    CoreModule,

    // ── Shared (components, pipes, directives, UI kit) ─────────────────
    SharedModule,

    // ── Routing ───────────────────────────────────────────────────────
    AppRoutingModule,

    // ── NgRx Root ─────────────────────────────────────────────────────
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),

    // ── Auth feature slice (Engineer 2) ───────────────────────────────
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),

    // ── Projects feature slice ────────────────────────────────────────
    StoreModule.forFeature('projects', projectsReducer),
    EffectsModule.forFeature([ProjectsEffects]),

    // ── Proposals feature slice ───────────────────────────────────────
    StoreModule.forFeature('proposals', proposalsReducer),
    EffectsModule.forFeature([ProposalsEffects]),

    // ── Notifications feature slice ───────────────────────────────────
    StoreModule.forFeature('notifications', notificationsReducer),
    EffectsModule.forFeature([NotificationsEffects]),

    // ── Redux DevTools ────────────────────────────────────────────────
    StoreDevtoolsModule.instrument({
      maxAge:    25,
      logOnly:   environment.production,
      autoPause: true,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
