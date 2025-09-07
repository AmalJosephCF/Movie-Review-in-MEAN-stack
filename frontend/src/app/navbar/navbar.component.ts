import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  get currentUser(): any {
    return this.userService.getCurrentUser();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
