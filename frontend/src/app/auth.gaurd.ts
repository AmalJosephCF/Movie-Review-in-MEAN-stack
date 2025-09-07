// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      return true;  // allow navigation
    } else {
      this.router.navigate(['/login']); // redirect to login
      return false;
    }
  }
}
