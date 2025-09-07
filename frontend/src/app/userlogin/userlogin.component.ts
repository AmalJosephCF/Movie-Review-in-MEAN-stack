import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Poster } from '../user.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css'
})
export class UserloginComponent implements OnInit {
  posters: Poster[] = [];
  loading = false;
  error = '';
  selectedCategory = 'All';
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadPosters();
  }

  loadPosters() {
    this.loading = true;
    this.error = '';
    
    this.userService.getAllPosters(this.selectedCategory, this.currentPage).subscribe({
      next: (response) => {
        this.posters = response.posters || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
        console.log('🎬 User Dashboard - Posters loaded:', this.posters.length);
      },
      error: (err) => {
        this.error = 'Failed to load posters. Please try again.';
        this.loading = false;
        console.error('❌ User Dashboard - Error loading posters:', err);
      }
    });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadPosters();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadPosters();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosters();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPosters();
    }
  }

  getFilteredPosters(): Poster[] {
    if (!this.searchTerm.trim()) {
      return this.posters;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.posters.filter(poster => 
      poster.title.toLowerCase().includes(searchLower) ||
      poster.movieName.toLowerCase().includes(searchLower) ||
      poster.category.toLowerCase().includes(searchLower) ||
      poster.review.toLowerCase().includes(searchLower)
    );
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '⭐' : '☆');
    }
    return stars;
  }
  viewPoster(id: string | undefined) {
  if (!id) {
    console.error("Poster ID is missing");
    return;
  }
  this.router.navigate(['/poster', id]);
}
}
