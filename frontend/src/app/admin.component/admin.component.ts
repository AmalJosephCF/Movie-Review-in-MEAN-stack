import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, Poster } from '../user.services';

import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  pendingPosters: Poster[] = [];
  allPosters: Poster[] = [];   // ✅ For Manage Posters
  loading = false;
  error = '';
  success = '';
  activeTab: 'users' | 'approvePosters' | 'managePosters' = 'users'; 

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
    this.loadPendingPosters();
    this.loadAllPosters(); 
  }

  // ===================== USER MANAGEMENT =====================
  loadUsers() {
    this.loading = true;
    this.error = '';
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  updateUserRole(user: User, newRole: 'user' | 'admin') {
    if (!user._id) return;
    
    this.userService.updateUserRole(user._id, newRole).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.success = `User ${user.fullName} role updated to ${newRole}`;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to update user role';
        console.error('Error updating user role:', err);
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  onRoleChange(user: User, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value as 'user' | 'admin';
    this.updateUserRole(user, newRole);
  }

  isLastAdmin(user: User): boolean {
    return user.role === 'admin' && this.users.filter(u => u.role === 'admin').length === 1;
  }

  getRoleBadgeClass(role: string | undefined): string {
    return role === 'admin' ? 'badge-admin' : 'badge-user';
  }

  // ===================== POSTER MANAGEMENT =====================
  loadPendingPosters() {
    this.userService.getPendingPosters().subscribe({
      next: (posters) => {
        this.pendingPosters = posters;
      },
      error: (err) => {
        console.error('Error loading pending posters:', err);
      }
    });
  }

  loadAllPosters() {   // ✅ FIXED → use admin endpoint
    this.userService.getAllPostersForAdmin().subscribe({
      next: (posters) => {
        this.allPosters = posters;
      },
      error: (err) => {
        console.error('Error loading all posters:', err);
      }
    });
  }

  approvePoster(poster: Poster) {
    if (!poster._id) return;
    
    this.userService.approvePoster(poster._id).subscribe({
      next: () => {
        this.success = `Poster "${poster.title}" approved successfully!`;
        this.pendingPosters = this.pendingPosters.filter(p => p._id !== poster._id);
        this.loadAllPosters(); // refresh list
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to approve poster';
        console.error('Error approving poster:', err);
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  rejectPoster(poster: Poster) {
    if (!poster._id) return;
    
    if (confirm(`Are you sure you want to reject "${poster.title}"? This action cannot be undone.`)) {
      this.userService.rejectPoster(poster._id).subscribe({
        next: () => {
          this.success = `Poster "${poster.title}" rejected and deleted`;
          this.pendingPosters = this.pendingPosters.filter(p => p._id !== poster._id);
          this.loadAllPosters(); // refresh list
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to reject poster';
          console.error('Error rejecting poster:', err);
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  deletePoster(poster: Poster) {
    if (!poster._id) return;

    if (confirm(`Are you sure you want to permanently delete "${poster.title}"?`)) {
      this.userService.deletePoster(poster._id).subscribe({
        next: () => {
          this.success = `Poster "${poster.title}" deleted successfully!`;
          this.pendingPosters = this.pendingPosters.filter(p => p._id !== poster._id);
          this.allPosters = this.allPosters.filter(p => p._id !== poster._id);
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete poster';
          console.error('Error deleting poster:', err);
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  // ===================== UTIL =====================
  setActiveTab(tab: 'users' | 'approvePosters' | 'managePosters') {
    this.activeTab = tab;
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? '★' : '☆');
  }
    viewPoster(id: string | undefined) {
  if (!id) {
    console.error("Poster ID is missing");
    return;
  }
  this.router.navigate(['/poster', id]);
    }
}
