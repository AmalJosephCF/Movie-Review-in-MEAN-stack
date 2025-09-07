import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.services';

@Component({
  selector: 'app-admin-dashboard-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-dashboard-navbar.html',
  styleUrl: './admin-dashboard-navbar.css'
})
export class AdminDashboardNavbarComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  get currentUser(): any {
    return this.userService.getCurrentUser();
  }

  logout() {
    console.log('🔍 Admin Dashboard - Logout called');
    this.userService.logout();
    this.router.navigate(['/']); // Return to home page
  }
}
