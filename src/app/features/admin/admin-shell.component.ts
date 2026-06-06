import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css']
})
export class AdminShellComponent {
  activeTab: 'dashboard' | 'users' | 'bookings' | 'categories' | 'disputes' = 'dashboard';
  usersCount = 0;
  openDisputeCount = 0;

  constructor(public router: Router) {}

  setTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
  }
}
