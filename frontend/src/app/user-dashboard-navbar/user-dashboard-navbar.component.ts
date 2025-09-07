import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.services';

@Component({
  selector: 'app-user-dashboard-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './user-dashboard-navbar.html',
  styleUrl: './user-dashboard-navbar.css'
})
export class UserDashboardNavbarComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  get currentUser(): any {
    return this.userService.getCurrentUser();
  }

  logout() {
    console.log('🔍 User Dashboard - Logout called');
    this.userService.logout();
    this.router.navigate(['/']); // Return to home page
  }
}
