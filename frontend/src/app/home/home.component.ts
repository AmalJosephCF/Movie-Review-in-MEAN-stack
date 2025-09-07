import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Poster } from '../user.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  posters: Poster[] = [];
  loading = false;
  error = '';
  selectedCategory = 'All';
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';

  categories = [
    'All', 'Action', 'Comedy', 'Drama', 'Horror', 
    'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Other'
  ];

  constructor(private userService: UserService ,private router: Router) {}

  ngOnInit() {
    this.loadPosters();
  }

  loadPosters() {
    this.loading = true;
    this.error = '';
    
    this.userService.getAllPosters(this.selectedCategory, this.currentPage).subscribe({
      next: (response) => {
        this.posters = response.posters;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posters';
        this.loading = false;
        console.error('Error loading posters:', err);
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
    
    const term = this.searchTerm.toLowerCase();
    return this.posters.filter(poster => 
      poster.title.toLowerCase().includes(term) ||
      poster.movieName.toLowerCase().includes(term) ||
      poster.review.toLowerCase().includes(term)
    );
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
