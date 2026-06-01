// AppModule placeholder
// Purpose: Root module that imports CoreModule, SharedModule, and routing

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CoreModule
    ],
    providers: [
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }