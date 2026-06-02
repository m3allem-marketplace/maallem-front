import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Auth feature slice
import { authReducer } from '../store/auth/auth.reducer';
import { AuthEffects } from '../store/auth/auth.effects';

import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CoreModule,

        // Root store (no root reducers yet — feature slices are loaded below)
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),

        // Auth feature store
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects]),

        // Redux DevTools (disabled in production)
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
    ],
    providers: [
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }