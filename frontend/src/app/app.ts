import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminDashboardNavbarComponent } from './admin-dashboard-navbar/admin-dashboard-navbar.component';
import { UserDashboardNavbarComponent } from './user-dashboard-navbar/user-dashboard-navbar.component';
import { NgIf } from '@angular/common'; // <-- import NgIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf, // <-- add here
    NavbarComponent,
    AdminDashboardNavbarComponent,
    UserDashboardNavbarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('reactForm');

  role = signal<string | null>(localStorage.getItem('role'));

  showHomeNavbar = computed(() => this.role() === null);
  showUserNavbar = computed(() => this.role() === 'user');
  showAdminNavbar = computed(() => this.role() === 'admin');
}
