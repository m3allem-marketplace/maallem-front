import { Component } from '@angular/core';
import { ToastContainerComponent } from '@m3allem/ui-kit';

@Component({
  selector:    'app-root',
  standalone:  false,
  template: `
    <router-outlet></router-outlet>
    <app-toast-container></app-toast-container>
  `,
})
export class AppComponent {}
